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

// Make a local copy for editing to avoid direct mutation of store state before save
const editForm = ref({ ...user.value });

const isEditing = ref(false);
const isLoading = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Preview immediately in local form
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

// Sync local form with store user when entering edit mode or mounting
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

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f0fdf9;
  padding-bottom: 60px;
}

.main-content {
  padding-top: 40px;
  max-width: 800px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 40px;
  padding-left: 20px;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-wrapper {
  position: relative;
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #a3e4d7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible; /* Allow camera button to hang out */
}

.avatar-initial {
  font-size: 40px;
  font-weight: 700;
  color: white;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: -5px;
  background-color: #5ab2a8;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.camera-btn:hover {
  transform: scale(1.1);
}

.header-info {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.user-email {
  color: #64748b;
  font-size: 16px;
}

.edit-toggle-btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f1f5f9;
  color: #475569;
  border: none;
}

.edit-toggle-btn:hover {
  background-color: #e2e8f0;
}

.edit-toggle-btn.cancel-mode {
  background-color: #fee2e2;
  color: #ef4444;
}

.edit-toggle-btn.cancel-mode:hover {
  background-color: #fecaca;
}

/* Form Styles */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.icon {
  color: #5ab2a8;
}

.form-input {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.form-input:disabled {
  background-color: transparent;
  border-color: transparent;
  padding-left: 0;
  color: #334155;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #5ab2a8;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(90, 178, 168, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.save-btn {
  background-color: #5ab2a8;
  color: white;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-btn:hover {
  background-color: #4a968c;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .header-info {
    width: 100%;
  }

  .edit-toggle-btn {
    width: 100%;
  }
}
</style>
