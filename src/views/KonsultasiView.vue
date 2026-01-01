<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { Star, Calendar, Clock, CheckCircle, GraduationCap, Briefcase, Video } from "lucide-vue-next";
import VideoCallModal from "../components/VideoCallModal.vue";
import PaymentModal from "../components/PaymentModal.vue";
import { useConsultationStore } from "../stores/consultation";
import { storeToRefs } from "pinia";

const consultationStore = useConsultationStore();
const { upcomingSchedule: mySchedule, history: consultationHistory } = storeToRefs(consultationStore);

const activeMenu = ref("Konsultan Tersedia");
const selectedConsultant = ref(null);
const bookingDate = ref("");
const bookingTime = ref("");

const showVideoCall = ref(false);
const showPaymentModal = ref(false);
const activeAppointment = ref(null);

const route = useRoute();

const menuItems = ["Jadwal Saya", "Konsultan Tersedia", "Riwayat Konsultasi"];

const consultants = consultationStore.consultants;

const selectConsultant = (consultant) => {
  selectedConsultant.value = consultant;
  // Set default tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  bookingDate.value = tomorrow.toISOString().split('T')[0];
  bookingTime.value = "10:00";

  // Auto scroll ke detail panel di mobile/tablet
  setTimeout(() => {
    if (window.innerWidth <= 1024) {
      const detailPanel = document.querySelector('.detail-panel');
      if (detailPanel) {
        const yOffset = -80; // Offset navbar
        const startY = window.pageYOffset;
        const targetY = detailPanel.getBoundingClientRect().top + window.pageYOffset + yOffset;
        const distance = targetY - startY;
        const duration = 1000; // Durasi 1 detik
        let startTime = null;

        const ease = (t, b, c, d) => {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        };

        const animation = (currentTime) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = ease(timeElapsed, startY, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
      }
    }
  }, 100);
};

const closeDetailPanel = () => {
  selectedConsultant.value = null;
};

const confirmBooking = () => {
  if (bookingDate.value && bookingTime.value && selectedConsultant.value) {
    showPaymentModal.value = true;
  }
};

const handlePaymentSuccess = () => {
  showPaymentModal.value = false;
  
  const newAppointment = {
    id: Date.now(),
    consultant: selectedConsultant.value,
    date: bookingDate.value,
    time: bookingTime.value,
    status: 'upcoming'
  };
  
  // Use STORE action
  consultationStore.addAppointment(newAppointment);

  // Alert handled by modal success state, but we can do extra cleanup
  closeDetailPanel();
  activeMenu.value = "Jadwal Saya";
};

const finishConsultation = (appointment) => {
  // Use STORE action
  consultationStore.completeAppointment(appointment.id);
};

const startVideoCall = (appointment) => {
  activeAppointment.value = appointment;
  showVideoCall.value = true;
};

const endVideoCall = () => {
  showVideoCall.value = false;
  activeAppointment.value = null;
};

onMounted(() => {
  // Cek konsultan yang dipilih dari halaman lain (misal Riwayat)
  if (route.query.consultantId) {
    const cId = parseInt(route.query.consultantId);
    const found = consultants.find(c => c.id === cId);
    if (found) {
        selectConsultant(found);
    }
  }
});
</script>

<template>
  <div class="konsultasi-page">
    <Navbar />

    <div class="container main-content">
      <div class="layout-grid" :class="{ 'with-detail': selectedConsultant && activeMenu === 'Konsultan Tersedia' }">
        <!-- Sidebar Menu -->
        <div class="sidebar">
          <div class="menu-list">
            <button
              v-for="item in menuItems"
              :key="item"
              class="menu-item"
              :class="{ active: activeMenu === item }"
              @click="activeMenu = item"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="content-area">
          <h2 class="section-title" v-if="!selectedConsultant || activeMenu !== 'Konsultan Tersedia'">
             {{ activeMenu }}
          </h2>
          <h2 class="section-title" v-else>Konsultan Tersedia</h2>

          <div
            v-if="activeMenu === 'Konsultan Tersedia'"
            class="consultant-list"
          >
            <div
              v-for="consultant in consultants"
              :key="consultant.id"
              class="consultant-card"
              :class="{ active: selectedConsultant?.id === consultant.id }"
            >
              <div
                class="card-avatar"
                :style="{ 
                  background: consultant.image ? `url(${consultant.image})` : consultant.imageGradient,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top'
                }"
              ></div>

              <div class="card-info">
                <h3 class="consultant-name">{{ consultant.name }}</h3>
                <p class="consultant-role">{{ consultant.role }}</p>
                <div class="rating-badge">
                  <Star :size="16" fill="#FCD34D" color="#FCD34D" />
                  <span>{{ consultant.rating }}</span>
                </div>

                <button class="select-btn" @click="selectConsultant(consultant)">
                  {{ selectedConsultant?.id === consultant.id ? 'Terpilih' : 'Pilih Konsultan' }}
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="activeMenu === 'Jadwal Saya'" class="schedule-list">
             <div v-if="mySchedule.length > 0" class="schedule-grid">
               <div v-for="appointment in mySchedule" :key="appointment.id" class="schedule-card">
                 <div class="schedule-header">
                   <div class="card-avatar small" :style="{ 
                     background: appointment.consultant.image ? `url(${appointment.consultant.image})` : appointment.consultant.imageGradient,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center top'
                   }"></div>
                   <div>
                     <h4 class="consultant-name small">{{ appointment.consultant.name }}</h4>
                     <p class="consultant-role small">{{ appointment.consultant.role }}</p>
                   </div>
                 </div>
                 <div class="schedule-time">
                   <div class="time-row">
                     <Calendar :size="16" />
                     <span>{{ appointment.date }}</span>
                   </div>
                   <div class="time-row">
                     <Clock :size="16" />
                     <span>{{ appointment.time }}</span>
                   </div>
                 </div>
                <div class="action-buttons">
                  <button class="video-btn" @click="startVideoCall(appointment)">
                    <Video :size="18" />
                    Video Call
                  </button>
                  <button class="finish-btn" @click="finishConsultation(appointment)">Selesai Konsultasi</button>
                </div>
               </div>
             </div>
             <div v-else class="empty-placeholder">
               <p>Belum ada jadwal konsultasi.</p>
             </div>
          </div>

          <div v-else-if="activeMenu === 'Riwayat Konsultasi'" class="history-list">
             <div v-if="consultationHistory.length > 0" class="schedule-grid">
               <div v-for="appointment in consultationHistory" :key="appointment.id" class="schedule-card history">
                 <div class="schedule-header">
                   <div class="card-avatar small" :style="{ 
                     background: appointment.consultant.image ? `url(${appointment.consultant.image})` : appointment.consultant.imageGradient,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center top'
                   }"></div>
                   <div>
                     <h4 class="consultant-name small">{{ appointment.consultant.name }}</h4>
                     <p class="consultant-role small">{{ appointment.consultant.role }}</p>
                   </div>
                 </div>
                 <div class="schedule-time">
                   <div class="time-row">
                     <Calendar :size="16" />
                     <span>{{ appointment.date }}</span>
                   </div>
                   <div class="time-row">
                     <CheckCircle :size="16" color="#5AB2A8" />
                     <span class="completed-text">Selesai</span>
                   </div>
                 </div>
               </div>
             </div>
             <div v-else class="empty-placeholder">
               <p>Belum ada riwayat konsultasi.</p>
             </div>
          </div>

          <div v-else class="empty-placeholder">
            <p>Belum ada data untuk bagian ini.</p>
          </div>
        </div>

        <!-- Detail Panel (Right Column) -->
        <div v-if="selectedConsultant && activeMenu === 'Konsultan Tersedia'" class="detail-panel">
           <div class="detail-header">
              <div class="detail-avatar" :style="{ 
                background: selectedConsultant.image ? `url(${selectedConsultant.image})` : selectedConsultant.imageGradient,
                backgroundSize: 'cover',
                backgroundPosition: 'center top'
              }"></div>
              <h3 class="detail-name">{{ selectedConsultant.name }}</h3>
              <p class="detail-role">{{ selectedConsultant.role }}</p>
           </div>
           
           <div class="detail-section">
              <div class="detail-item">
                 <div class="detail-icon"><Briefcase :size="18" /></div>
                 <div>
                    <span class="detail-label">Pengalaman</span>
                    <p class="detail-value">{{ selectedConsultant.experience }}</p>
                 </div>
              </div>
              <div class="detail-item">
                 <div class="detail-icon"><GraduationCap :size="18" /></div>
                 <div>
                    <span class="detail-label">Pendidikan</span>
                    <p class="detail-value">{{ selectedConsultant.alumni }}</p>
                 </div>
              </div>
           </div>

           <div class="detail-divider"></div>

           <div class="detail-section">
              <h4 class="section-label">Pendekatan</h4>
              <p class="section-text">{{ selectedConsultant.approach }}</p>
           </div>
           
           <div class="booking-form">
              <h4 class="section-label">Jadwalkan Sesi</h4>
              <div class="form-row">
                  <div class="form-group">
                    <label>Tanggal</label>
                    <input type="date" v-model="bookingDate" class="input-light" />
                  </div>
                  <div class="form-group">
                    <label>Waktu</label>
                    <select v-model="bookingTime" class="input-light">
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                    </select>
                  </div>
              </div>
              
              <div class="price-info">
                 <span>Total Biaya</span>
                 <span class="price-tag">{{ selectedConsultant.price }}</span>
              </div>
              
              <button class="book-now-btn" @click="confirmBooking">
                 Konfirmasi & Bayar
              </button>
           </div>
        </div>
      </div>
    </div>

    <VideoCallModal 
      v-if="showVideoCall"
      :is-visible="showVideoCall"
      :recipient-name="activeAppointment?.consultant?.name || 'Doctor'"
      @close="endVideoCall"
    />

    <PaymentModal
      :is-visible="showPaymentModal"
      :amount="selectedConsultant?.price || 'Rp 0'"
      title="Pembayaran Konsultasi"
      description="Silakan selesaikan pembayaran untuk konfirmasi jadwal Anda."
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
    />
  </div>
</template>

<style scoped src="@/assets/css/konsultasi.css"></style>
