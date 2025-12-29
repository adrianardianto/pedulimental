<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import Navbar from "../components/Navbar.vue";
import { BookOpen, User, Calendar, ArrowLeft, PlayCircle } from "lucide-vue-next";

import { useEducationStore } from '../stores/education';

const route = useRoute();
const currentUser = ref(null);
const educationStore = useEducationStore();

const getCurrentUser = () => {
   const sessionUser = sessionStorage.getItem("user");
   const localUser = localStorage.getItem("user");
   if (sessionUser) return JSON.parse(sessionUser);
   if (localUser) return JSON.parse(localUser);
   return null;
};

// Parse ID dari "artikel1" -> 1
const paramId = route.params.id;
const articleId = paramId ? paramId.replace('artikel', '') : null;

const article = educationStore.getContentById(articleId) || {
  title: "Konten Tidak Ditemukan",
  fullContent: "<p>Maaf, konten yang Anda cari tidak ditemukan.</p>",
  category: "Error",
  author: "-",
  date: "-",
  duration: "-"
};

onMounted(() => {
  currentUser.value = getCurrentUser();

  if (article && article.id) {
     educationStore.addToHistory(article);
  }
});

</script>

<template>
  <div class="detail-page">
    <Navbar />

    <div class="container main-content">
      <router-link to="/edukasi" class="back-link">
        <ArrowLeft :size="20" />
        Kembali ke Daftar Edukasi
      </router-link>

      <div class="article-container">
        <div class="article-header">
          <div class="badge-row">
            <span class="type-badge" :class="article.type === 'Video' ? 'video-badge' : 'article-badge'">
              {{ article.type }}
            </span>
            <span class="category-text">{{ article ? article.category : '' }}</span>
          </div>
          
          <h1 class="article-title">{{ article.title }}</h1>
          
          <div class="article-meta">
            <div class="meta-item">
              <User :size="16" />
              <span>{{ article.author }}</span>
            </div>
            <div class="meta-item">
              <Calendar :size="16" />
              <span>{{ article.date }}</span>
            </div>
            <div class="meta-item">
               <span class="dot-separator">•</span>
               <span>{{ article.duration }}</span>
            </div>
          </div>
        </div>

        <!-- Video Player -->
        <div v-if="article.type === 'Video'" class="video-container">
           <iframe 
             :src="article.videoUrl" 
             title="Video player" 
             frameborder="0" 
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
             allowfullscreen
           ></iframe>
        </div>

        <!-- Featured Image (Only for Articles) -->
        <div v-else class="featured-image" :class="article.bgClass || 'bg-default'" :style="article.image ? { backgroundImage: `url(${article.image})` } : {}"></div>

        <div class="article-content" v-html="article.fullContent"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-bottom: 60px;
}

.main-content {
  padding-top: 40px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #5AB2A8; 
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 32px;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

.article-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.article-header {
  margin-bottom: 32px;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.type-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  color: #065f46;
}

.article-badge {
  background-color: #a7f3d0; 
  color: #065f46;
}

.video-badge {
  background-color: #e0f2fe;
  color: #0369a1;
}

.category-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.article-title {
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
  line-height: 1.25;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: #64748b;
  font-size: 14px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-separator {
    color: #cbd5e1;
    font-weight: bold;
}


.featured-image {
  width: 100%;
  max-width: 600px;
  height: 300px;
  border-radius: 16px;
  margin: 0 auto 40px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}


.video-container {
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  margin-bottom: 40px;
  border-radius: 16px;
  overflow: hidden;
  background: black;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-blue {
    background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
}
.bg-teal {
    background: linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%);
}
.bg-purple {
    background: linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%);
}
.bg-orange {
    background: linear-gradient(135deg, #fdba74 0%, #fb923c 100%);
}
.bg-default {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
}


:deep(.intro-text) {
    font-size: 18px;
    color: #475569;
    margin-bottom: 32px;
    line-height: 1.7;
}

:deep(h2) {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 40px;
  margin-bottom: 16px;
}

:deep(p) {
  margin-bottom: 20px;
}

:deep(ul), :deep(ol) {
  margin-bottom: 24px;
  padding-left: 24px;
}

:deep(li) {
  margin-bottom: 12px;
}

:deep(strong) {
    color: #0f172a;
    font-weight: 600;
}

@media (max-width: 600px) {
    .article-title {
        font-size: 28px;
    }
    
    .article-meta {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }
    
    .featured-image {
        height: 200px;
    }
    
    .article-container {
        padding: 24px;
    }
}
</style>
