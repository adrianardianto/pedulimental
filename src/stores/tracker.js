import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useTrackerStore = defineStore('tracker', () => {
    const authStore = useAuthStore();
    
    // State history
    const allHistory = ref(JSON.parse(localStorage.getItem('pedulimental_tracker_history') || '[]'));

    // Filter history user saat ini
    const history = computed(() => {
        if (!authStore.user?.email) return [];
        return allHistory.value.filter(item => item.userEmail === authStore.user.email);
    });

    // Data pertanyaan
    const questions = [
      {
        id: 1,
        text: "Seberapa sering Anda merasa cemas atau khawatir dalam 2 minggu terakhir?",
        options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
      },
      {
        id: 2,
        text: "Seberapa sering Anda merasa tidak berminat untuk melakukan kegiatan sehari-hari?",
        options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
      },
      {
        id: 3,
        text: "Seberapa sering Anda merasa mudah marah atau tersinggung?",
        options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
      },
      {
        id: 4,
        text: "Seberapa sering Anda merasa sedih atau tertekan?",
        options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
      },
      {
        id: 5,
        text: "Seberapa sering Anda merasa sulit tidur atau tidur terlalu banyak?",
        options: ["Tidak pernah", "Beberapa hari", "Lebih dari setengah waktu", "Hampir setiap hari"],
      },
    ];

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
        questions,
        addRecord 
    };
});
