<template>
  <div class="hero-section relative overflow-hidden">
    <!-- Animated Background Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Grid Pattern Overlay -->
    <div class="grid-overlay"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-40 flex flex-col items-center text-center">
      <!-- Badge -->
      <div class="badge animate-fade-in">
        <span class="badge-dot"></span>
        AI 기반 IT 솔루션 전문 기업
      </div>

      <!-- Main Heading -->
      <h1 class="hero-title animate-fade-in-up" style="animation-delay: 0.1s;">
        기술로 연결하는<br>
        <span class="title-gradient">미래의 가능성</span>
      </h1>

      <!-- Sub Heading -->
      <p class="hero-sub animate-fade-in-up" style="animation-delay: 0.2s;">
        GPT 기반 AI부터 Azure / AWS 클라우드까지.<br class="hidden sm:block" />
        기획 · 디자인 · 개발 · 운영을 <strong>One-Stop</strong>으로 제공합니다.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-wrap gap-4 justify-center animate-fade-in-up" style="animation-delay: 0.3s;">
        <router-link to="/portfolio" class="btn-primary">
          포트폴리오 보기
          <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
        </router-link>
        <router-link to="/customer/inquiry" class="btn-secondary">
          프로젝트 문의하기
        </router-link>
      </div>

      <!-- Stats Row -->
      <div class="stats-row animate-fade-in-up" style="animation-delay: 0.4s;">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator animate-float">
        <div class="scroll-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '3년+', label: '개발 경험' },
  { value: '20+', label: '완성 프로젝트' },
  { value: '100%', label: '고객 만족' },
  { value: 'AWS·Azure', label: '공식 파트너' },
]
</script>

<style scoped>
.hero-section {
  min-height: 92vh;
  display: flex;
  align-items: center;
  background: transparent;
}

/* Background Orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, oklch(55% 0.2 200 / 0.12) 0%, transparent 70%);
  top: -200px; left: -200px;
  animation: drift1 12s ease-in-out infinite alternate;
}
.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, oklch(55% 0.2 260 / 0.1) 0%, transparent 70%);
  bottom: -150px; right: -150px;
  animation: drift2 15s ease-in-out infinite alternate;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, oklch(70% 0.15 180 / 0.08) 0%, transparent 70%);
  top: 40%; left: 60%;
  animation: drift3 8s ease-in-out infinite alternate;
}

@keyframes drift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px, 40px) scale(1.1); } }
@keyframes drift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-40px, -30px) scale(1.05); } }
@keyframes drift3 { from { transform: translate(0,0) scale(1); } to { transform: translate(20px, -20px) scale(0.9); } }

/* Grid Overlay */
.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  pointer-events: none;
}

/* Badge */
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(120, 200, 250, 0.08);
  border: 1px solid rgba(120, 200, 250, 0.25);
  border-radius: 30px;
  padding: 6px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  color: oklch(78% 0.12 200);
  letter-spacing: 0.04em;
  margin-bottom: 2rem;
}
.badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: oklch(75% 0.15 200);
  box-shadow: 0 0 8px oklch(75% 0.15 200 / 0.8);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Title */
.hero-title {
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: white;
  margin-bottom: 1.5rem;
}
.title-gradient {
  background: linear-gradient(135deg, oklch(75% 0.15 200) 0%, oklch(90% 0.08 240) 50%, #fff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Sub */
.hero-sub {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: oklch(78% 0.03 250);
  max-width: 580px;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}
.hero-sub strong { color: var(--accent); font-weight: 600; }

/* CTA Buttons */
.btn-primary {
  display: inline-flex; align-items: center;
  padding: 0.9rem 2rem;
  border-radius: 14px;
  background: oklch(55% 0.18 250);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 20px oklch(55% 0.18 250 / 0.4);
}
.btn-primary:hover {
  background: oklch(62% 0.2 250);
  box-shadow: 0 8px 32px oklch(55% 0.18 250 / 0.6);
  transform: translateY(-3px);
  color: white;
}
.btn-secondary {
  display: inline-flex; align-items: center;
  padding: 0.9rem 2rem; border-radius: 14px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  color: white; font-weight: 600; font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.btn-secondary:hover {
  background: rgba(255,255,255,0.12);
  border-color: var(--accent);
  color: white;
  transform: translateY(-2px);
}

/* Stats */
.stats-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem 4rem;
  margin-top: 4rem;
  padding: 2rem 3rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  backdrop-filter: blur(12px);
}
.stat-item { text-align: center; }
.stat-value {
  display: block;
  font-size: 1.6rem; font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.02em;
}
.stat-label {
  display: block;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.4);
  margin-top: 4px;
  letter-spacing: 0.04em;
}

/* Scroll Indicator */
.scroll-indicator {
  margin-top: 3rem;
  width: 26px; height: 42px;
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 13px;
  display: flex; justify-content: center; padding-top: 6px;
}
.scroll-dot {
  width: 4px; height: 8px;
  background: var(--accent);
  border-radius: 2px;
  animation: scroll-down 1.8s ease-in-out infinite;
}
@keyframes scroll-down { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(12px); } }

/* Animations (complementing Tailwind) */
.animate-fade-in { opacity: 0; animation: fadeIn 0.5s ease forwards; }
.animate-fade-in-up { opacity: 0; animation: fadeInUp 0.6s ease forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }

@keyframes fadeIn { to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
</style>
