<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const isLoading = ref(false);
const errorMessage = ref("");

const handleRegister = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    
    // Simulate API call
    setTimeout(() => {
        if (!name.value || !email.value || !password.value || !confirmPassword.value) {
           errorMessage.value = "Semua kolom wajib diisi.";
           isLoading.value = false;
           return;
        }

        if (password.value !== confirmPassword.value) {
            errorMessage.value = "Konfirmasi kata sandi tidak cocok.";
            isLoading.value = false;
            return;
        }

        // Mock Registration & Login
        const user = {
             name: name.value,
             email: email.value,
             avatar: `https://ui-avatars.com/api/?name=${name.value}&background=5AB2A8&color=fff`
         };
         
         // Use Pinia Store to log the user in immediately
         authStore.login(user);
         
         router.push("/");
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
          <p class="brand-subtitle">Bergabunglah bersama kami dan mulai perjalanan kesehatan mentalmu.</p>
          <div class="illustration-placeholder">
             <div class="circle c1"></div>
             <div class="circle c2"></div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="form-section">
        <div class="form-header">
           <h2>Buat Akun Baru</h2>
           <p>Daftar untuk mengakses semua fitur layanan.</p>
        </div>

        <form @submit.prevent="handleRegister" class="login-form">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <div class="input-wrapper">
               <User :size="20" class="input-icon" />
               <input 
                 type="text" 
                 v-model="name" 
                 placeholder="Masukkan nama lengkap" 
                 required 
                 autocomplete="name" 
               />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
               <Mail :size="20" class="input-icon" />
               <input 
                 type="email" 
                 v-model="email" 
                 placeholder="contoh@email.com" 
                 required 
                 autocomplete="email" 
               />
            </div>
          </div>

          <div class="form-group">
            <label>Kata Sandi</label>
            <div class="input-wrapper">
               <Lock :size="20" class="input-icon" />
               <input 
                 :type="showPassword ? 'text' : 'password'" 
                 v-model="password" 
                 placeholder="Buat kata sandi" 
                 required 
                 autocomplete="new-password"
               />
               <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                 <component :is="showPassword ? EyeOff : Eye" :size="20" />
               </button>
            </div>
          </div>

          <div class="form-group">
            <label>Konfirmasi Kata Sandi</label>
            <div class="input-wrapper">
               <Lock :size="20" class="input-icon" />
               <input 
                 :type="showConfirmPassword ? 'text' : 'password'" 
                 v-model="confirmPassword" 
                 placeholder="Ulangi kata sandi" 
                 required 
                 autocomplete="new-password"
               />
               <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword">
                 <component :is="showConfirmPassword ? EyeOff : Eye" :size="20" />
               </button>
            </div>
          </div>
          
          <div v-if="errorMessage" class="error-alert">
             {{ errorMessage }}
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="!isLoading">Daftar Sekarang</span>
            <span v-else>Memproses...</span>
          </button>
          
          <p class="register-link">
             Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/auth.css"></style>
