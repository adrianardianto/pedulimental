import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useCommunityStore = defineStore('community', () => {
    const authStore = useAuthStore();
    
    // State data (keanggotaan user dan pesan chat)
    const memberships = ref(JSON.parse(localStorage.getItem('pedulimental_community_memberships') || '[]'));
    const messages = ref(JSON.parse(localStorage.getItem('pedulimental_community_messages') || '{}'));

    // Getters
    const myJoinedGroupIds = computed(() => {
        if (!authStore.user?.email) return [];
        return memberships.value
            .filter(m => m.userEmail === authStore.user.email)
            .map(m => m.groupId);
    });

    const groups = [
          {
            id: 1,
            name: "Support Group untuk Anxiety",
            memberCount: 1234,
            description: "Ruang aman untuk berbagi pengalaman dan dukungan seputar kecemasan.",
            gradient: "linear-gradient(135deg, #81C7D4 0%, #A2D2CD 100%)",
            image: 'https://cdn.pixabay.com/photo/2017/01/30/02/20/anxiety-2019928_1280.jpg'
          },
          {
            id: 2,
            name: "Mindfulness & Meditation",
            memberCount: 892,
            description: "Belajar dan berlatih mindfulness bersama untuk ketenangan jiwa.",
            gradient: "linear-gradient(135deg, #A8D5BA 0%, #81C7D4 100%)",
            image: 'https://cdn.pixabay.com/photo/2017/03/26/21/54/yoga-2176668_640.jpg'
          },
          { 
            id: 3, 
            name: "Work-Life Balance", 
            memberCount: 756, 
            description: "Diskusi tentang menyeimbangkan karir dan kehidupan pribadi.",
            gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
            image: 'https://cdn.pixabay.com/photo/2018/02/08/10/22/desk-3139127_640.jpg'
          },
          { 
            id: 4, 
            name: "Self-Care Warriors", 
            memberCount: 1045, 
            description: "Tips dan motivasi untuk merawat diri sendiri setiap hari.",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            image: 'https://cdn.pixabay.com/photo/2020/06/10/07/05/yoga-5281457_640.jpg'
          },
          { 
            id: 5, 
            name: "Parenting Journey", 
            memberCount: 654, 
            description: "Support system untuk orang tua dalam mengasuh anak dengan penuh kesadaran.",
            gradient: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
            image: 'https://cdn.pixabay.com/photo/2020/04/12/08/50/child-5033381_640.jpg'
          },
          { 
            id: 6, 
            name: "Career Stress Relief", 
            memberCount: 890, 
            description: "Berbagi tips dan dukungan untuk mengatasi tekanan di lingkungan kerja.",
            gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
            image: 'https://cdn.pixabay.com/photo/2019/05/13/22/15/frustrated-4201046_640.jpg'
          },
    ];

    // Actions
    function joinGroup(groupId) {
        if (!authStore.user?.email) return;
        if (isJoined(groupId)) return;

        memberships.value.push({
            userEmail: authStore.user.email,
            groupId
        });
        saveMemberships();
    }

    function leaveGroup(groupId) {
        if (!authStore.user?.email) return;
        
        memberships.value = memberships.value.filter(m => 
            !(m.userEmail === authStore.user.email && m.groupId === groupId)
        );
        saveMemberships();
    }

    function isJoined(groupId) {
        if (!authStore.user?.email) return false;
        return memberships.value.some(m => 
            m.userEmail === authStore.user.email && m.groupId === groupId
        );
    }

    function sendMessage(groupId, text) {
        if (!authStore.user?.email) return;

        if (!messages.value[groupId]) {
            messages.value[groupId] = [];
        }

        const newMessage = {
            id: Date.now(),
            senderEmail: authStore.user.email,
            user: authStore.user.name,
            avatar: authStore.user.avatar,
            text,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        };

        messages.value[groupId].push(newMessage);
        saveMessages();
    }

    function getMessages(groupId) {
        return messages.value[groupId] || [];
    }

    function saveMemberships() {
        localStorage.setItem('pedulimental_community_memberships', JSON.stringify(memberships.value));
    }

    function saveMessages() {
        localStorage.setItem('pedulimental_community_messages', JSON.stringify(messages.value));
    }

    return { 
        myJoinedGroupIds,
        joinGroup,
        leaveGroup,
        isJoined,
        sendMessage,
        getMessages,
        groups
    };
});
