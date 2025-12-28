<script setup>
import { ref } from "vue";
import { User, Menu, X, LogOut, ChevronDown } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();

// Destructure state to maintain reactivity
const { user, isLoggedIn } = storeToRefs(authStore);

const isOpen = ref(false);
const isProfileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
  isProfileMenuOpen.value = false;
  router.push("/login");
};

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <router-link to="/" class="logo">PeduliMental</router-link>

      <!-- Desktop Menu -->
      <div class="nav-links desktop-menu">
        <router-link to="/" class="nav-link" active-class="active"
          >Home</router-link
        >
        <router-link to="/edukasi" class="nav-link" active-class="active"
          >Edukasi</router-link
        >
        <router-link to="/konsultasi" class="nav-link" active-class="active"
          >Konsultasi</router-link
        >
        <router-link to="/tracker" class="nav-link" active-class="active"
          >Tracker</router-link
        >
        <router-link to="/komunitas" class="nav-link" active-class="active"
          >Komunitas</router-link
        >
        <router-link to="/riwayat" class="nav-link" active-class="active"
          >Riwayat</router-link
        >
      </div>

      <div class="nav-right">
        <div v-if="isLoggedIn" class="profile-container">
          <div class="profile-trigger" @click="toggleProfileMenu">
            <div class="profile-icon">
              <!-- <User :size="20" stroke-width="2.5" /> -->
              <!-- Use user avatar if available or initial -->
              <span v-if="!user?.avatar" class="avatar-initial">{{ user?.name?.charAt(0) || 'U' }}</span>
              <img v-else :src="user.avatar" class="avatar-img" alt="User" />
            </div>
            <span class="profile-name desktop-only">{{ user?.name?.split(' ')[0] }}</span>
            <ChevronDown :size="16" class="desktop-only" />
          </div>

          <!-- Profile Dropdown -->
          <div v-if="isProfileMenuOpen" class="profile-dropdown">
            <div class="dropdown-header mobile-only">
               <strong>{{ user?.name }}</strong>
               <p>{{ user?.email }}</p>
            </div>
            
            <router-link to="/profile" class="dropdown-item" @click="isProfileMenuOpen = false">
              <User :size="16" />
              <span>Lihat Profil</span>
            </router-link>
            
            <button class="dropdown-item logout-btn" @click="handleLogout">
              <LogOut :size="16" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
        
        <router-link v-else to="/login" class="login-btn">
           Masuk
        </router-link>

        <!-- Mobile Menu Button -->
        <button class="menu-btn" @click="toggleMenu">
          <component :is="isOpen ? X : Menu" :size="24" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <Transition name="slide-fade">
      <div v-if="isOpen" class="mobile-menu">
        <div class="container mobile-nav-links">
          <router-link
            to="/"
            class="mobile-nav-link"
            active-class="active"
            @click="closeMenu"
            >Home</router-link
          >
          <router-link
            to="/edukasi"
            class="mobile-nav-link"
            active-class="active"
            @click="closeMenu"
            >Edukasi</router-link
          >
          <router-link
            to="/konsultasi"
            class="mobile-nav-link"
            active-class="active"
            @click="closeMenu"
            >Konsultasi</router-link
          >
          <router-link
            to="/tracker"
            class="mobile-nav-link"
            active-class="active"
            @click="closeMenu"
            >Tracker</router-link
          >
          <router-link
            to="/komunitas"
            class="mobile-nav-link"
            active-class="active"
            @click="closeMenu"
            >Komunitas</router-link
          >
          <router-link
            to="/riwayat"
            class="mobile-nav-link"
            active-class="active"
            @click="closeMenu"
            >Riwayat</router-link
          >
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #5ab2a8; /* Brand Green */
  text-decoration: none;
  cursor: pointer;
}

/* Desktop Menu */
.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #94a3b8;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.3s;
  position: relative;
  padding-bottom: 5px;
}

.nav-link:hover,
.nav-link.active {
  color: #5ab2a8;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #5ab2a8;
  border-radius: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Profile Section */
.profile-container {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 24px;
  transition: background 0.2s;
}

.profile-trigger:hover {
  background-color: #f1f5f9;
}

.profile-icon {
  background-color: #a3e4d7;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-initial {
  font-weight: 700;
  font-size: 14px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.profile-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  width: 200px;
  background: white;
  border: 1px solid #f1f5f9;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 8px;
  z-index: 1000;
}

.dropdown-header {
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 8px;
}

.dropdown-header strong {
  display: block;
  font-size: 14px;
  color: #1e293b;
}

.dropdown-header p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: none;
  color: #334155; /* Neutral Slate */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
}

.dropdown-item.logout-btn {
  color: #ef4444;
}

.dropdown-item.logout-btn:hover {
  background-color: #fef2f2;
}

/* Login Button */
.login-btn {
  background-color: #5AB2A8;
  color: white;
  padding: 8px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s;
}

.login-btn:hover {
  background-color: #4a968c;
}

/* Mobile Menu Button - Hidden on Desktop */
.menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #1e293b;
  transition: color 0.2s;
}

.menu-btn:hover {
  color: #5ab2a8;
}

/* Mobile Menu Dropdown */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #f1f5f9;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  z-index: 99;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}

.mobile-nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  display: block;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background-color: #f0fdf9;
  color: #5ab2a8;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Base Mobile/Desktop Helpers */
.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .menu-btn {
    display: block;
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
  
  .profile-trigger {
    padding: 0;
  }
  
  .profile-trigger:hover {
    background: none;
  }
}
</style>
