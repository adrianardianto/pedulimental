import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useEducationStore = defineStore('education', () => {
    const authStore = useAuthStore();
    
    // State (Raw data contains ALL users' history)
    const allHistory = ref(JSON.parse(localStorage.getItem('pedulimental_article_history') || '[]'));

    // Computed: Filtered for CURRENT user
    const history = computed(() => {
        if (!authStore.user?.email) return [];
        return allHistory.value.filter(item => item.userEmail === authStore.user.email);
    });

    // Actions
    function addToHistory(article) {
        if (!authStore.user?.email) return;

        // Check if already in history to avoid duplicates (optional, or just latest)
        // Let's allow duplicates but maybe sorted by time? Or unique by articleId?
        // Usually history is time-based. Let's just push new entry.
        
        const historyItem = {
            id: Date.now(), // Unique ID for the history entry
            userEmail: authStore.user.email,
            articleId: article.id,
            title: article.title,
            desc: article.description,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            category: article.category
        };
        
        allHistory.value.push(historyItem);
        saveToLocalStorage();
    }

    function saveToLocalStorage() {
        localStorage.setItem('pedulimental_article_history', JSON.stringify(allHistory.value));
    }

    return { 
        history, 
        addToHistory 
    };
});
