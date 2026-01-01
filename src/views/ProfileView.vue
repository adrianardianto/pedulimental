<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { User, Mail, Phone, Camera, Save } from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// Buat salinan lokal untuk edit agar tidak mengubah store langsung
const editForm = ref({ ...user.value });

const isEditing = ref(false);
const isLoading = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Preview langsung di form lokal
      editForm.value.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveProfile = () => {
  isLoading.value = true;
  // Simulate API call
  setTimeout(() => {
    // Update Store
    authStore.updateUser(editForm.value);
    
    isLoading.value = false;
    isEditing.value = false;
    alert("Profil berhasil diperbarui!");
  }, 1000);
};

// Sinkronkan form lokal dengan data store
onMounted(() => {
  if (!user.value) {
      router.push("/login");
  } else {
      editForm.value = { ...user.value };
  }
});
</script>

<template>
  <div class="profile-page">
    <Navbar />

    <div class="container main-content">
      <h1 class="page-title">Profil Saya</h1>

      <div class="profile-card">
        <!-- Header / Avatar Section -->
        <div class="profile-header">
          <div class="avatar-wrapper">
            <div class="avatar-container">
               <span v-if="!editForm.avatar" class="avatar-initial">{{ editForm.name?.charAt(0) || 'U' }}</span>
               <img v-else :src="editForm.avatar" class="avatar-img" alt="User Avatar" />
               
               <label v-if="isEditing" class="camera-btn">
                 <input type="file" accept="image/*" @change="handleFileChange" hidden />
                 <Camera :size="18" color="white" />
               </label>
            </div>
          </div>
          <div class="header-info">
             <h2 class="user-name">{{ user?.name }}</h2>
             <p class="user-email">{{ user?.email }}</p>
          </div>
          
          <button 
            class="edit-toggle-btn" 
            :class="{ 'cancel-mode': isEditing }"
            @click="isEditing = !isEditing; if(!isEditing) editForm = {...user}"
          >
            {{ isEditing ? 'Batal Edit' : 'Edit Profil' }}
          </button>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label class="form-label">
              <User :size="16" class="icon" /> Nama Lengkap
            </label>
            <input 
              v-model="editForm.name" 
              type="text" 
              class="form-input" 
              :disabled="!isEditing"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Mail :size="16" class="icon" /> Email
            </label>
            <input 
              v-model="editForm.email" 
              type="email" 
              class="form-input" 
              :disabled="!isEditing"
              placeholder="Masukkan email"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Phone :size="16" class="icon" /> Nomor Telepon
            </label>
            <input 
              v-model="editForm.phone" 
              type="tel" 
              class="form-input" 
              :disabled="!isEditing"
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div v-if="isEditing" class="form-actions">
            <button type="submit" class="save-btn" :disabled="isLoading">
              <span v-if="isLoading">Menyimpan...</span>
              <span v-else class="btn-content">
                 <Save :size="18" /> Simpan Perubahan
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/profile.css"></style>
