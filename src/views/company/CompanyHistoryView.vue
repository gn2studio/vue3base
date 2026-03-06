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
          <span class="bc-current">연혁</span>
        </div>
        <h1 class="page-title mt-4">회사 <span class="text-gradient">연혁</span></h1>
        <p class="page-subtitle">GN2Studio의 성장 발자취를 소개합니다</p>
      </div>
    </div>

    <!-- Timeline Content -->
    <div class="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <div class="timeline">
        <div v-for="(group, gi) in history" :key="gi" class="timeline-group">
          <div class="year-badge">{{ group.year }}</div>
          <div class="events-list">
            <div v-for="(event, ei) in group.events" :key="ei" class="event-item">
              <div class="event-dot" :style="{ background: event.accent ? 'var(--accent)' : 'rgba(255,255,255,0.3)' }"></div>
              <div class="event-content" :class="{ 'accent-event': event.accent }">
                <span class="event-month">{{ event.month }}</span>
                <p class="event-text">{{ event.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface HistoryEvent {
  month: string
  text: string
  accent?: boolean
}
interface HistoryGroup {
  year: number
  events: HistoryEvent[]
}

const history: HistoryGroup[] = [
  {
    year: 2026,
    events: [
      { month: '03월', text: 'GN2Studio 홈페이지 Vue3 기반 오픈', accent: true },
      { month: '01월', text: '와글커뮤니티 Beta 서비스 오픈' },
    ]
  },
  {
    year: 2025,
    events: [
      { month: '12월', text: '삼성반도체 권한관리 솔루션 유지보수 계약 체결', accent: true },
      { month: '09월', text: '헬스케어 솔루션 MVP 개발 완료' },
      { month: '06월', text: '메리톡톡 서비스 정식 런칭', accent: true },
      { month: '03월', text: 'AWS 파트너 인증 획득' },
    ]
  },
  {
    year: 2024,
    events: [
      { month: '11월', text: 'SGC에너지 열병합발전소 모니터링 솔루션 개발 완료', accent: true },
      { month: '08월', text: '인천대학교 국가과제 참여 (삼성전자 테스터기 원격제어)' },
      { month: '04월', text: '기업부설연구소 설립' },
      { month: '01월', text: 'Azure 클라우드 서비스 파트너십 체결' },
    ]
  },
  {
    year: 2023,
    events: [
      { month: '10월', text: '스마트팩토리 보급사업 컨설팅 수행 (중소벤처기업부)', accent: true },
      { month: '06월', text: '미래선도과제 (소상공인네트워크) 참여' },
      { month: '03월', text: 'GN2Studio 법인 설립', accent: true },
    ]
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
  top: -80px; left: -80px;
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

/* Timeline */
.timeline { position: relative; padding-left: 0; }
.timeline-group { margin-bottom: 3rem; }
.year-badge {
  display: inline-block;
  background: rgba(120, 200, 250, 0.1);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 1.5rem;
  font-weight: 800;
  padding: 0.4rem 1.2rem;
  border-radius: 30px;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 20px oklch(75% 0.15 200 / 0.2);
}
.events-list {
  border-left: 2px solid rgba(255, 255, 255, 0.08);
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}
.event-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
}
.event-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  margin-left: -1.9rem;
  box-shadow: 0 0 8px currentColor;
}
.event-content {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  flex: 1;
  transition: all 0.25s ease;
}
.event-content:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}
.event-content.accent-event {
  background: rgba(120, 200, 250, 0.05);
  border-color: rgba(120, 200, 250, 0.2);
}
.event-month {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: oklch(65% 0.08 200);
  margin-bottom: 4px;
}
.event-text {
  color: oklch(85% 0.03 250);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}
.accent-event .event-text { color: oklch(90% 0.04 250); font-weight: 500; }
</style>
