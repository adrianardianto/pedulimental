<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import Navbar from "../components/Navbar.vue";
import { BookOpen, User, Calendar, ArrowLeft, PlayCircle } from "lucide-vue-next";

const route = useRoute();
const currentUser = ref(null);

const getCurrentUser = () => {
   const sessionUser = sessionStorage.getItem("user");
   const localUser = localStorage.getItem("user");
   if (sessionUser) return JSON.parse(sessionUser);
   if (localUser) return JSON.parse(localUser);
   return null;
};

// Parse ID from "artikel1" -> 1
const paramId = route.params.id;
const articleId = paramId ? paramId.replace('artikel', '') : null;

// Mock Data
const contents = [
  {
    id: 1,
    type: 'Artikel',
    category: 'Stress',
    duration: '5 menit baca',
    title: 'Mengelola Stres di Tempat Kerja',
    description: 'Stres kerja adalah hal yang umum dialami. Pelajari strategi efektif untuk mengelola stres',
    author: 'Dr. Sarah Wijaya',
    date: '10 Des 2024',
    bgClass: 'bg-blue',
    fullContent: `
      <p class="intro-text">Stres kerja adalah hal yang umum dialami. Pelajari strategi efektif untuk mengelola stres dan meningkatkan produktivitas tanpa mengorbankan kesehatan mental Anda.</p>
      
      <h2>Memahami Permasalahan</h2>
      <p>Banyak pekerja mengalami tekanan yang tinggi akibat tenggat waktu yang ketat, beban kerja yang berlebihan, atau lingkungan kerja yang kurang mendukung. Stres yang berkepanjangan dapat berdampak negatif pada kesehatan fisik dan emosional.</p>
      <p>Penting untuk mengenali tanda-tanda awal stres seperti kelelahan kronis, mudah marah, atau sulit berkonsentrasi agar dapat segera ditangani.</p>

      <h2>Strategi yang Dapat Diterapkan</h2>
      <ul>
        <li><strong>Identifikasi sumber stres utama dalam kehidupan Anda:</strong> Catat apa saja yang memicu rasa cemas atau tekanan di tempat kerja.</li>
        <li><strong>Praktikkan teknik pernapasan dalam untuk menenangkan diri:</strong> Lakukan latihan pernapasan sederhana selama 2-3 menit saat merasa tertekan.</li>
        <li><strong>Buat batasan yang jelas antara pekerjaan dan kehidupan pribadi:</strong> Hindari membawa pekerjaan ke rumah jika memungkinkan.</li>
        <li><strong>Luangkan waktu untuk aktivitas yang Anda nikmati:</strong> Hobi dan relaksasi sangat penting untuk pemulihan energi mental.</li>
        <li><strong>Jangan ragu untuk meminta bantuan ketika diperlukan:</strong> Berbicara dengan rekan kerja atau profesional dapat memberikan perspektif baru.</li>
      </ul>

      <h2>Kesimpulan</h2>
      <p>Mengelola kesehatan mental adalah perjalanan yang berkelanjutan. Dengan menerapkan strategi-strategi ini secara konsisten, Anda dapat membangun ketahanan mental yang lebih kuat dan meningkatkan kualitas hidup secara keseluruhan.</p>
    `
  },
  {
    id: 2,
    type: 'Video',
    category: 'Relaksasi',
    duration: '10 menit tonton',
    title: 'Meditasi Panduan untuk Tidur Nyenyak',
    description: 'Video panduan meditasi untuk membantu Anda rileks dan mendapatkan tidur yang berkualitas',
    author: 'Yoga With Adriene',
    date: '8 Des 2024',
    bgClass: 'bg-purple',
    videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM', // Example ID
    fullContent: `
       <p class="intro-text">Sulit tidur adalah masalah yang sering dialami banyak orang. Video ini akan memandu Anda melalui sesi meditasi relaksasi yang dirancang khusus untuk mempersiapkan tubuh dan pikiran Anda untuk tidur.</p>
       
       <h2>Apa yang Akan Anda Pelajari</h2>
       <p>Dalam sesi 10 menit ini, kita akan fokus pada:</p>
       <ul>
         <li>Teknik pernapasan 4-7-8 untuk menenangkan sistem saraf.</li>
         <li>Body scan meditation untuk melepaskan ketegangan fisik.</li>
         <li>Visualisasi positif untuk menenangkan pikiran yang sibuk.</li>
       </ul>
       
       <h2>Tips Tambahan</h2>
       <p>Untuk hasil terbaik, lakukan latihan ini di ruangan yang gelap dan tenang, dan pastikan gadget Anda dalam mode hening.</p>
    `
  },
  {
    id: 3,
    type: 'Artikel',
    category: 'Mindfulness',
    duration: '7 menit baca',
    title: 'Teknik Mindfulness untuk Pemula',
    description: 'Mindfulness adalah praktik sederhana yang dapat membantu mengurangi kecemasan dan',
    author: 'Dr. Budi Santoso',
    date: '5 Des 2024',
    bgClass: 'bg-teal',
    fullContent: `
       <p class="intro-text">Mindfulness adalah kemampuan dasar manusia untuk hadir sepenuhnya, sadar akan di mana kita berada dan apa yang kita lakukan, serta tidak terlalu reaktif atau kewalahan oleh apa yang terjadi di sekitar kita.</p>
       
       <h2>Memulai Praktik Mindfulness</h2>
       <p>Anda tidak perlu peralatan khusus untuk memulai. Cukup luangkan waktu 5-10 menit setiap hari di tempat yang tenang.</p>
       
       <h2>Langkah-langkah Sederhana</h2>
       <ul>
        <li><strong>Cari posisi nyaman:</strong> Duduklah dengan tegak namun rileks.</li>
        <li><strong>Fokus pada napas:</strong> Rasakan aliran udara masuk dan keluar melalui hidung.</li>
        <li><strong>Amati pikiran:</strong> Jika pikiran mengembara, perlahan kembalikan fokus ke napas tanpa menghakimi diri sendiri.</li>
       </ul>

       <h2>Manfaat Jangka Panjang</h2>
       <p>Dengan latihan rutin, mindfulness dapat membantu menurunkan tingkat stres, meningkatkan fokus, dan memperbaiki kualitas tidur Anda.</p>
    `
  },
  {
    id: 4,
    type: 'Artikel',
    category: 'Anxiety',
    duration: '8 menit baca',
    title: 'Memahami dan Mengatasi Anxiety',
    description: 'Anxiety adalah respons alami tubuh terhadap stres. Pelajari cara mengenali gejala dan teknik',
    author: 'Dr. Sarah Wijaya',
    date: '3 Des 2024',
    bgClass: 'bg-teal',
    fullContent: `
      <p class="intro-text">Kecemasan adalah perasaan khawatir, gugup, atau gelisah. Ini adalah reaksi normal terhadap stres, namun bisa menjadi gangguan jika berlebihan.</p>
      
      <h2>Gejala Umum</h2>
      <p>Gejala fisik bisa berupa jantung berdebar, berkeringat, atau gemetar. Secara emosional, Anda mungkin merasa tegang atau takut akan hal buruk yang akan terjadi.</p>
      
      <h2>Tips Mengatasi Kecemasan</h2>
      <ol>
        <li><strong>Olahraga teratur:</strong> Aktivitas fisik dapat melepaskan endorfin yang meningkatkan suasana hati.</li>
        <li><strong>Dapatkan tidur yang cukup:</strong> Kurang tidur dapat memperburuk kecemasan.</li>
        <li><strong>Kurangi kafein:</strong> Kafein dapat memicu gejala fisik yang menyerupai kecemasan.</li>
      </ol>
    `
  },
  {
    id: 5,
    type: 'Video',
    category: 'Motivasi',
    duration: '15 menit tonton',
    title: 'Membangun Kebiasaan Positif',
    description: 'Pelajari cara membangun kebiasaan kecil yang berdampak besar bagi kesehatan mental',
    author: 'James Clear',
    date: '1 Des 2024',
    bgClass: 'bg-orange',
    videoUrl: 'https://www.youtube.com/embed/2FGR-OspxsU', // Example ID
    fullContent: `
      <p class="intro-text">Kebiasaan kita menentukan kualitas hidup kita. Dalam video inspiratif ini, kita akan membahas ilmu di balik pembentukan kebiasaan dan bagaimana membuat perubahan kecil yang bertahan lama.</p>
      
      <h2>Poin Penting</h2>
      <ul>
        <li>Mengapa motivasi saja tidak cukup.</li>
        <li>Pentingnya lingkungan dalam membentuk perilaku.</li>
        <li>Aturan 2 menit untuk memulai kebiasaan baru.</li>
      </ul>
    `
  },
  {
    id: 6,
    type: 'Artikel',
    category: 'Depression',
    duration: '6 menit baca',
    title: 'Mengenali Tanda-tanda Depresi',
    description: 'Depresi lebih dari sekadar rasa sedih. Kenali gejala-gejala depresi dan kapan waktu yang',
    author: 'Dr. Budi Santoso',
    date: '28 Nov 2024',
    bgClass: 'bg-teal',
     fullContent: `
      <p class="intro-text">Depresi adalah gangguan suasana hati yang serius yang memengaruhi cara Anda merasa, berpikir, dan menangani aktivitas sehari-hari.</p>
      
      <h2>Tanda Utama</h2>
      <p>Jika Anda merasa sedih terus-menerus selama lebih dari dua minggu, kehilangan minat pada hobi yang biasa dinikmati, dan merasa lelah sepanjang waktu, Anda mungkin mengalami depresi.</p>
      
      <h2>Kapan Harus Mencari Bantuan?</h2>
      <p>Segera hubungi profesional jika gejala-gejala ini mulai mengganggu pekerjaan, sekolah, atau hubungan pribadi Anda. Ingat, depresi dapat diobati.</p>
    `
  }
];

