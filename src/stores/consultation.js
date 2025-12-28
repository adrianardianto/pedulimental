import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useConsultationStore = defineStore('consultation', () => {
    const authStore = useAuthStore();

    // State jadwal konsultasi
    const allAppointments = ref(JSON.parse(localStorage.getItem('pedulimental_appointments') || '[]'));

    // Filter jadwal user saat ini
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

    // Data konsultan
    const consultants = [
      {
        id: 1,
        name: "Dr. Sarah Wijaya, M.Psi",
        role: "Psikolog Klinis - Anxiety & Stress Management",
        rating: 4.9,
        imageGradient: "linear-gradient(135deg, #81C7D4 0%, #A2D2CD 100%)", // Blue-Teal
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
        experience: "7 Tahun",
        alumni: "S2 Psikologi Klinis, Universitas Indonesia",
        price: "Rp 250.000",
        approach: "Cognitive Behavioral Therapy (CBT), Mindfulness-Based Therapy",
        about: "Berfokus pada membantu individu mengatasi kecemasan dan stres melalui pendekatan yang terstruktur dan empatik."
      },
      {
        id: 2,
        name: "Dr. Budi Santoso, Sp.KJ",
        role: "Psikiater - Depression & Mood Disorders",
        rating: 4.8,
        imageGradient: "linear-gradient(135deg, #A8D5BA 0%, #81C7D4 100%)", // Green-Blue
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
        experience: "10 Tahun",
        alumni: "Spesialis Kedokteran Jiwa, Universitas Gadjah Mada",
        price: "Rp 350.000",
        approach: "Pharmacotherapy, Psychodynamic Therapy",
        about: "Berpengalaman dalam menangani gangguan mood dan depresi dengan pendekatan medis dan psikologis yang seimbang."
      },
      {
        id: 3,
        name: "Psikolog Amanda Chen, M.Psi",
        role: "Psikolog Konseling - Relationship & Family",
        rating: 4.7,
        imageGradient: "linear-gradient(135deg, #89C4F4 0%, #A2D2CD 100%)", // Light Blue
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1887&auto=format&fit=crop",
        experience: "5 Tahun",
        alumni: "S2 Psikologi Profesi, Universitas Padjadjaran",
        price: "Rp 200.000",
        approach: "Family Systems Therapy, Emotionally Focused Therapy",
        about: "Membantu pasangan dan keluarga membangun komunikasi yang sehat dan hubungan yang harmonis."
      },
    ];

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
        consultants,
        appointments: myAppointments
    };
});
