<script setup>
import { ref, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import { Heart, Clock, Check } from "lucide-vue-next";

const currentQuestion = ref(0);
const selectedOption = ref(null);
const progress = ref(10);
const isFinished = ref(false);
const isStarted = ref(false);
const answers = ref([]);
const resultLevel = ref("");

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
    // Save answer
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
    // Restore previous answer
    selectedOption.value = answers.value[currentQuestion.value];
    progress.value = Math.max(((currentQuestion.value + 1) / questions.length) * 100, 0);
  }
};

const finishSurvey = () => {
  calculateResult();
  isFinished.value = true;
  progress.value = 100;

  // Save to history
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

  const saved = localStorage.getItem("pedulimental_tracker_history");
  const history = saved ? JSON.parse(saved) : [];
  history.push(historyItem);
  localStorage.setItem("pedulimental_tracker_history", JSON.stringify(history));
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

        <!-- Right Panel: Info -->
        <div class="info-panel">
          <!-- Purpose Card -->
          <div class="info-card white-card">
            <div class="icon-bubble green-bubble">
              <Heart :size="20" stroke-width="2.5" />
            </div>
            <h3 class="card-title">Tujuan Tracker</h3>
            <p class="card-text">
              Tracker ini dirancang untuk membantu kami memahami kondisi
              kesehatan mental Anda dan memberikan rekomendasi yang sesuai.
            </p>
            <div class="time-estimate">
              <Clock :size="16" />
              <span>Estimasi waktu: 5-7 menit</span>
            </div>
          </div>

          <!-- Positive Message Card -->
          <div class="info-card gradient-card">
            <h3 class="card-title white-text">Pesan Positif</h3>
            <p class="quote-text">
              "Mengakui perasaan adalah langkah pertama menuju kesembuhan. Anda
              tidak sendirian dalam perjalanan ini."
            </p>
            <p class="card-text white-text">
              Ingat, tracker ini bersifat rahasia dan hasil Anda hanya digunakan
              untuk membantu Anda mendapatkan dukungan yang tepat.
            </p>
          </div>

          <!-- Help Card -->
          <div class="info-card yellow-card">
            <h3 class="card-title dark-text">Butuh bantuan segera?</h3>
            <p class="card-text">
              Jika Anda merasa dalam krisis atau membutuhkan bantuan segera,
              hubungi layanan darurat atau hotline kesehatan mental.
            </p>
            <a href="#" class="emergency-link">Lihat Kontak Darurat</a>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  align-items: start;
}

/* Question Panel */
.question-panel {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
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

/* Info Panel */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.white-card {
  background: white;
}

.gradient-card {
  background: linear-gradient(135deg, #5ab2a8 0%, #64b5f6 100%);
  color: white;
}

.yellow-card {
  background: #fffbeb;
  border: 1px solid #fef3c7;
}

.icon-bubble {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.green-bubble {
  background-color: #a3e4d7;
  color: #ffffff;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1e293b;
}

.card-title.white-text {
  color: white;
}

.card-title.dark-text {
  color: #1e293b;
}

.card-text {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-text.white-text {
  color: rgba(255, 255, 255, 0.9);
}

.quote-text {
  font-style: italic;
  font-size: 15px;
  color: white;
  margin-bottom: 16px;
  line-height: 1.5;
  font-weight: 500;
}

.time-estimate {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f1f5f9;
  padding: 10px 16px;
  border-radius: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.emergency-link {
  color: #5ab2a8;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.emergency-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .survey-grid {
    grid-template-columns: 1fr;
  }

  .info-panel {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .info-card {
    min-width: 300px;
  }
}

@media (max-width: 600px) {
  .info-panel {
    flex-direction: column;
  }

  .info-card {
    min-width: 100%;
  }

  .question-text {
    font-size: 20px;
  }
}

/* Result Styles */
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

/* Recommendation Card */
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

/* Welcome Panel */
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
  gap: 24px;
  margin-bottom: 40px;
  color: #475569;
  font-weight: 500;
  flex-wrap: wrap;
  justify-content: center;
}

.welcome-points li {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Reusing check icon color logic if needed or let it inherit */
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
</style>
