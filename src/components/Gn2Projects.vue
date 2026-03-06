<template>
  <div class="projects-section py-16 w-full" id="projects">
    <div class="page-container">
      <div class="section-header text-center mb-14">
        <h2 class="text-white font-extrabold mb-4 tracking-tight">주요 프로젝트</h2>
        <div class="subtitle mx-auto max-w-[600px] text-lg leading-relaxed">
          내부 솔루션 커스터마이징과 클라우드 연계로, 단순한 홈페이지 이상의 가치를 제공합니다.
        </div>
      </div>
      <div class="grid-container w-full grid gap-6">
        <div v-for="(p, index) in projects" :key="index" class="card flex flex-col justify-center">
          <h3 class="font-bold mb-4 text-xl">{{ p.title }}</h3>
          <p class="text-[0.95rem] leading-relaxed m-0">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Project {
  title: string
  desc: string
}

const projects = ref<Project[]>([
  { title: "삼성반도체 권한관리 솔루션", desc: "생산라인 접근 권한 제어 및 관리 솔루션 개발 및 유지보수" },
  { title: "SGC에너지 모니터링", desc: "SGC에너지 열병합발전소 모니터링 솔루션 개발 및 유지보수" },
  { title: "인천대학교 국가과제", desc: "인천대학교 삼성전자 테스터기 원격제어 과제 참여" },
  { title: "미래선도과제", desc: "미래부 국가과제 미래선도과제(소상공인네트워크) 참여" },
  { title: "스마트팩토리 보급사업", desc: "스마트팩토리 보급사업 및 컨설팅, 현장관리 및 솔루션 제안" },
  { title: "헬스케어 솔루션", desc: "운동 및 식단관리 솔루션 개발" }
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

h3 {
  color: oklch(90% 0.05 200);
}

p {
  color: oklch(75% 0.02 250);
}
</style>
