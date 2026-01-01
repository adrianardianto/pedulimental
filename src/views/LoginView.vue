<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    
    // API call
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
             
             // Use Pinia Store
             authStore.login(user);
             
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
               <input 
                 type="email" 
                 name="email"
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
                 name="password"
                 v-model="password" 
                 placeholder="Masukan kata sandi" 
                 required 
                 autocomplete="current-password"
               />
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
             Belum punya akun? <router-link to="/register">Daftar sekarang</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/auth.css"></style>
