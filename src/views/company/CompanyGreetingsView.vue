<template>
  <div class="page-view">
    <!-- Page Hero -->
    <div class="page-hero relative overflow-hidden">
      <div class="hero-glow"></div>
      <div class="page-container py-20 relative z-10">
        <div class="breadcrumb">
          <router-link to="/" class="bc-link">홈</router-link>
          <span class="bc-sep">›</span>
          <span class="bc-current">회사소개</span>
          <span class="bc-sep">›</span>
          <span class="bc-current">인사말</span>
        </div>
        <h1 class="page-title mt-4">대표이사 <span class="text-gradient">인사말</span></h1>
        <p class="page-subtitle">GN2Studio의 비전과 철학을 소개합니다</p>
      </div>
    </div>

    <!-- Content -->
    <div class="page-container py-16">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- CEO Image Placeholder -->
        <div class="relative">
          <div class="ceo-photo-frame">
            <div class="ceo-photo-placeholder">
              <i class="fa-solid fa-user-tie text-6xl text-white/20"></i>
              <p class="text-white/30 text-sm mt-4">대표이사</p>
            </div>
          </div>
          <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-2xl"></div>
        </div>

        <!-- Greeting Text -->
        <div class="space-y-6">
          <div class="glass-card">
            <h2 class="text-2xl font-bold text-white mb-6">
              기술로 더 나은 세상을,<br>
              <span class="text-[var(--accent)]">GN2Studio</span>가 함께합니다.
            </h2>
            <div class="space-y-4 text-[oklch(78%_0.04_250)] leading-relaxed text-[0.95rem]">
              <p>
                안녕하세요. GN2Studio 대표이사입니다. 저희 홈페이지를 방문해 주신 모든 분들께 진심으로 감사의 말씀을 드립니다.
              </p>
              <p>
                GN2Studio는 <strong class="text-white">GPT 기반 AI 기술</strong>과 <strong class="text-white">Azure/AWS 클라우드 인프라</strong>를 결합하여 기업의 디지털 전환을 실현하는 IT 솔루션 전문 기업입니다.
              </p>
              <p>
                단순한 개발을 넘어 기획·디자인·개발·운영을 One-Stop으로 제공하며, 고객의 성공이 곧 우리의 성공이라는 신념으로 매일 한 걸음씩 나아가고 있습니다.
              </p>
              <p>
                앞으로도 변화와 혁신을 두려워하지 않고, 최고의 기술력으로 고객 여러분의 비즈니스 파트너가 되겠습니다.
              </p>
            </div>
            <div class="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                <i class="fa-solid fa-signature text-[var(--accent)]"></i>
              </div>
              <div>
                <p class="font-bold text-white">GN2Studio 대표이사</p>
                <p class="text-white/40 text-sm">CEO Message</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vision Cards -->
      <div class="mt-20">
        <h3 class="text-2xl font-bold text-white text-center mb-12">우리의 <span class="text-gradient">핵심 가치</span></h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="value in coreValues" :key="value.title" class="value-card">
            <div class="value-icon">{{ value.icon }}</div>
            <h4 class="text-lg font-bold text-white mb-2">{{ value.title }}</h4>
            <p class="text-[oklch(70%_0.04_250)] text-sm leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const coreValues = [
  { icon: '🚀', title: '기술 혁신', desc: 'AI와 클라우드 최신 기술을 선제적으로 도입하여 고객에게 미래지향적 솔루션을 제공합니다.' },
  { icon: '🤝', title: '신뢰와 파트너십', desc: '단순 납품이 아닌, 장기적 파트너로서 고객의 성장과 함께하는 관계를 추구합니다.' },
  { icon: '✨', title: '품질 우선', desc: '기획부터 운영까지 모든 단계에서 최고의 품질을 유지하는 One-Stop 서비스를 제공합니다.' },
]
</script>

<style scoped>
.page-hero {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(10, 10, 20, 0.9) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.hero-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, oklch(75% 0.15 200 / 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.breadcrumb { display: flex; align-items: center; gap: 8px; }
.bc-link { color: var(--accent); text-decoration: none; font-size: 0.85rem; }
.bc-sep { color: rgba(255,255,255,0.3); font-size: 0.85rem; }
.bc-current { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
.page-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.page-subtitle {
  color: oklch(70% 0.04 250);
  font-size: 1.05rem;
  margin-top: 0.75rem;
}
.text-gradient {
  background: linear-gradient(135deg, var(--accent) 0%, #fff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.ceo-photo-frame {
  aspect-ratio: 3/4;
  max-width: 320px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ceo-photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%);
}
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem;
}
.value-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
}
.value-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}
.value-icon { font-size: 2.5rem; margin-bottom: 1rem; }
</style>
