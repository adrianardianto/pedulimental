<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-vue-next";

const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    
    // Simulate API call
    setTimeout(() => {
        if (email.value && password.value) {
             // Mock Login
             const nameFromEmail = email.value.split('@')[0];
             const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
             
             const user = {
                 name: formattedName,
                 email: email.value,
                 avatar: `https://ui-avatars.com/api/?name=${formattedName}&background=5AB2A8&color=fff`
             };
             
             localStorage.setItem("user", JSON.stringify(user));
             sessionStorage.setItem("user", JSON.stringify(user));
             
             // Dispatch event for Navbar to update
             window.dispatchEvent(new Event("user-login"));
             
             router.push("/");
        } else {
            errorMessage.value = "Email dan kata sandi wajib diisi.";
            isLoading.value = false;
        }
    }, 1000);
};
</script>

<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Left Side - Illustration/Branding -->
      <div class="brand-section">
        <div class="brand-content">
          <h1 class="brand-title">PeduliMental</h1>
          <p class="brand-subtitle">Teman perjalanan kesehatan mentalmu.</p>
          <div class="illustration-placeholder">
             <div class="circle c1"></div>
             <div class="circle c2"></div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="form-section">
        <div class="form-header">
           <h2>Selamat Datang Kembali</h2>
           <p>Masuk untuk mengakses layanan kesehatan mental.</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
               <Mail :size="20" class="input-icon" />
               <input type="email" v-model="email" placeholder="contoh@email.com" required />
            </div>
          </div>

          <div class="form-group">
            <label>Kata Sandi</label>
            <div class="input-wrapper">
               <Lock :size="20" class="input-icon" />
               <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Masukan kata sandi" required />
               <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                 <component :is="showPassword ? EyeOff : Eye" :size="20" />
               </button>
            </div>
          </div>
          
          <div v-if="errorMessage" class="error-alert">
             {{ errorMessage }}
          </div>

          <div class="form-actions">
            <a href="#" class="forgot-password">Lupa kata sandi?</a>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="!isLoading">Masuk</span>
            <span v-else>Memuat...</span>
          </button>
          
          <p class="register-link">
             Belum punya akun? <a href="#">Daftar sekarang</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  padding: 0;
  background-color: white;
}

.login-wrapper {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
}

/* Brand Section */
.brand-section {
  background: linear-gradient(135deg, #5AB2A8 0%, #4a968c 100%);
  padding: 64px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  z-index: 10;
}

.brand-subtitle {
  font-size: 20px;
  opacity: 0.9;
  z-index: 10;
  max-width: 80%;
}

.illustration-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.c1 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
}

.c2 {
  width: 300px;
  height: 300px;
  top: 50px;
  right: -50px;
}

/* Form Section */
.form-section {
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center horizontally effectively */
}

/* Limit form width inside the full section */
.login-form, .form-header {
  width: 100%;
  max-width: 480px; 
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.form-header p {
  color: #64748b;
  font-size: 16px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
}

.input-wrapper input {
  width: 100%;
  padding: 16px 20px 16px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s;
  outline: none;
  background: #f8fafc;
}

.input-wrapper input:focus {
  border-color: #5AB2A8;
  background: white;
  box-shadow: 0 0 0 4px rgba(90, 178, 168, 0.1);
}

.eye-btn {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
}

.eye-btn:hover {
  color: #64748b;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;
}

.forgot-password {
  font-size: 14px;
  color: #5AB2A8;
  text-decoration: none;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background-color: #5AB2A8;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.submit-btn:hover {
  background-color: #4a968c;
}

.submit-btn:active {
  transform: scale(0.99);
}

.submit-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

.register-link {
  text-align: center;
  margin-top: 32px;
  font-size: 15px;
  color: #64748b;
}

.register-link a {
  color: #5AB2A8;
  font-weight: 600;
  text-decoration: none;
}

.error-alert {
    background-color: #fee2e2;
    color: #ef4444;
    padding: 14px;
    border-radius: 12px;
    font-size: 14px;
    margin-bottom: 24px;
    text-align: center;
    font-weight: 500;
}

@media (max-width: 900px) {
  .brand-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr; /* Stack: Brand top, Form bottom */
  }
  
  .brand-section {
    display: flex; /* Show it! */
    min-height: 250px;
    padding: 32px;
    align-items: center;
    text-align: center;
  }

  .brand-title {
    font-size: 32px;
  }

  .brand-subtitle {
     max-width: 100%;
  }
  
  /* Adjust circles for horizontal header */
  .c1 {
    width: 200px;
    height: 200px;
    bottom: -50px;
    left: -50px;
  }

  .c2 {
    width: 150px;
    height: 150px;
    top: -20px;
    right: -20px;
  }
  
  .form-section {
    padding: 32px;
    justify-content: flex-start;
    padding-top: 40px;
    min-height: auto; /* Allow scrolling if needed, don't force full height */
    background: white;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    margin-top: -20px; /* Overlap effect */
    z-index: 20;
    position: relative;
  }

  .form-header h2 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .brand-section {
    min-height: 220px;
    padding: 24px;
  }

  .brand-title {
    font-size: 28px;
  }

  .form-section {
    padding: 24px;
    padding-top: 32px;
  }

  .form-header {
    margin-bottom: 24px;
  }

  .form-header h2 {
    font-size: 24px;
  }

  .form-header p {
    font-size: 14px;
  }

  .input-wrapper input {
    padding: 14px 16px 14px 44px;
    font-size: 14px;
  }

  .submit-btn {
    padding: 14px;
    font-size: 14px;
  }
}
</style>
