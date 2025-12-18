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

// State
const searchQuery = ref("");

const groups = ref([
  {
    id: 1,
    name: "Support Group untuk Anxiety",
    memberCount: 1234,
    description: "Ruang aman untuk berbagi pengalaman dan dukungan seputar kecemasan.",
    isJoined: false,
    gradient: "linear-gradient(135deg, #81C7D4 0%, #A2D2CD 100%)"
  },
  {
    id: 2,
    name: "Mindfulness & Meditation",
    memberCount: 892,
    description: "Belajar dan berlatih mindfulness bersama untuk ketenangan jiwa.",
    isJoined: false,
    gradient: "linear-gradient(135deg, #A8D5BA 0%, #81C7D4 100%)"
  },
  { 
    id: 3, 
    name: "Work-Life Balance", 
    memberCount: 756, 
    description: "Diskusi tentang menyeimbangkan karir dan kehidupan pribadi.",
    isJoined: false,
    gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)"
  },
  { 
    id: 4, 
    name: "Self-Care Warriors", 
    memberCount: 1045, 
    description: "Tips dan motivasi untuk merawat diri sendiri setiap hari.",
    isJoined: false,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  { 
    id: 5, 
    name: "Parenting Journey", 
    memberCount: 654, 
    description: "Support system untuk orang tua dalam mengasuh anak dengan penuh kesadaran.",
    isJoined: false,
    gradient: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)"
  },
  { 
    id: 6, 
    name: "Career Stress Relief", 
    memberCount: 890, 
    description: "Berbagi tips dan dukungan untuk mengatasi tekanan di lingkungan kerja.",
    isJoined: false,
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
  },
]);

const activeGroupTab = ref('explore'); // 'explore' | 'joined'
const selectedGroup = ref(null);
const newMessageInput = ref("");
const messagesByGroup = ref({
  1: [ // Anxiety Group
    { id: 1, user: "Sarah", text: "Halo semuanya! Ada yang punya tips mengatasi anxiety saat kerja?", time: "10:30", isMe: false, avatar: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)" },
    { id: 2, user: "Budi", text: "Biasanya aku coba teknik pernapasan 4-7-8, ampuh banget.", time: "10:32", isMe: false, avatar: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)" },
    { id: 3, user: "Anda", text: "Wah, boleh dicoba tuh. Makasih sarannya!", time: "10:35", isMe: true, avatar: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  ],
  2: [ // Mindfulness Group
    { id: 1, user: "Dina", text: "Meditasi pagi ini sangat menenangkan.", time: "07:00", isMe: false, avatar: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
  ],
  3: [], // Work-Life Balance
  4: [], // Self-Care Warriors
});

const currentGroupMessages = computed(() => {
  if (!selectedGroup.value) return [];
  if (!messagesByGroup.value[selectedGroup.value.id]) {
    messagesByGroup.value[selectedGroup.value.id] = [];
  }
  return messagesByGroup.value[selectedGroup.value.id];
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
  group.isJoined = !group.isJoined;
};

const openChat = (group) => {
  if (group.isJoined) {
    selectedGroup.value = group;
  } else {
    // Optional: Prompt to join first
    alert("Silakan gabung grup terlebih dahulu untuk memulai chat.");
  }
};

const closeChat = () => {
  selectedGroup.value = null;
};

const sendMessage = () => {
  if (newMessageInput.value.trim() && selectedGroup.value) {
    if (!messagesByGroup.value[selectedGroup.value.id]) {
      messagesByGroup.value[selectedGroup.value.id] = [];
    }
    
    messagesByGroup.value[selectedGroup.value.id].push({
      id: Date.now(),
      user: "Anda",
      text: newMessageInput.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatar: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    });
    newMessageInput.value = "";
    
    // Auto scroll to bottom (simple implementation)
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
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
          
          <div v-for="group in filteredGroups" :key="group.id" class="group-card" @click="activeGroupTab === 'joined' ? openChat(group) : null" :class="{ 'clickable': activeGroupTab === 'joined' }">
            <div class="card-header" :style="{ background: group.gradient }">
              <div class="type-badge">
                <Users :size="16" />
                <span>Grup</span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="meta-top">
                <span class="member-count">{{ group.memberCount }} Anggota</span>
                <span v-if="group.isJoined" class="status-text joined">Tergabung</span>
              </div>

              <h3 class="group-name">{{ group.name }}</h3>
              <p class="group-desc">{{ group.description }}</p>

              <div class="card-footer">
                 <button
                  class="join-btn"
                  :class="{ joined: group.isJoined }"
                  @click.stop="toggleJoin(group)"
                >
                  {{ group.isJoined ? "KELUAR" : "GABUNG" }}
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

<style scoped>
.komunitas-page {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-bottom: 60px;
}

.main-content {
  padding-top: 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
  /* Removed centered page title to match Edukasi left align */
}

/* Toolbar */
/* Toolbar - Removed centered align */


.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 700px;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 50px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-family: inherit;
  font-size: 16px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #5ab2a8;
  box-shadow: 0 0 0 3px rgba(90, 178, 168, 0.1);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

/* Community Content */
.community-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.community-tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 6px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  justify-content: center;
}

.tab-btn {
  width: 200px;
  padding: 12px;
  text-align: center;
  border: none;
  background: none;
  border-radius: 12px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #5ab2a8; /* Using primary color for active tab background */
  color: white;
  box-shadow: 0 2px 4px rgba(90, 178, 168, 0.2);
}

/* Group List */
.group-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); /* Grid Layout */
  gap: 24px;
}

.group-card {
  display: flex;
  flex-direction: column; /* Stack content vertically */
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s;
  height: 100%; /* Full height */
}

/* Header */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  text-align: center;
}

.page-subtitle {
  color: #64748b;
  margin-bottom: 32px;
  text-align: center;
}

/* Toolbar */
.toolbar {
  display: flex;
  margin-bottom: 32px;
  justify-content: center;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 700px;
}

/* Group Card New Style */
.group-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden; /* Important for header image */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  height: 100%;
  padding: 0; /* Clear padding */
}

