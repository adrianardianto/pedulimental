import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useTrackerStore = defineStore('tracker', () => {
    // Access auth store to get current user
    const authStore = useAuthStore();
    
    // State (Raw data contains ALL users' history)
    const allHistory = ref(JSON.parse(localStorage.getItem('pedulimental_tracker_history') || '[]'));

    // Computed: Filtered history for CURRENT user only
    const history = computed(() => {
        if (!authStore.user?.email) return [];
        return allHistory.value.filter(item => item.userEmail === authStore.user.email);
    });

    // Actions
    function addRecord(record) {
        if (!authStore.user?.email) return;

        // Attach user email to the record
        const recordWithUser = { ...record, userEmail: authStore.user.email };
        
        allHistory.value.push(recordWithUser);
        saveToLocalStorage();
    }

    function saveToLocalStorage() {
        localStorage.setItem('pedulimental_tracker_history', JSON.stringify(allHistory.value));
    }

    return { 
        history, 
        addRecord 
    };
});
