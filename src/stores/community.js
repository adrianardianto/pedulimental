import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useCommunityStore = defineStore('community', () => {
    const authStore = useAuthStore();
    
    // State
    // memberships: [{ userEmail, groupId }]
    const memberships = ref(JSON.parse(localStorage.getItem('pedulimental_community_memberships') || '[]'));
    
    // messages: { groupId: [{ id, senderEmail, user, text, time, avatar }] }
    // We treat messages as "Global" (shared server) but we track sender
    const messages = ref(JSON.parse(localStorage.getItem('pedulimental_community_messages') || '{}'));

    // Getters
    const myJoinedGroupIds = computed(() => {
        if (!authStore.user?.email) return [];
        return memberships.value
            .filter(m => m.userEmail === authStore.user.email)
            .map(m => m.groupId);
    });

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
        getMessages
    };
});
