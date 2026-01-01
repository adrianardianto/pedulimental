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

<style scoped src="@/assets/css/detail-artikel.css"></style>
