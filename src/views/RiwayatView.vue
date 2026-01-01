<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import {
  Calendar,
  BookOpen,
  ClipboardList,
} from "lucide-vue-next";
import { useConsultationStore } from "../stores/consultation";
import { useTrackerStore } from "../stores/tracker";
import { useEducationStore } from "../stores/education";
import { storeToRefs } from "pinia";

// Stores
const consultationStore = useConsultationStore();
const trackerStore = useTrackerStore();
const educationStore = useEducationStore();
const { history: consultationHistory } = storeToRefs(consultationStore);
const { history: trackerHistory } = storeToRefs(trackerStore);
const { history: educationHistory } = storeToRefs(educationStore);

// Stats
const stats = ref([
  {
    label: "Konsultasi Selesai",
    count: 0,
    icon: Calendar,
    color: "#ffffff",
    bg: "#5AB2A8",
  },
  {
    label: "Tracker Diikuti",
    count: 0,
    icon: ClipboardList,
    color: "#ffffff",
    bg: "#FFB74D",
  },
  {
    label: "Artikel Dibaca",
    count: 0,
    icon: BookOpen,
    color: "#ffffff",
    bg: "#64B5F6",
  },
]);

// Activity Data
const allActivities = ref([]);
const visibleActivities = ref([]);
const displayLimit = ref(3);
const isLoading = ref(false);
const showNoMoreData = ref(false);

const router = useRouter();
const isModalOpen = ref(false);
const selectedActivity = ref(null);

onMounted(() => {
  const allItems = [];

  // 1. Fetch Appointments from Store
  const completedAppointments = consultationHistory.value;
  if (completedAppointments.length > 0) {
    allItems.push(...completedAppointments.map(c => ({
        id: c.id,
        type: "Konsultasi",
        typeLabel: "Konsultasi",
        icon: Calendar,
        iconColor: "#5AB2A8",
        date: `${c.date} • ${c.time}`,
        title: `Konsultasi dengan ${c.consultant.name}`,
        desc: `Sesi konsultasi dengan ${c.consultant.role}`,
        link: "Lihat Detail",
        action: "Booking Ulang",
        consultantId: c.consultant.id
    })));

    stats.value[0].count = completedAppointments.length;
  }

  // 2. Fetch Tracker History from Store
  const trackerRecords = trackerHistory.value;
  if (trackerRecords.length > 0) {
    allItems.push(...trackerRecords.map(t => ({
      id: t.id,
      type: "Tracker",
      typeLabel: "Tracker",
      icon: ClipboardList,
      iconColor: "#FFB74D",
      date: `${t.date} • ${t.time}`,
      title: t.title,
      desc: t.desc,
      link: "Lihat Detail",
      action: "Isi Ulang",
      resultLevel: t.resultLevel
    })));

    stats.value[1].count = trackerRecords.length;
  }

  // 3. Fetch Article History from Store
  const articleRecords = educationHistory.value;
  if (articleRecords.length > 0) {
    allItems.push(...articleRecords.map(a => ({
      id: a.id,
      type: "Edukasi",
      typeLabel: "Edukasi",
      icon: BookOpen,
      iconColor: "#64B5F6",
      date: `${a.date} • ${a.time}`,
      title: a.title,
      desc: a.desc,
      link: "Lihat Detail",
      action: "Baca Ulang",
      articleId: a.articleId
    })));

    stats.value[2].count = articleRecords.length;
  }

  // Sort by ID (timestamp) descending
  allItems.sort((a, b) => b.id - a.id);

  allActivities.value = allItems;
  visibleActivities.value = allActivities.value.slice(0, displayLimit.value);
});