const article = contents.find(c => c.id == articleId) || {
  title: "Konten Tidak Ditemukan",
  fullContent: "<p>Maaf, konten yang Anda cari tidak ditemukan.</p>",
  category: "Error",
  author: "-",
  date: "-",
  duration: "-"
};

onMounted(() => {
  currentUser.value = getCurrentUser();

  if (article.id) {
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: "Edukasi",
      title: article.title,
      // Create a short description from full content (strip HTML) or use existing description
      desc: article.description || "Membaca artikel edukasi kesehatan mental.",
      articleId: article.id,
      link: "Baca Lagi",
      action: "Bagikan",
      userEmail: currentUser.value?.email
    };

    const saved = localStorage.getItem("pedulimental_article_history");
    const history = saved ? JSON.parse(saved) : [];

    // Optional: Check if the last entry is the same to avoid duplicates on refresh
    const lastEntry = history[history.length - 1];
    if (!lastEntry || lastEntry.articleId !== article.id) {
       history.push(historyItem);
       localStorage.setItem("pedulimental_article_history", JSON.stringify(history));
    }
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
        <div v-else class="featured-image" :class="article.bgClass || 'bg-default'"></div>

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

/* Featured Image */
.featured-image {
  width: 100%;
  height: 300px;
  border-radius: 16px;
  margin-bottom: 40px;
  background-size: cover;
  background-position: center;
}

/* Video Container */
.video-container {
  width: 100%;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
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

/* Deep sytles for v-html content */
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
