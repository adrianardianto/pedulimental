<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import { Search, BookOpen, Video, X } from 'lucide-vue-next';
import { useEducationStore } from '../stores/education';

// State
const searchQuery = ref('');
const activeFilter = ref('Semua');
const router = useRouter();
const educationStore = useEducationStore();

// Constants
const filters = [
  'Semua', 'Anxiety', 'Depression', 'Stress', 'Self-Care', 'Mindfulness', 'Relationships'
];

const getTypeIcon = (type) => {
  return type === 'Video' ? Video : BookOpen;
};

// Computed
const filteredContents = computed(() => {
  return educationStore.contents.filter(item => {
    const searchMatch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const filterMatch = activeFilter.value === 'Semua' || item.category === activeFilter.value;
    
    return searchMatch && filterMatch;
  });
});

const clearSearch = () => {
  searchQuery.value = '';
};

const openContent = (item) => {
  // Simpan ke history dan buka halaman detail
  educationStore.addToHistory(item);
  router.push({ name: 'detail-artikel', params: { id: `artikel${item.id}` } });
};
</script>

<template>
  <div class="edukasi-page">
    <Navbar />
    
    <div class="container main-content">
      <div class="header-section">
        <h1 class="page-title">Konten Edukasi</h1>
        <p class="page-subtitle">Temukan artikel dan video terpercaya untuk mendukung kesehatan mentalmu.</p>
      </div>
      
      <!-- Search Bar -->
      <div class="search-wrapper">
        <Search class="search-icon" :size="20" />
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari artikel atau video..." 
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
          <X :size="16" />
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-scroll">
        <div class="filters-container">
          <button 
            v-for="filter in filters" 
            :key="filter"
            class="filter-btn"
            :class="{ active: activeFilter === filter }"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <TransitionGroup name="list" tag="div" class="content-grid">
        <div v-for="item in filteredContents" :key="item.id" class="content-card" @click="openContent(item)">
          <div class="card-header" :class="item.type.toLowerCase() === 'video' ? 'video-bg' : 'article-bg'" :style="item.image ? { backgroundImage: `url(${item.image})` } : {}">
            <div class="type-badge">
              <component :is="getTypeIcon(item.type)" :size="16" />
              <span>{{ item.type }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="meta-top">
              <span class="category-text" :class="item.category.toLowerCase()">{{ item.category }}</span>
              <span class="duration-text">{{ item.duration }}</span>
            </div>
            
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}...</p>
            
            <div class="card-footer">
              <span class="author-name">{{ item.author }}</span>
              <span class="date-text">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="filteredContents.length === 0" class="empty-state">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-magnifying-glass-symbol-sign-pack-design-development-illustrations-6632131.png?f=webp" alt="Not found" class="empty-img" />
        <h3>Tidak ada hasil ditemukan</h3>
        <p>Coba gunakan kata kunci lain atau ganti kategori.</p>
        <button @click="clearSearch" class="reset-btn">Reset Pencarian</button>
      </div>
    </div>
    </div>



</template>

<style scoped>
.edukasi-page {
  min-height: 100vh;
  background-color: #F8FAFC;
  padding-bottom: 60px;
}

.main-content {
  padding-top: 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}


.search-wrapper {
  position: relative;
  margin-bottom: 30px;
  max-width: 100%;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-family: inherit;
  font-size: 16px;
  color: #1e293b;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.search-input:focus {
  border-color: #5AB2A8;
  box-shadow: 0 0 0 3px rgba(90, 178, 168, 0.1);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}


.filters-scroll {
  overflow-x: auto;
  margin-bottom: 40px;
  padding-bottom: 5px;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.filters-container {
  display: flex;
  gap: 12px;
  min-width: max-content;
}

.filter-btn {
  padding: 8px 24px;
  border-radius: 30px;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #cbd5e1;
}

.filter-btn.active {
  background-color: #5AB2A8;
  color: white;
  border-color: #5AB2A8;
}


.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.content-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  cursor: pointer;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  height: 300px;
  position: relative;
  background-size: cover;
  background-position: center;
}

.article-bg {
  background: linear-gradient(135deg, #81C7D4 0%, #A2D2CD 100%);
}

.video-bg {
  background: linear-gradient(135deg, #A8D5BA 0%, #81C7D4 100%);
}

.type-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.icon-circle {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5AB2A8;
}

.card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
}

.category-text {
  font-weight: 600;
}
.category-text.stress { color: #5AB2A8; }
.category-text.self-care { color: #5AB2A8; }
.category-text.mindfulness { color: #5AB2A8; }
.category-text.anxiety { color: #5AB2A8; }
.category-text.relationships { color: #5AB2A8; }
.category-text.depression { color: #5AB2A8; }

.duration-text {
  color: #94a3b8;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: auto;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}


.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}


.list-leave-active {
  position: absolute; 

}


.clear-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #f1f5f9;
  color: #64748b;
}


.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-img {
  width: 200px;
  margin-bottom: 24px;
  opacity: 0.8;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.reset-btn {
  margin-top: 24px;
  padding: 10px 24px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #5AB2A8;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background-color: #f0fdfa;
  border-color: #5AB2A8;
}

.page-subtitle {
  color: #64748b;
  margin-top: -16px; 
  margin-bottom: 32px;
}


</style>
