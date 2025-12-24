<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { X, CheckCircle, Loader2, CreditCard, Smartphone, Building, Copy, ShieldCheck } from 'lucide-vue-next';

const props = defineProps({
  isVisible: Boolean,
  amount: String,
  title: String,
  description: String
});

const emit = defineEmits(['close', 'success']);

// State
const step = ref('method-selection'); // method-selection, waiting-payment, processing, success
const selectedMethod = ref(null);
const isProcessing = ref(false);
const timeLeft = ref(900); // 15 minutes in seconds
const selectedFile = ref(null);
let timerInterval = null;

const paymentMethods = [
  { id: 'qris', label: 'QRIS / E-Wallet', icon: Smartphone, color: '#EF4444' },
  { id: 'va', label: 'Virtual Account BCA', icon: Building, color: '#3B82F6' },
];

const vaNumber = ref('8008 ' + Math.floor(10000000 + Math.random() * 90000000));

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

// Timer Logic
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timeLeft.value = 900;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const selectMethod = (method) => {
  selectedMethod.value = method;
  step.value = 'waiting-payment';
  startTimer();
};

const copyVASuccess = ref(false);
const copyVA = () => {
  navigator.clipboard.writeText(vaNumber.value.replace(/\s/g, ''));
  copyVASuccess.value = true;
  setTimeout(() => copyVASuccess.value = false, 2000);
};

const checkPaymentStatus = () => {
  isProcessing.value = true;
  step.value = 'processing';
  
  // Simulate Payment Gateway Check
  setTimeout(() => {
    isProcessing.value = false;
    step.value = 'success';
    
    // Auto close
    setTimeout(() => {
        emit('success');
        resetState();
    }, 2500);
  }, 2500);
};

const handleClose = () => {
  if (step.value !== 'processing' && step.value !== 'success') {
    emit('close');
    resetState();
  }
};

