<template>
  <div class="home-view">
    <Gn2Hero />
    <Gn2Projects />
    <Gn2Services />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Gn2Hero from '@/components/Gn2Hero.vue'
import Gn2Projects from '@/components/Gn2Projects.vue'
import Gn2Services from '@/components/Gn2Services.vue'
</script>
