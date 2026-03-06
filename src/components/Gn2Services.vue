<template>
  <div class="services-section py-8 w-full" id="services">
    <div class="page-container">
      <div class="section-header text-center mb-14">
        <h2 class="text-white font-extrabold mb-4 tracking-tight">주요 서비스</h2>
        <div class="subtitle mx-auto max-w-[600px] text-lg leading-relaxed">
          다양한 시도와 도전을 통해 끊임없이 기술 개발 및 고객과의 접점을 확대하고 있습니다.
        </div>
      </div>
      <div class="grid-container w-full grid gap-6">
        <a v-for="(s, index) in services" :key="index" :href="s.link" target="_blank" class="card block relative overflow-hidden text-decoration-none">
          <div class="icon drop-shadow-md text-5xl mb-6">🚀</div>
          <h3 class="text-white font-bold mb-2 text-2xl">{{ s.title }}</h3>
          <p class="text-base m-0">{{ s.desc }}</p>
          <div class="arrow absolute text-2xl">→</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ServiceInfo {
  title: string
  desc: string
  link: string
}

const services = ref<ServiceInfo[]>([
  { title: "메리톡톡", desc: "컨텐츠 기반 커뮤니티 서비스", link: "https://www.merrytoktok.com" },
  { title: "와글커뮤니티", desc: "템플릿기반 커뮤니티 솔루션", link: "https://waggle.gn2studio.com" },
  { title: "준비중", desc: "새로운 서비스를 준비중입니다", link: "https://roslyn.dev" }
])
</script>

<style scoped>
h2 {
  font-size: clamp(2rem, 4vw, 3rem);
}

.subtitle {
  color: oklch(70% 0.05 250);
}

.grid-container {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem 2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-10px) scale(1.03);
  border-color: oklch(75% 0.15 200 / 0.5);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px oklch(75% 0.15 200 / 0.2);
}

.card:hover::before {
  opacity: 1;
}

p {
  color: oklch(75% 0.02 250);
}

.arrow {
  bottom: 2rem;
  right: 2rem;
  color: oklch(75% 0.15 200);
  opacity: 0;
  transform: translateX(-15px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}
</style>
