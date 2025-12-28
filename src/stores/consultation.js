import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useConsultationStore = defineStore('consultation', () => {
    const authStore = useAuthStore();

    // State (Raw data contains ALL users' appointments)
    const allAppointments = ref(JSON.parse(localStorage.getItem('pedulimental_appointments') || '[]'));

    // Getters
    // Helper to get appointments for current user only
    const myAppointments = computed(() => {
        if (!authStore.user?.email) return [];
        return allAppointments.value.filter(a => a.userEmail === authStore.user.email);
    });

    const upcomingSchedule = computed(() => {
        return myAppointments.value.filter(a => a.status === 'upcoming');
    });

    const history = computed(() => {
        return myAppointments.value.filter(a => a.status === 'completed');
    });

    // Actions
    function addAppointment(appointment) {
        if (!authStore.user?.email) return;

        const appWithUser = { ...appointment, userEmail: authStore.user.email };
        allAppointments.value.push(appWithUser);
        saveToLocalStorage();
    }

    function completeAppointment(id) {
        // Find index in the main array
        const index = allAppointments.value.findIndex(a => a.id === id);
        if (index !== -1) {
            allAppointments.value[index].status = 'completed';
            saveToLocalStorage();
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('pedulimental_appointments', JSON.stringify(allAppointments.value));
    }

    return { 
        upcomingSchedule, 
        history, 
        addAppointment, 
        completeAppointment,
        // Optional: Expose raw getter if needed for debugging, but usually filtered is better
        appointments: myAppointments
    };
});
