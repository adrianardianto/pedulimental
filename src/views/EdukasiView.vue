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

<style scoped src="@/assets/css/edukasi.css"></style>
