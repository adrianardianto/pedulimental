<script setup>
import Navbar from '../components/Navbar.vue';
import HeroSection from '../components/HeroSection.vue';
import FeatureGrid from '../components/FeatureGrid.vue';
import DailyRecommendation from '../components/DailyRecommendation.vue';
</script>

<template>
  <div class="home-view">
    <Navbar />
    <HeroSection />
    <FeatureGrid />
    <DailyRecommendation />
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
