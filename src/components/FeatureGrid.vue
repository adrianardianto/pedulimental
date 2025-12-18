<script setup>
import {
  Stethoscope,
  BookOpen,
  TrendingUp,
  Users,
} from "lucide-vue-next";

const features = [
  {
    id: 1,
    title: "Konsultasi",
    icon: Stethoscope,
    color: "#5AB2A8",
    bgColor: "#E0F2F1",
    route: "/konsultasi",
  },
  {
    id: 2,
    title: "Konten Edukasi",
    icon: BookOpen,
    color: "#64B5F6",
    bgColor: "#E3F2FD",
    route: "/edukasi",
  },
  {
    id: 3,
    title: "Tracker",
    icon: TrendingUp,
    color: "#FFB74D",
    bgColor: "#FFF3E0",
    route: "/tracker", // Assuming Tracker maps to Survey route for now or new route
  },
  {
    id: 4,
    title: "Komunitas",
    icon: Users,
    color: "#81C784",
    bgColor: "#E8F5E9",
    route: "/komunitas",
  },
];
</script>

<template>
  <div class="feature-grid container">
    <router-link
      v-for="feature in features"
      :key="feature.id"
      :to="feature.route"
      class="feature-card"
    >
      <div
        class="icon-wrapper"
        :style="{ backgroundColor: feature.bgColor, color: feature.color }"
      >
        <component :is="feature.icon" :size="32" stroke-width="2" />
      </div>
      <h3 class="feature-title">{{ feature.title }}</h3>
    </router-link>
  </div>
</template>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: -50px; /* Overlap with hero */
  position: relative;
  z-index: 10;
  margin-bottom: 40px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  text-decoration: none; /* Remove underline from router-link */
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.feature-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px; /* Smaller gap on mobile */
    margin-top: -40px; /* Slightly less overlap */
  }
  
  .feature-card {
    padding: 16px;
    min-height: 130px;
  }
}

@media (max-width: 400px) {
  .feature-grid {
    grid-template-columns: 1fr; /* Single column for very small screens */
  }

  .feature-card {
    flex-direction: row;
    align-items: center;
    min-height: auto;
    gap: 16px;
  }

  .icon-wrapper {
    margin-bottom: 0;
    width: 40px;
    height: 40px;
  }

  .feature-title {
    font-size: 15px;
  }
}
</style>
