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

<style scoped>
.survey-page {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-bottom: 60px;
}

.main-content {
  padding-top: 40px;
}

.survey-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

}


.question-panel {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 8px;
  font-weight: 500;
}

.progress-percent {
  color: #5ab2a8;
  font-weight: 700;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background-color: #f1f5f9;
  border-radius: 4px;
  margin-bottom: 32px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #5ab2a8;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.question-text {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
  line-height: 1.4;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background-color: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.option-card:hover {
  background-color: #f0fdf9;
}

.option-card.selected {
  background-color: #f0fdf9;
  border-color: #5ab2a8;
}

.radio-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.option-card.selected .radio-circle {
  border-color: #5ab2a8;
}

.radio-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #5ab2a8;
}

.option-text {
  font-size: 16px;
  color: #475569;
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.btn-prev {
  padding: 12px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #94a3b8;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-prev:hover:not(:disabled) {
  background: #f8fafc;
  color: #64748b;
}

.btn-prev:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-next {
  padding: 12px 32px;
  background: #5ab2a8;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-next:hover:not(:disabled) {
  background: #4a968c;
}

.btn-next:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}


.info-sidebar {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;

}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.sidebar-description {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.time-estimate-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f1f5f9;
  padding: 12px 16px;
  border-radius: 12px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
}

.message-box {
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.message-box:last-child {
  margin-bottom: 0;
}

.gradient-box {
  background: linear-gradient(135deg, #5ab2a8 0%, #64b5f6 100%);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(90, 178, 168, 0.2);
}

.yellow-box {
  background: #fffbeb;
  border: 1px solid #fef3c7;
}

.box-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.box-title.white-text {
  color: white;
}

.box-title.dark-text {
  color: #1e293b;
}

.box-text {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 0;
}

.box-text.white-text {
  color: rgba(255, 255, 255, 0.95);
}

.yellow-box .box-text {
  color: #64748b;
  margin-bottom: 12px;
}

.green-bubble-soft {
  width: 48px;
  height: 48px;
  background-color: #f0fdf9;
  color: #5ab2a8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.quote-text {
  font-style: italic;
  font-size: 15px;
  color: white;
  margin-bottom: 16px;
  line-height: 1.5;
  font-weight: 600;
  opacity: 0.95;
}

.emergency-link {
  color: #5ab2a8;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.emergency-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .survey-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .info-sidebar {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .question-text {
    font-size: 20px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .question-panel, .info-sidebar {
    padding: 24px;
  }
}


.result-panel {
  text-align: center;
}

.result-header {
  margin-bottom: 24px;
}

.result-icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #f0fdf9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #5ab2a8;
}

.score-badge {
  display: inline-block;
  padding: 8px 24px;
  border-radius: 30px;
  font-weight: 700;
  margin-bottom: 16px;
  font-size: 16px;
}

.score-badge.normal { background-color: #d1fae5; color: #059669; }
.score-badge.ringan { background-color: #fef3c7; color: #d97706; }
.score-badge.sedang { background-color: #ffedd5; color: #ea580c; }
.score-badge.berat { background-color: #fee2e2; color: #dc2626; }

.result-description {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 32px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.restart-btn {
  padding: 12px 24px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.restart-btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.consult-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #5ab2a8;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
  border: none;
}

.consult-link:hover {
  background-color: #4a968c;
}


.recommendation-card {
  background: #f0fdf9;
  border-radius: 16px;
  padding: 32px;
  text-align: left;
  border: 1px solid #ccfbf1;
}

.rec-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
  text-align: center;
}

.rec-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rec-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: #334155;
}

.check-icon {
  color: #5ab2a8;
  flex-shrink: 0;
  margin-top: 2px;
}


.welcome-panel {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.welcome-icon {
  width: 100px;
  height: 100px;
  background-color: #f0fdf9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5ab2a8;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 16px;
  max-width: 500px;
}

.welcome-desc {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 32px;
  max-width: 480px;
  line-height: 1.6;
}

.welcome-points {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
  color: #475569;
  font-weight: 500;
  align-items: flex-start;
}

.welcome-points li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.welcome-points li svg {
  color: #5ab2a8;
}

.btn-start {
  padding: 16px 48px;
  background-color: #5ab2a8;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(90, 178, 168, 0.3);
}

.btn-start:hover {
  background-color: #4a968c;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(90, 178, 168, 0.4);
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  line-height: 1;
}

.emergency-note {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.5;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.contact-item:hover {
  background: #fee2e2;
  transform: translateY(-1px);
}

.contact-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.contact-number {
  font-weight: 700;
  color: #ef4444;
  font-size: 16px;
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@keyframes modalScale {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    padding: 16px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    text-align: left;
  }
  
  .contact-name {
      font-size: 13px;
  }

  .contact-number {
    font-size: 14px;
    align-self: flex-start;
    width: 100%;
    text-align: center;
    margin-top: 4px;
    background: white;
  }
}
</style>
