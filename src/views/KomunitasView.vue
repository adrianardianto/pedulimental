<script setup>
import { ref, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import {
  Search,
  Heart,
  MessageSquare,
  Plus,
  TrendingUp,
  Users,
  ArrowLeft,
  Send,
} from "lucide-vue-next";
import { useCommunityStore } from "../stores/community";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const communityStore = useCommunityStore();
const authStore = useAuthStore();
const { myJoinedGroupIds } = storeToRefs(communityStore);

// State
const searchQuery = ref("");
// Use authStore for current user
const currentUser = computed(() => authStore.user || { name: 'Anda', email: '', avatar: null });

const groups = computed(() => {
    return communityStore.groups.map(g => ({
        ...g,
        isJoined: communityStore.isJoined(g.id)
    }));
});

const activeGroupTab = ref('explore'); // 'explore' | 'joined'
const selectedGroup = ref(null);
const newMessageInput = ref("");

const currentGroupMessages = computed(() => {
  if (!selectedGroup.value) return [];
  
  const messages = communityStore.getMessages(selectedGroup.value.id);
  
  return messages.map(msg => ({
      ...msg,
      isMe: msg.senderEmail === (currentUser.value?.email)
  }));
});

const filteredGroups = computed(() => {
  let result = groups.value;
  
  if (activeGroupTab.value === 'joined') {
    result = result.filter(g => g.isJoined);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(g => g.name.toLowerCase().includes(query));
  }
  
  return result;
});

const toggleJoin = (group) => {
  if (!currentUser.value.email) {
      alert("Silakan login terlebih dahulu.");
      return;
  }
  if (group.isJoined) {
      if (confirm(`Apakah Anda yakin ingin keluar dari grup "${group.name}"?`)) {
          communityStore.leaveGroup(group.id);
      }
  } else {
      communityStore.joinGroup(group.id);
      // Optional: Ask to open chat immediately? No, let user explore.
      // But maybe switch to 'joined' tab? 
      // activeGroupTab.value = 'joined'; 
  }
};

const openChat = (group) => {
  if (group.isJoined) {
    selectedGroup.value = group;
    // Auto scroll saat dibuka
    setTimeout(scrollToBottom, 100);
  } else {
    alert("Silakan gabung grup terlebih dahulu untuk memulai chat.");
  }
};

const closeChat = () => {
  selectedGroup.value = null;
};

const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
};

const sendMessage = () => {
  if (newMessageInput.value.trim() && selectedGroup.value) {
    communityStore.sendMessage(selectedGroup.value.id, newMessageInput.value);
    newMessageInput.value = "";
    setTimeout(scrollToBottom, 100);
  }
};
</script>

<template>
  <div class="komunitas-page">
    <Navbar />

    <div class="container main-content">
      <div class="header-section">
        <h1 class="page-title">Komunitas</h1>
        <p class="page-subtitle">Bergabung dengan komunitas yang mendukung perjalanan kesehatan mentalmu.</p>
      </div>

      <!-- Top Toolbar -->
      <div class="toolbar">
        <div class="search-wrapper">
          <Search class="search-icon" :size="20" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari komunitas..."
            class="search-input"
          />
        </div>
      </div>

      <div v-if="!selectedGroup" class="community-content-wrapper">
        <div class="community-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeGroupTab === 'explore' }"
            @click="activeGroupTab = 'explore'"
          >
            Semua Komunitas
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeGroupTab === 'joined' }"
            @click="activeGroupTab = 'joined'"
          >
            Komunitas Saya
          </button>
        </div>

        <div class="group-list-container">
          <div v-if="filteredGroups.length === 0" class="empty-state">
            <Users :size="48" class="empty-icon" />
            <p v-if="activeGroupTab === 'joined'">Belum ada komunitas yang diikuti.</p>
            <p v-else>Tidak ada komunitas ditemukan.</p>
          </div>
          
          <div v-for="group in filteredGroups" :key="group.id" class="group-card" :class="{ 'clickable': activeGroupTab === 'joined' }">
            <div class="card-header" :style="{ 
              background: group.image ? `url(${group.image})` : group.gradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }">
              <div class="header-badge member-badge">
                <Users :size="14" />
                <span>{{ group.memberCount }}</span>
              </div>
              <div v-if="group.isJoined" class="header-badge status-badge">
                <span>Tergabung</span>
              </div>
            </div>
            
            <div class="card-body">
              <h3 class="group-name">{{ group.name }}</h3>
              <p class="group-desc">{{ group.description }}</p>

              <div class="card-footer">
                 <div v-if="group.isJoined" class="action-buttons">
                    <button class="btn-chat" @click="openChat(group)">BUKA CHAT</button>
                    <button class="btn-leave" @click.stop="toggleJoin(group)">KELUAR</button>
                 </div>
                 <button
                  v-else
                  class="join-btn"
                  @click.stop="toggleJoin(group)"
                >
                  GABUNG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Room Interface -->
      <div v-else class="chat-room">
        <div class="chat-header">
          <button class="back-btn" @click="closeChat">
            <ArrowLeft :size="24" />
          </button>
          <div class="chat-header-info">
            <h2>{{ selectedGroup.name }}</h2>
            <span>{{ selectedGroup.memberCount }} anggota</span>
          </div>
        </div>

        <div class="chat-messages">
          <div 
            v-for="msg in currentGroupMessages" 
            :key="msg.id" 
            class="message-bubble"
            :class="{ 'my-message': msg.isMe, 'other-message': !msg.isMe }"
          >
            <div v-if="!msg.isMe" class="message-avatar" :style="{ background: msg.avatar }"></div>
            <div class="message-content">
              <span v-if="!msg.isMe" class="message-user">{{ msg.user }}</span>
              <p>{{ msg.text }}</p>
              <span class="message-time">{{ msg.time }}</span>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <input 
            v-model="newMessageInput" 
            type="text" 
            placeholder="Ketik pesan..." 
            class="chat-input"
            @keyup.enter="sendMessage"
          />
          <button class="send-btn" @click="sendMessage">
            <Send :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/komunitas.css"></style>
