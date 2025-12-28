import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'));
    
    // Getters
    const isLoggedIn = computed(() => !!user.value);
    
    // Actions
    function login(userData) {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('user', JSON.stringify(userData)); // Keeping both for compatibility with existing logic
    }
    
    function logout() {
        user.value = null;
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    }
    
    function updateUser(data) {
        user.value = { ...user.value, ...data };
        localStorage.setItem('user', JSON.stringify(user.value));
    }

    return { user, isLoggedIn, login, logout, updateUser };
});
