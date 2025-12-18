<script setup>
import { ref, onMounted } from 'vue';

const userName = ref('Teman');

onMounted(() => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    userName.value = userData.name.split(' ')[0]; // Get first name
  }
});
</script>

<template>
  <div class="hero-section">
    <div class="container hero-content">
      <h1 class="welcome-title">Selamat Datang {{ userName }}, Ada yang bisa dibantu?</h1>
      <p class="subtitle">Akses edukasi, konsultasi, dan komunitas secara mudah.</p>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #5AB2A8 0%, #4A90E2 100%); /* Teal to Blue gradient attempt */
  background: linear-gradient(to right, #66c7ba, #5ab2a8, #7eb6d9); /* Adjusted to match image better */
  padding: 60px 0 100px; /* Extra padding bottom for potential overlap or spacing */
  color: white;
  text-align: center;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.3;
}

.subtitle {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0 80px; /* Reduced bottom padding */
  }

  .welcome-title {
    font-size: 24px; /* Reduced from 32px */
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px; /* Reduced from 16px */
    padding: 0 16px; /* Prevent text hitting edges */
  }
}
</style>
