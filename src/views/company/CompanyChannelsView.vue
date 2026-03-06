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
          <span class="bc-current">채널</span>
        </div>
        <h1 class="page-title mt-4">운영 <span class="text-gradient">채널</span></h1>
        <p class="page-subtitle">GN2Studio가 운영하는 서비스와 플랫폼을 소개합니다</p>
      </div>
    </div>

    <!-- Channels Grid -->
    <div class="page-container py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <a v-for="channel in channels" :key="channel.name"
           :href="channel.url" target="_blank"
           class="channel-card group">
          <div class="channel-icon-wrap">
            <span class="channel-icon">{{ channel.icon }}</span>
          </div>
          <div class="channel-info">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-xl font-bold text-white">{{ channel.name }}</h3>
              <span class="channel-status" :class="channel.status === '운영중' ? 'active' : 'soon'">
                {{ channel.status }}
              </span>
            </div>
            <p class="text-[oklch(72%_0.04_250)] text-sm leading-relaxed mb-4">{{ channel.desc }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in channel.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="channel-arrow">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Channel {
  name: string
  icon: string
  desc: string
  url: string
  status: '운영중' | '준비중'
  tags: string[]
}

const channels: Channel[] = [
  {
    name: '메리톡톡',
    icon: '📖',
    desc: '작가와 독자가 함께하는 웹소설 연재 & 커뮤니티 플랫폼. 다양한 장르의 콘텐츠를 즐기고 직접 창작할 수 있습니다.',
    url: 'https://www.merrytoktok.com',
    status: '운영중',
    tags: ['커뮤니티', '웹소설', '콘텐츠']
  },
  {
    name: '와글커뮤니티',
    icon: '💬',
    desc: '템플릿 기반 커뮤니티 솔루션. 손쉽게 자신만의 커뮤니티를 만들고 운영할 수 있는 SaaS 플랫폼입니다.',
    url: 'https://waggle.gn2studio.com',
    status: '운영중',
    tags: ['SaaS', '커뮤니티', '솔루션']
  },
  {
    name: 'GN2Studio Blog',
    icon: '✍️',
    desc: '기술 블로그 및 개발 인사이트를 공유하는 플랫폼. AI, 클라우드, 개발 트렌드를 다룹니다.',
    url: 'https://www.gn2studio.com',
    status: '준비중',
    tags: ['블로그', '기술', '인사이트']
  },
]
</script>

<style scoped>
.page-hero {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.8) 0%, rgba(10, 10, 20, 0.9) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.hero-glow {
  position: absolute;
  bottom: -80px; right: -80px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, oklch(75% 0.15 200 / 0.12) 0%, transparent 70%);
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
}
.page-subtitle { color: oklch(70% 0.04 250); font-size: 1.05rem; margin-top: 0.75rem; }
.text-gradient {
  background: linear-gradient(135deg, var(--accent) 0%, #fff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.channel-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.channel-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(120, 200, 250, 0.3);
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 20px oklch(75% 0.15 200 / 0.1);
}
.channel-icon-wrap {
  width: 64px; height: 64px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  transition: transform 0.3s ease;
}
.channel-card:hover .channel-icon-wrap { transform: scale(1.1); }
.channel-info { flex: 1; }
.channel-status {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.channel-status.active {
  background: rgba(100, 220, 120, 0.15);
  color: rgb(100, 220, 120);
  border: 1px solid rgba(100, 220, 120, 0.3);
}
.channel-status.soon {
  background: rgba(200, 170, 80, 0.15);
  color: rgb(200, 170, 80);
  border: 1px solid rgba(200, 170, 80, 0.3);
}
.tag {
  font-size: 0.72rem;
  color: var(--accent);
  background: rgba(120, 200, 250, 0.08);
  border: 1px solid rgba(120, 200, 250, 0.2);
  padding: 2px 10px;
  border-radius: 20px;
}
.channel-arrow {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  color: rgba(255,255,255,0.2);
  font-size: 0.85rem;
  transition: all 0.3s ease;
}
.channel-card:hover .channel-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}
</style>