const loadMore = async () => {
  // Jika semua item sudah tampil, fungsi menjadi "Tampilkan Lebih Sedikit"
  if (visibleActivities.value.length >= allActivities.value.length) {
    displayLimit.value = 3;
    visibleActivities.value = allActivities.value.slice(0, displayLimit.value);
    
    // Opsional: scroll kembali ke atas timeline
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
      timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  // Sebaliknya, fungsi menjadi "Muat Lebih Banyak"
  isLoading.value = true;
  showNoMoreData.value = false;
  
  // Simulasi network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  displayLimit.value += 3;
  visibleActivities.value = allActivities.value.slice(0, displayLimit.value);

  isLoading.value = false;
};

const viewDetail = (item) => {
  selectedActivity.value = item;
  isModalOpen.value = true;
};

const handleAction = (item) => {
  if (item.action === "Booking Ulang" && item.consultantId) {
    router.push({ path: '/konsultasi', query: { consultantId: item.consultantId } });
  } else if (item.action === "Isi Ulang") {
    router.push('/tracker');
  } else if (item.link === "Baca Lagi" && item.articleId) {
    router.push(`/edukasi/artikel${item.articleId}`);
  } else if (item.action === "Bagikan") {
    alert("Fitur Bagikan akan segera tersedia!");
  } else if (item.action === "Baca Ulang") {
    router.push(`/edukasi/artikel${item.articleId}`);
  }
};
</script>

<template>
  <div class="riwayat-page">
    <Navbar />

    <div class="container main-content">
      <h1 class="page-title">Riwayat Aktivitas</h1>

      <!-- Stats Summary -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div
            class="stat-icon"
            :style="{ backgroundColor: stat.bg, color: stat.color }"
          >
            <component :is="stat.icon" :size="24" stroke-width="2" />
          </div>
          <div class="stat-info">
            <span class="stat-count">{{ stat.count }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="visibleActivities.length > 0" class="timeline-container">
        <!-- Main Timeline Line -->
        <div class="timeline-line"></div>

        <!-- Activity Items -->
        <div v-for="item in visibleActivities" :key="item.id" class="timeline-item">
          <!-- Icon Marker -->
          <div class="timeline-marker">
            <div
              class="icon-circle"
              :style="{ backgroundColor: item.iconColor }"
            >
              <component
                :is="item.icon"
                :size="20"
                color="white"
                stroke-width="2"
              />
            </div>
          </div>

          <!-- Content Card -->
          <div class="activity-card">
            <div class="card-header">
              <span class="type-tag" :class="item.type.toLowerCase()">{{
                item.typeLabel
              }}</span>
              <span class="date-text">{{ item.date }}</span>
            </div>

            <h3 class="activity-title">{{ item.title }}</h3>
            <p class="activity-desc">{{ item.desc }}</p>

            <div class="card-actions">
              <span class="link-action primary" @click="viewDetail(item)">{{ item.link }}</span>
              <span class="dot-separator">•</span>
              <span class="link-action secondary" @click="handleAction(item)">{{ item.action }}</span>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div class="load-more-wrapper" v-if="allActivities.length > 3">
          <button 
            class="load-more-btn" 
            @click="loadMore" 
            :disabled="isLoading"
          >
            {{ isLoading ? 'Memuat...' : (visibleActivities.length >= allActivities.length ? 'Lihat Lebih Sedikit' : 'Muat Lebih Banyak Riwayat') }}
          </button>
        </div>
      </div>

       <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon-bg">
           <ClipboardList :size="48" color="#94a3b8" />
        </div>
        <h3 class="empty-title">Belum Ada Aktivitas</h3>
        <p class="empty-desc">Aktivitas konsultasi, edukasi, dan survey Anda akan muncul di sini.</p>
        
        <router-link to="/konsultasi" class="start-btn">Mulai Konsultasi</router-link>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click="isModalOpen = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Detail Aktivitas</h3>
            <button class="close-btn" @click="isModalOpen = false">&times;</button>
          </div>
          
          <div class="modal-body" v-if="selectedActivity">
            <div class="detail-row">
              <span class="detail-label">Jenis Aktivitas</span>
              <span class="detail-value">{{ selectedActivity.typeLabel }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Topik</span>
              <span class="detail-value">{{ selectedActivity.title }}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Keterangan</span>
              <span class="detail-value">{{ selectedActivity.desc }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Waktu</span>
              <span class="detail-value">{{ selectedActivity.date }}</span>
            </div>

            <div class="detail-row">
               <span class="detail-label">Status</span>
               <span class="detail-value" style="color: #5ab2a8; font-weight: 700;">Selesai</span>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="isModalOpen = false">Tutup</button>
            <button class="btn-primary" @click="handleAction(selectedActivity)">{{ selectedActivity?.action }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped src="@/assets/css/riwayat.css"></style>
