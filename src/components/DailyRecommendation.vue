<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

import { useEducationStore } from '../stores/education';

const educationStore = useEducationStore();
const router = useRouter();
const currentIndex = ref(0);

// Ambil 4 item pertama dari store untuk rekomendasi
const recommendations = computed(() => {
  return educationStore.contents.slice(0, 4).map(item => ({
    id: item.id,
    tag: item.type,
    title: item.title,
    desc: item.description,
    image: item.image,
    // Fallback gradien jika tidak ada gambar
    gradient: 'linear-gradient(135deg, #a2d2cd 0%, #8ec5eb 100%)', 
    contentId: `artikel${item.id}`
  }));
});

const currentItem = computed(() => recommendations.value[currentIndex.value]);
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % recommendations.value.length;
};
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + recommendations.value.length) % recommendations.value.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

const readMore = () => {
  if (currentItem.value && currentItem.value.contentId) {
    router.push({ name: 'detail-artikel', params: { id: currentItem.value.contentId } });
  }
};
</script>

<template>
  <div class="recommendation-section container">
    <h2 class="section-title">Rekomendasi Hari Ini</h2>
    
    <div class="slider-container">
      <button class="nav-button prev" @click="prevSlide">
        <ChevronLeft :size="24" />
      </button>

      <Transition name="fade" mode="out-in">
        <div :key="currentIndex" class="recommendation-card">
<div class="card-image" :style="currentItem.image ? { backgroundImage: `url(${currentItem.image})` } : { background: currentItem.gradient }"></div>
          <div class="card-content">
            <span class="tag">{{ currentItem.tag }}</span>
            <h3 class="card-title">{{ currentItem.title }}</h3>
            <p class="card-desc">{{ currentItem.desc }}</p>
            <button class="read-more-btn" @click="readMore">Baca Selengkapnya</button>
          </div>
        </div>
      </Transition>

      <button class="nav-button next" @click="nextSlide">
        <ChevronRight :size="24" />
      </button>
    </div>

    <div class="pagination-dots">
      <span 
        v-for="(item, index) in recommendations" 
        :key="item.id"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.recommendation-section {
  padding-bottom: 60px;
  padding-top: 20px; /* Add breathing room */
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1e293b;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 20px;
    margin-bottom: 16px;
  }
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0; /* Slight border */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
}

.nav-button:hover {
  background: #f8fafc;
  color: #5AB2A8;
}

.recommendation-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  min-height: 400px;
}

.card-image {
  width: 50%;
  background: linear-gradient(135deg, #a2d2cd 0%, #8ec5eb 100%); /* Placeholder gradient from image */
  background-size: cover;
}

.card-content {
  width: 50%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.tag {
  background-color: #FCD34D; /* Yellow/Orange */
  color: #78350F;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  display: inline-block;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1e293b;
}

.card-desc {
  color: #64748b;
  margin-bottom: 24px;
  font-size: 14px;
}

.read-more-btn {
  background-color: #5AB2A8;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: background-color 0.2s;
}

.read-more-btn:hover {
  background-color: #4a968c;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #cbd5e1;
  cursor: pointer;
}

.dot.active {
  background-color: #5AB2A8;
  width: 24px; /* Extended active dot */
  border-radius: 4px;
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
  .recommendation-card {
    flex-direction: column;
    width: 100%; /* Ensure full width */
  }
  
  .card-image {
    width: 100%;
    height: 180px; /* Slightly reduced height */
  }
  
  .card-content {
    width: 100%;
    padding: 24px;
  }
  
  /* Buttons overlay on mobile */
  .slider-container {
    position: relative;
    /* Remove gap that might cause overflow if buttons were static */
    gap: 0; 
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .nav-button.prev {
    left: -10px; /* Slightly overflow or flush */
  }

  .nav-button.next {
    right: -10px;
  }
  
  /* Adjust title size for small screens */
  .card-title {
    font-size: 20px;
  }
}

/* Extra small devices */
@media (max-width: 380px) {
  .nav-button {
    width: 32px;
    height: 32px;
  }
  
  .card-content {
    padding: 20px;
  }
}
/* Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
