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

<style scoped src="@/assets/css/home.css"></style>
