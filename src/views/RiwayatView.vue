<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import {
  Stethoscope,
  BookOpen,
  ClipboardList,
  CheckCircle,
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
    icon: Stethoscope,
    color: "#5AB2A8",
    bg: "#E0F2F1",
  },
  {
    label: "Tracker Diikuti",
    count: 0,
    icon: ClipboardList,
    color: "#FFB74D",
    bg: "#FFF3E0",
  },
  {
    label: "Artikel Dibaca",
    count: 0,
    icon: BookOpen,
    color: "#64B5F6",
    bg: "#E3F2FD",
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
        icon: Stethoscope,
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
      link: "Baca Lagi",
      action: "Bagikan",
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
  // If all items are currently visible, this acts as "Show Less"
  if (visibleActivities.value.length >= allActivities.value.length) {
    displayLimit.value = 3;
    visibleActivities.value = allActivities.value.slice(0, displayLimit.value);
    
    // Optional: smooth scroll back to top of timeline
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
      timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  // Otherwise, it acts as "Load More"
  isLoading.value = true;
  showNoMoreData.value = false;
  
  // Simulate network delay for UX
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

<style scoped>
.riwayat-page {
  min-height: 100vh;
  background-color: #f0fdf9; /* Light mint bg matching image */
  padding-bottom: 60px;
}

.main-content {
  padding-top: 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 40px;
  padding-left: 20px; /* Align with cards roughly */
}

.timeline-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto 60px;
  padding-left: 30px; /* Space for markers */
}

/* Vertical Line */
.timeline-line {
  position: absolute;
  left: 30px; /* Center of marker */
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #a3e4d7; /* Light Green line */
  transform: translateX(-50%);
  z-index: 0;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
}

/* Marker */
.timeline-marker {
  position: absolute;
  left: 0; /* Relative to timeline container padding */
  transform: translateX(-50%);
  z-index: 10;
  background-color: #f0fdf9; /* Match bg to hide line behind circle */
  padding: 4px 0;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Card */
.activity-card {
  margin-left: 40px; /* Space from marker */
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.type-tag {
  font-size: 10px;
  font-weight: 700;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-tag.konsultasi {
  background-color: #5ab2a8;
}
.type-tag.edukasi {
  background-color: #64b5f6;
}
.type-tag.tracker {
  background-color: #ffb74d;
}

.date-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.activity-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 16px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
}

.link-action {
  cursor: pointer;
  transition: color 0.2s;
}

.link-action.primary {
  color: #5ab2a8;
}
.link-action.secondary {
  color: #64b5f6;
}

.link-action:hover {
  text-decoration: underline;
}

.dot-separator {
  color: #cbd5e1;
}

/* Load More */
.load-more-wrapper {
  text-align: center;
  margin-top: 32px;
  position: relative;
  z-index: 20;
}

.load-more-btn {
  background: white;
  color: #5ab2a8;
  border: 1px solid white; /* Blend in initially */
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
}

.load-more-btn:hover:not(:disabled) {
  text-decoration: underline;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  text-decoration: none;
}

.no-more-text {
  color: #64748b;
  font-size: 14px;
  margin-top: 12px;
  animation: fadeIn 0.3s ease-out;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.empty-icon-bg {
  width: 100px;
  height: 100px;
  background-color: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  opacity: 0.5;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 32px;
}

.start-btn {
  display: inline-block;
  background-color: #5AB2A8;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.start-btn:hover {
  background-color: #4a968c;
}

/* Stats Footer */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.stat-count {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .timeline-container {
    padding-left: 20px;
  }

  .timeline-line,
  .timeline-marker {
    left: 20px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #64748b;
}

.modal-body {
  margin-bottom: 24px;
}

.detail-row {
  margin-bottom: 16px;
}

.detail-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
  color: #334155;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  color: #475569;
}

.btn-primary {
  padding: 10px 20px;
  border-radius: 8px;
  background: #5ab2a8;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4a968c;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