.group-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  height: 140px;
  position: relative;
  width: 100%;
}

.type-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
}

.member-count {
  color: #5ab2a8;
  font-weight: 600;
}

.status-text.joined {
  color: #5ab2a8;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.group-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.4;
}

.group-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-footer {
  margin-top: auto;
}

.join-btn {
  width: 100%;
  padding: 10px 0;
}

@media (max-width: 600px) {
  .group-list-container {
    grid-template-columns: 1fr;
  }
}

.clickable {
  cursor: pointer;
}

/* Chat Room Styles */
.chat-room {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px); /* Adjust based on navbar/padding */
  max-width: 1200px; /* Increased from 800px */
  margin: 0 auto;
}

.chat-header {
  padding: 16px 24px;
  background: #5ab2a8;
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.2);
}

.chat-header-info h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.chat-header-info span {
  font-size: 12px;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f1f5f9;
}

.message-bubble {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.my-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-content {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border-top-left-radius: 0;
  position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.my-message .message-content {
  background: #5ab2a8;
  color: white;
  border-radius: 12px;
  border-top-right-radius: 0;
}

.message-user {
  font-size: 11px;
  font-weight: 700;
  color: #5ab2a8;
  display: block;
  margin-bottom: 4px;
}

.message-time {
  font-size: 10px;
  color: #94a3b8;
  display: block;
  text-align: right;
  margin-top: 4px;
}

.my-message .message-time {
  color: rgba(255,255,255,0.8);
}

.chat-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  outline: none;
  font-size: 14px;
}

.chat-input:focus {
  border-color: #5ab2a8;
}

.send-btn {
  background: #5ab2a8;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:hover {
  background: #4a968c;
}
</style>
