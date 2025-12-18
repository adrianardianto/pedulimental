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
    label: "Survey Diikuti",
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
const activities = ref([]);
const router = useRouter();

onMounted(() => {
  const saved = localStorage.getItem("pedulimental_appointments");
  if (saved) {
    const parsed = JSON.parse(saved);
    const completed = parsed.filter(a => a.status === 'completed');
    
    // Add to activities
    completed.forEach(c => {
      activities.value.unshift({
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
      });
      
      // Update stats if needed
      stats.value[0].count++;
    });
  }
});

const loadMore = () => {
  alert("Load More clicked (Prototype Only)");
};

const handleAction = (item) => {
  if (item.action === "Booking Ulang" && item.consultantId) {
    router.push({ path: '/konsultasi', query: { consultantId: item.consultantId } });
  }
};
</script>

<template>
  <div class="riwayat-page">
    <Navbar />

    <div class="container main-content">
      <h1 class="page-title">Riwayat Aktivitas</h1>

      <div v-if="activities.length > 0" class="timeline-container">
        <!-- Main Timeline Line -->
        <div class="timeline-line"></div>

        <!-- Activity Items -->
        <div v-for="item in activities" :key="item.id" class="timeline-item">
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
              <span class="link-action primary">{{ item.link }}</span>
              <span class="dot-separator">•</span>
              <span class="link-action secondary" @click="handleAction(item)">{{ item.action }}</span>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div class="load-more-wrapper">
          <button class="load-more-btn" @click="loadMore">
            Muat Lebih Banyak Riwayat
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

      <!-- Stats Footer -->
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
    </div>
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
.type-tag.survey {
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

.load-more-btn:hover {
  text-decoration: underline;
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
  margin-top: 60px;
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
</style>