const resetState = () => {
  step.value = 'method-selection';
  selectedMethod.value = null;
  selectedFile.value = null;
  isProcessing.value = false;
  if (timerInterval) clearInterval(timerInterval);
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content glass-effect">
        <!-- Close Button -->
        <button v-if="step !== 'success' && step !== 'processing'" class="close-btn" @click="handleClose">
          <X :size="20" />
        </button>

        <!-- STEP 1: Method Selection -->
        <div v-if="step === 'method-selection'" class="fade-in">
          <div class="header-section">
            <h3>Pilih Metode Pembayaran</h3>
            <p>Transaksi aman & terverifikasi otomatis</p>
          </div>
          
          <div class="amount-display">
             <span>Total Tagihan</span>
             <h2>{{ amount }}</h2>
          </div>

          <div class="method-list">
             <div 
               v-for="method in paymentMethods" 
               :key="method.id" 
               class="method-card"
               @click="selectMethod(method)"
             >
                <div class="method-icon" :style="{ background: `${method.color}15`, color: method.color }">
                  <component :is="method.icon" :size="24" />
                </div>
                <div class="method-info">
                   <h4>{{ method.label }}</h4>
                   <span v-if="method.id === 'qris'">GoPay, OVO, Dana, ShopeePay</span>
                   <span v-if="method.id === 'va'">Bank Central Asia (BCA)</span>
                </div>
                <div class="chevron">›</div>
             </div>
          </div>
          
          <div class="security-badge">
             <ShieldCheck :size="16" />
             <span>Pembayaran dilindungi enkripsi end-to-end</span>
          </div>
        </div>

        <!-- STEP 2: Waiting Payment (QRIS or VA) -->
        <div v-else-if="step === 'waiting-payment'" class="fade-in">
           <div class="timer-bar">
              <span>Selesaikan dalam</span>
              <span class="timer-countdown">{{ formatTime(timeLeft) }}</span>
           </div>

           <!-- QRIS UI -->
           <div v-if="selectedMethod.id === 'qris'" class="payment-details">
              <h3>Scan QRIS</h3>
              <p>Scan menggunakan aplikasi E-Wallet pilihan Anda</p>
              
              <div class="qris-frame">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" class="qris-img" />
                  <div class="qris-overlay-logo">QRIS</div>
               </div>
            </div>

           <!-- Virtual Account UI -->
           <div v-if="selectedMethod.id === 'va'" class="payment-details">
              <h3>Virtual Account</h3>
              <p>Lakukan transfer ke nomor VA berikut:</p>
              
              <div class="bank-selector">
                 <div class="bank-logo">BCA</div>
                 <span>Bank Central Asia</span>
              </div>
              
              <div class="va-display">
                 <span class="va-label">Nomor Virtual Account</span>
                 <div class="va-number-row">
                    <span class="va-code">{{ vaNumber }}</span>
                    <button class="copy-btn" @click="copyVA">
                       <component :is="copyVASuccess ? CheckCircle : Copy" :size="18" />
                       {{ copyVASuccess ? 'Disalin' : 'Salin' }}
                    </button>
                 </div>
              </div>
              
              <div class="va-total">
                 <span>Total Bayar:</span>
                 <span class="total-amount">{{ amount }}</span>
              </div>
           </div>

            <div class="upload-section">
               <label class="file-label">Upload Bukti Pembayaran</label>
               <div class="file-input-wrapper" :class="{ 'has-file': selectedFile }">
                 <input 
                   type="file" 
                   accept="image/*" 
                   @change="handleFileChange" 
                   class="file-input"
                 />
                 <div class="file-trigger">
                   <component :is="selectedFile ? CheckCircle : 'div'" :size="contentSize" :color="selectedFile ? '#5AB2A8' : '#94a3b8'">
                      <svg v-if="!selectedFile" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                   </component>
                   <span class="file-text">{{ selectedFile ? selectedFile.name : 'Pilih Foto Bukti' }}</span>
                 </div>
               </div>
            </div>

            <div class="action-footer">
               <button 
                 class="check-status-btn" 
                 @click="checkPaymentStatus"
                 :disabled="!selectedFile"
               >
                  Kirim Bukti & Selesaikan
               </button>
              <button class="change-method-btn" @click="step = 'method-selection'">
                 Ubah Metode Pembayaran
              </button>
           </div>
        </div>

        <!-- STEP 3: Processing -->
        <div v-else-if="step === 'processing'" class="processing-state fade-in center-content">
           <div class="spinner-wrapper">
              <div class="pulse-ring"></div>
              <Loader2 :size="48" class="spin text-primary" />
           </div>
           <h3>Memverifikasi Pembayaran...</h3>
           <p>Mohon tunggu sebentar, sistem sedang mengecek transaksi Anda.</p>
        </div>

        <!-- STEP 4: Success -->
        <div v-else-if="step === 'success'" class="success-state fade-in center-content">
           <div class="success-ring">
              <CheckCircle :size="80" class="text-success" />
           </div>
           <h3>Pembayaran Berhasil!</h3>
           <p>Transaksi Anda telah terkonfirmasi. Mengalihkan...</p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Base Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  padding: 0;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

/* Glass Effect Optional Override */
.glass-effect {
  background: rgba(255, 255, 255, 0.95);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: #64748b;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* Step 1: Selection */
.header-section {
  padding: 30px 30px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.header-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.header-section p {
  color: #64748b;
  font-size: 14px;
}

.amount-display {
  padding: 24px 30px;
  background: linear-gradient(135deg, #5AB2A8 0%, #4a968c 100%);
  color: white;
}

.amount-display span {
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
}

.amount-display h2 {
  font-size: 28px;
  font-weight: 800;
  margin-top: 4px;
}

.method-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.method-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.method-card:hover {
  border-color: #5AB2A8;
  background: #f0fdf9;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(90, 178, 168, 0.1);
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-info {
  flex: 1;
}

.method-info h4 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.method-info span {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-top: 2px;
}

.chevron {
  color: #cbd5e1;
  font-size: 24px;
  font-weight: 300;
}

.security-badge {
  margin-top: auto;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-size: 12px;
  background: #f8fafc;
}

/* Step 2: Waiting Payment */
.timer-bar {
  background: #FEF3C7;
  color: #D97706;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.timer-countdown {
  font-family: monospace;
  font-size: 16px;
  background: #F59E0B;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.payment-details {
  padding: 30px;
  text-align: center;
}

.payment-details h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.payment-details p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 24px;
}

/* QRIS Specific */
.qris-frame {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border: 2px solid #1e293b;
  border-radius: 16px;
  padding: 8px;
  position: relative;
  background: white;
}

.qris-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qris-overlay-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 4px 12px;
  font-weight: 800;
  color: #EF4444;
  border: 2px solid white;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.supported-wallets {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.wallet-tag {
  font-size: 11px;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 20px;
  color: #475569;
  font-weight: 600;
}

/* VA Specific */
.bank-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 24px;
  justify-content: center;
}

.bank-logo {
  font-weight: 800;
  color: #004FB6; /* BCA Blue */
}

.va-display {
  background: #f1f5f9;
  padding: 20px;
  border-radius: 16px;
  text-align: left;
  margin-bottom: 20px;
}

.va-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  display: block;
}

.va-number-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.va-code {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  font-family: monospace;
}

.copy-btn {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5ab2a8;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #f0fdf9;
  border-color: #5ab2a8;
}

.va-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
}

.total-amount {
  font-weight: 700;
  color: #5ab2a8;
}

/* Action Footer for Waiting State */
.action-footer {
  padding: 20px 30px 30px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.check-status-btn {
  width: 100%;
  padding: 14px;
  background: #5AB2A8;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(90, 178, 168, 0.3);
}

.check-status-btn:disabled {
  background-color: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.check-status-btn:hover:not(:disabled) {
  background: #4a968c;
  transform: translateY(-1px);
}

.change-method-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
}

.change-method-btn:hover {
  text-decoration: underline;
}

/* Processing & Success States */
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px; /* Full modal height */
  text-align: center;
  padding: 40px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.text-primary { color: #5AB2A8; }
.text-success { color: #10B981; }

.success-ring {
  margin-bottom: 24px;
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}


/* Upload Styles */
.upload-section {
  padding: 0 30px;
  margin-bottom: 0;
}

.file-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
  text-align: left;
}

.file-input-wrapper {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
}

.file-input-wrapper:hover {
  border-color: #cbd5e1;
}

.file-input-wrapper.has-file {
  border-color: #5AB2A8;
  background: #f0fdf9;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.file-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}
</style>
