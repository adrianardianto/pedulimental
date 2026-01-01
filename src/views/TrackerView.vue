<script setup>
import { ref, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import { Heart, Clock, Check, ClipboardList } from "lucide-vue-next";
import { useTrackerStore } from "../stores/tracker";

const trackerStore = useTrackerStore();

const currentQuestion = ref(0);
const selectedOption = ref(null);
const progress = ref(10);
const isFinished = ref(false);
const isStarted = ref(false);
const answers = ref([]);
const resultLevel = ref("");
const showEmergencyModal = ref(false);

const questions = [
  {
    id: 1,
    text: "Seberapa sering Anda merasa cemas atau khawatir dalam 2 minggu terakhir?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
  },
  {
    id: 2,
    text: "Seberapa sering Anda merasa tidak berminat untuk melakukan kegiatan sehari-hari?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
  },
  {
    id: 3,
    text: "Seberapa sering Anda merasa mudah marah atau tersinggung?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
  },
  {
    id: 4,
    text: "Seberapa sering Anda merasa sedih atau tertekan?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
  },
  {
    id: 5,
    text: "Seberapa sering Anda merasa sulit tidur atau tidur terlalu banyak?",
    options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
  },
];

const recommendations = computed(() => {
  if (resultLevel.value === "Normal") {
    return [
      "Pertahankan pola hidup sehat dan rutin berolahraga",
      "Luangkan waktu untuk hobi yang Anda nikmati",
      "Tetap terhubung dengan keluarga dan teman",
      "Baca artikel edukasi untuk wawasan kesehatan mental"
    ];
  } else if (resultLevel.value === "Ringan") {
    return [
      "Coba teknik relaksasi sederhana seperti pernapasan dalam",
      "Pastikan Anda mendapatkan istirahat yang cukup",
      "Kurangi konsumsi kafein dan jaga pola makan",
      "Baca artikel tentang manajemen stres di bagian Edukasi"
    ];
  } else if (resultLevel.value === "Sedang") {
    return [
      "Coba teknik mindfulness dan meditasi untuk mengurangi stres",
      "Pertimbangkan untuk bercerita kepada orang yang dipercaya",
      "Atur jadwal harian agar tidak terlalu padat",
      "Bergabung dengan komunitas support group untuk berbagi pengalaman"
    ];
  } else {
    // Berat
    return [
      "Pertimbangkan untuk berkonsultasi dengan psikolog profesional",
      "Jangan ragu untuk meminta bantuan dari orang terdekat",
      "Hindari isolasi diri dan tetap berinteraksi sosial",
      "Prioritaskan kesehatan dan keselamatan diri Anda"
    ];
  }
});

const selectOption = (index) => {
  selectedOption.value = index;
};

const nextQuestion = () => {
  if (selectedOption.value !== null) {
    // Simpan jawaban
    answers.value[currentQuestion.value] = selectedOption.value;

    if (currentQuestion.value < questions.length - 1) {
      currentQuestion.value++;
      selectedOption.value = null;
      progress.value = Math.min(((currentQuestion.value + 1) / questions.length) * 100, 100);
    } else {
      finishSurvey();
    }
  }
};

const prevQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--;
    // Kembalikan jawaban sebelumnya
    selectedOption.value = answers.value[currentQuestion.value];
    progress.value = Math.max(((currentQuestion.value + 1) / questions.length) * 100, 0);
  }
};

const finishSurvey = () => {
  calculateResult();
  isFinished.value = true;
  progress.value = 100;

  // Simpan ke riwayat via STORE
  const historyItem = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    type: "Tracker",
    title: "Tracker Kesehatan Mental",
    resultLevel: resultLevel.value,
    desc: `Hasil pengecekan: Tingkat Stress ${resultLevel.value}`,
    action: "Isi Ulang"
  };

  trackerStore.addRecord(historyItem);
};

