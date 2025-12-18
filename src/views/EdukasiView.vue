<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import { Search, BookOpen, Video, X } from 'lucide-vue-next';

// State
const searchQuery = ref('');
const activeFilter = ref('Semua');
const router = useRouter();

// Constants
const filters = [
  'Semua', 'Anxiety', 'Depression', 'Stress', 'Self-Care', 'Mindfulness', 'Relationships'
];

const contents = [
  {
    id: 1,
    type: 'Artikel',
    typeIcon: BookOpen,
    category: 'Stress',
    duration: '5 menit',
    title: 'Mengelola Stres di Tempat Kerja',
    description: 'Stres kerja adalah hal yang umum dialami. Pelajari strategi efektif untuk mengelola stres',
    author: 'Dr. Sarah Wijaya',
    date: '10 Des 2024',
    bgClass: 'bg-blue',
    contentUrl: 'https://www.halodoc.com/artikel/cara-mengatasi-stres-kerja-yang-efektif',
    fullContent: `
      <h2>Mengelola Stres di Tempat Kerja</h2>
      <p>Stres di tempat kerja adalah masalah umum yang dapat memengaruhi kesehatan mental dan fisik, serta produktivitas. Berikut adalah beberapa strategi untuk mengelolanya:</p>
      <ul>
        <li><strong>Kenali Pemicu Stres:</strong> Identifikasi situasi atau orang yang memicu stres Anda.</li>
        <li><strong>Atur Waktu dengan Baik:</strong> Buat prioritas tugas dan hindari penundaan.</li>
        <li><strong>Ambil Istirahat Sejenak:</strong> Luangkan waktu untuk istirahat singkat di sela-sela pekerjaan.</li>
        <li><strong>Komunikasi yang Terbuka:</strong> Bicarakan beban kerja Anda dengan atasan jika dirasa berlebihan.</li>
      </ul>
      <p>Ingatlah bahwa kesehatan mental Anda adalah prioritas utama.</p>
    `
  },
  {
    id: 2,
    type: 'Video',
    typeIcon: Video,
    category: 'Self-Care',
    duration: '12 menit',
    title: 'Pentingnya Self-Care untuk Kesehatan Mental',
    description: 'Self-care bukan tentang mementingkan diri sendiri, tetapi tentang merawat diri agar dapat',
    author: 'Psikolog Amanda Chen',
    date: '8 Des 2024',
    bgClass: 'bg-teal',
    contentUrl: 'https://www.youtube.com/watch?v=w0iVVd0S30I' // Example YouTube link
  },
  {
    id: 3,
    type: 'Artikel',
    typeIcon: BookOpen,
    category: 'Mindfulness',
    duration: '7 menit',
    title: 'Teknik Mindfulness untuk Pemula',
    description: 'Mindfulness adalah praktik sederhana yang dapat membantu mengurangi kecemasan dan',
    author: 'Dr. Budi Santoso',
    date: '5 Des 2024',
    bgClass: 'bg-blue',
    fullContent: `
       <h2>Teknik Mindfulness untuk Pemula</h2>
       <p>Mindfulness adalah kemampuan dasar manusia untuk hadir sepenuhnya, sadar akan di mana kita berada dan apa yang kita lakukan, serta tidak terlalu reaktif atau kewalahan oleh apa yang terjadi di sekitar kita.</p>
       <p>Cobalah latihan pernapasan sederhana: Tarik napas dalam-dalam, tahan sejenak, dan hembuskan perlahan. Fokuskan perhatian Anda hanya pada napas Anda.</p>
    `
  },
  {
    id: 4,
    type: 'Artikel',
    typeIcon: BookOpen,
    category: 'Anxiety',
    duration: '8 menit',
    title: 'Memahami dan Mengatasi Anxiety',
    description: 'Anxiety adalah respons alami tubuh terhadap stres. Pelajari cara mengenali gejala dan teknik',
    author: 'Dr. Sarah Wijaya',
    date: '3 Des 2024',
    bgClass: 'bg-teal',
    fullContent: `
      <h2>Memahami Anxiety</h2>
      <p>Kecemasan adalah perasaan khawatir, gugup, atau gelisah. Ini adalah reaksi normal terhadap stres.</p>
      <p>Tips mengatasi:</p>
      <ol>
        <li>Olahraga teratur</li>
        <li>Dapatkan tidur yang cukup</li>
        <li>Kurangi kafein</li>
      </ol>
    `
  },
  {
    id: 5,
    type: 'Video',
    typeIcon: Video,
    category: 'Relationships',
    duration: '15 menit',
    title: 'Membangun Komunikasi Sehat dalam Hubungan',
    description: 'Komunikasi yang baik adalah kunci hubungan yang sehat. Temukan tips praktis untuk',
    author: 'Psikolog Amanda Chen',
    date: '1 Des 2024',
    bgClass: 'bg-blue',
    contentUrl: 'https://www.youtube.com/watch?v=X5uR071a_yI' // Example
  },
  {
    id: 6,
    type: 'Artikel',
    typeIcon: BookOpen,
    category: 'Depression',
    duration: '6 menit',
    title: 'Mengenali Tanda-tanda Depresi',
    description: 'Depresi lebih dari sekadar rasa sedih. Kenali gejala-gejala depresi dan kapan waktu yang',
    author: 'Dr. Budi Santoso',
    date: '28 Nov 2024',
    bgClass: 'bg-teal',
     fullContent: `
      <h2>Tanda-tanda Depresi</h2>
      <p>Jika Anda merasa sedih terus-menerus selama lebih dari dua minggu, Anda mungkin mengalami depresi.</p>
      <p>Gejala umum meliputi kehilangan minat pada aktivitas yang disukai, perubahan nafsu makan, dan gangguan tidur.</p>
    `
  }
];

// Computed
const filteredContents = computed(() => {
  return contents.filter(item => {
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
  // Always open Detail Page, including for videos
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
          <div class="card-header" :class="item.type.toLowerCase() === 'video' ? 'video-bg' : 'article-bg'">
            <div class="type-badge">
              <component :is="item.typeIcon" :size="16" />
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

/* Search Bar */
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

/* Filters */
.filters-scroll {
  overflow-x: auto;
  margin-bottom: 40px;
  padding-bottom: 5px; /* space for scrollbar if any */
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

/* Content Grid */
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
  height: 180px;
  position: relative;
  background-size: cover;
  background-position: center;
}

.article-bg {
  background: linear-gradient(135deg, #81C7D4 0%, #A2D2CD 100%); /* Blueish gradient */
}

.video-bg {
  background: linear-gradient(135deg, #A8D5BA 0%, #81C7D4 100%); /* Greenish gradient */
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

/* Animations */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   items can be calculated correctly. */
.list-leave-active {
  position: absolute; 
  /* Need to ensure width matches grid column width, but absolute positioning in grid is tricky. 
     For simple grid leave animations, sometimes using a different approach is better, 
     but let's try just opacity/transform for now or basic FLIP without absolute if layout breaks.
     Actually, for grid, absolute position often breaks layout. 
     Let's standard non-absolute leave for now to be safe, or just hide immediately.
  */
}

/* Clear Button */
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

/* Empty State */
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