const calculateResult = () => {
  const totalScore = answers.value.reduce((a, b) => a + b, 0);
  
  if (totalScore <= 4) {
    resultLevel.value = "Normal";
  } else if (totalScore <= 9) {
    resultLevel.value = "Ringan";
  } else if (totalScore <= 14) {
    resultLevel.value = "Sedang";
  } else {
    resultLevel.value = "Berat";
  }
};

const restartSurvey = () => {
  currentQuestion.value = 0;
  selectedOption.value = null;
  progress.value = 10;
  isFinished.value = false;
  isStarted.value = false;
  answers.value = [];
  resultLevel.value = "";
};

const startTracker = () => {
  isStarted.value = true;
};
</script>

<template>
  <div class="survey-page">
    <Navbar />

    <div class="container main-content">
      <div class="survey-grid">
        <!-- Welcome Panel -->
        <div v-if="!isStarted" class="question-panel welcome-panel">
          <div class="welcome-icon">
            <Heart :size="64" stroke-width="1.5" />
          </div>
          <h2 class="welcome-title">Selamat Datang di Tracker Kesehatan Mental</h2>
          <p class="welcome-desc">
            Luangkan waktu sejenak untuk mengenali perasaan Anda. Tracker ini akan membantu Anda memahami kondisi emosional Anda saat ini dan memberikan rekomendasi yang relevan.
          </p>
          <ul class="welcome-points">
             <li><Check :size="16" /> 5 Pertanyaan singkat</li>
             <li><Check :size="16" /> Privasi terjaga</li>
             <li><Check :size="16" /> Rekomendasi personal</li>
          </ul>
          <button class="btn-start" @click="startTracker">Mulai Tracker</button>
        </div>

        <!-- Left Panel: Question -->
        <div v-else-if="!isFinished" class="question-panel">
          <div class="progress-header">
            <span class="progress-label"
              >Pertanyaan {{ currentQuestion + 1 }} dari
              {{ questions.length }}</span
            >
            <span class="progress-percent">{{ Math.round(progress) }}%</span>
          </div>
          <div class="progress-bar-bg">
            <div
              class="progress-bar-fill"
              :style="{ width: progress + '%' }"
            ></div>
          </div>

          <h2 class="question-text">{{ questions[currentQuestion].text }}</h2>

          <div class="options-list">
            <div
              v-for="(opt, index) in questions[currentQuestion].options"
              :key="index"
              class="option-card"
              :class="{ selected: selectedOption === index }"
              @click="selectOption(index)"
            >
              <div class="radio-circle">
                <div v-if="selectedOption === index" class="radio-inner"></div>
              </div>
              <span class="option-text">{{ opt }}</span>
            </div>
          </div>

          <div class="actions">
            <button
              class="btn-prev"
              @click="prevQuestion"
              :disabled="currentQuestion === 0"
            >
              Sebelumnya
            </button>
            <button
              class="btn-next"
              @click="nextQuestion"
              :disabled="selectedOption === null"
            >
              {{ currentQuestion === questions.length - 1 ? 'Selesai' : 'Lanjut' }}
            </button>
          </div>
        </div>

        <!-- Result Panel -->
        <div v-else class="question-panel result-panel">
          <div class="result-header">
            <div class="result-icon-wrapper">
               <Heart :size="48" class="result-icon" />
            </div>
            <h2>Hasil Tracker Anda</h2>
          </div>
          
          <div class="result-content">
            <div class="score-badge" :class="resultLevel.toLowerCase()">
              Tingkat Stress: {{ resultLevel }}
            </div>
            
            <p class="result-description" v-if="resultLevel === 'Normal'">Kondisi mental Anda tampak stabil. Teruslah menjaga keseimbangan hidup dan rutinitas positif Anda.</p>
            <p class="result-description" v-if="resultLevel === 'Ringan'">Anda mungkin mengalami sedikit stress. Cobalah luangkan waktu untuk relaksasi dan hobi yang Anda sukai.</p>
            <p class="result-description" v-if="resultLevel === 'Sedang'">Tingkat stress Anda cukup mengganggu. Disarankan untuk mulai menerapkan mindfulness atau berbicara dengan teman dekat.</p>
            <p class="result-description" v-if="resultLevel === 'Berat'">Anda mengalami gejala stress yang signifikan. Kami sangat menyarankan untuk berkonsultasi dengan profesional.</p>

            <div class="action-buttons">
              <button class="restart-btn" @click="restartSurvey">Mulai Ulang Tracker</button>
              <router-link to="/konsultasi" class="consult-link">
                Hubungi Psikolog
              </router-link>
            </div>

            <div class="recommendation-card">
              <h3 class="rec-title">Rekomendasi untuk Anda</h3>
              <ul class="rec-list">
                <li v-for="(rec, index) in recommendations" :key="index" class="rec-item">
                  <div class="check-icon">
                    <Check :size="16" stroke-width="3" />
                  </div>
                  <span>{{ rec }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Panel: Info Sidebar -->
        <div class="info-sidebar">
          
          <div class="sidebar-header">
            <div class="icon-bubble green-bubble-soft">
              <ClipboardList :size="24" stroke-width="2" />
            </div>
            <div>
              <h3 class="sidebar-title">Tujuan Tracker</h3>
            </div>
          </div>
          
          <p class="sidebar-description">
            Tracker ini dirancang untuk membantu kami memahami kondisi
            kesehatan mental Anda dan memberikan rekomendasi yang sesuai.
          </p>
          
          <div class="time-estimate-box">
            <Clock :size="18" />
            <span>Estimasi waktu: 5-7 menit</span>
          </div>

          <!-- Positive Message Box -->
          <div class="message-box gradient-box">
            <h4 class="box-title white-text">Pesan Positif</h4>
            <p class="quote-text">
              "Mengakui perasaan adalah langkah pertama menuju kesembuhan. Anda
              tidak sendirian dalam perjalanan ini."
            </p>
            <p class="box-text white-text">
              Ingat, tracker ini bersifat rahasia dan hasil Anda hanya digunakan
              untuk membantu Anda mendapatkan dukungan yang tepat.
            </p>
          </div>

          <!-- Help Box -->
          <div class="message-box yellow-box">
            <h4 class="box-title dark-text">Butuh bantuan segera?</h4>
            <p class="box-text">
              Jika Anda merasa dalam krisis atau membutuhkan bantuan segera,
              hubungi layanan darurat atau hotline kesehatan mental.
            </p>
            <a href="#" class="emergency-link" @click.prevent="showEmergencyModal = true">Lihat Kontak Darurat</a>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Emergency Modal -->
  <Teleport to="body">
    <div v-if="showEmergencyModal" class="modal-overlay" @click="showEmergencyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title" style="color: #ef4444;">Kontak Darurat</h3>
          <button class="close-btn" @click="showEmergencyModal = false">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="emergency-note">Jika Anda atau seseorang yang Anda kenal dalam bahaya segera, hubungi nomor darurat di bawah ini:</p>
          
          <div class="contact-list">
            <a href="tel:119" class="contact-item">
              <span class="contact-name">Ambulans / Darurat Medis</span>
              <span class="contact-number">119</span>
            </a>
            <a href="tel:110" class="contact-item">
              <span class="contact-name">Polisi</span>
              <span class="contact-number">110</span>
            </a>
            <div class="contact-item">
              <span class="contact-name">Kemenkes Hotline Kesehatan Jiwa</span>
              <span class="contact-number">1-500-454</span>
            </div>
            <div class="contact-item">
              <span class="contact-name">Layanan SEJIWA (Himpunan Psikologi Ind)</span>
              <span class="contact-number">119 (Ext. 8)</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="showEmergencyModal = false" style="width: 100%">Tutup</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped src="@/assets/css/tracker.css"></style>
