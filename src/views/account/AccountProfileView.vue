<template>
  <div class="profile-page">
    <div class="page-container py-12">
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <i class="fa-solid fa-user-tie text-4xl"></i>
          </div>
          <div>
            <h1 class="profile-name">{{ userName }}</h1>
            <p class="profile-email">{{ profileData.email ?? profileData.sub ?? '' }}</p>
          </div>
        </div>

        <div class="profile-body">
          <h2 class="section-title">계정 정보</h2>
          <dl class="profile-dl">
            <div class="dl-row">
              <dt>이름</dt>
              <dd>{{ profileData.name ?? '–' }}</dd>
            </div>
            <div class="dl-row">
              <dt>이메일</dt>
              <dd>{{ profileData.email ?? profileData.sub ?? '–' }}</dd>
            </div>
            <div class="dl-row">
              <dt>사용자 ID</dt>
              <dd><code class="code-tag">{{ profileData.sub ?? '–' }}</code></dd>
            </div>
            <div v-if="roles.length > 0" class="dl-row">
              <dt>권한</dt>
              <dd class="flex flex-wrap gap-2">
                <span v-for="role in roles" :key="role" class="badge badge-blue">{{ role }}</span>
              </dd>
            </div>
          </dl>

          <div class="mt-8 flex gap-3">
            <router-link to="/account/password" class="btn-primary">
              <i class="fa-solid fa-key mr-2"></i>비밀번호 변경
            </router-link>
            <router-link to="/" class="btn-ghost">← 홈으로</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const profileData = computed<Record<string, any>>(() => (authStore.profile as any) ?? {})

const userName = computed(() => {
  const p = authStore.profile
  if (!p) return '사용자'
  return p.name ?? (p as any).preferred_username ?? p.sub ?? '사용자'
})

const roles = computed(() => {
  const r = (authStore.profile as any)?.roles
  if (!r) return []
  return Array.isArray(r) ? r : [r]
})
</script>

<style scoped>
.profile-page { min-height: 80vh; }
.profile-card {
  max-width: 640px;
  margin: 0 auto;
  background: oklch(16% 0.04 250);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  overflow: hidden;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem 2.5rem 2rem;
  background: linear-gradient(135deg, oklch(20% 0.08 250), oklch(15% 0.04 250));
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.profile-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: oklch(55% 0.18 250);
  display: flex; align-items: center; justify-content: center;
  color: white; flex-shrink: 0;
}
.profile-name { font-size: 1.4rem; font-weight: 800; color: white; margin: 0 0 4px; }
.profile-email { color: rgba(255,255,255,0.45); font-size: 0.9rem; margin: 0; }

.profile-body { padding: 2.5rem; }
.section-title { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin: 0 0 1.25rem; }

.profile-dl { display: flex; flex-direction: column; gap: 0; }
.dl-row {
  display: grid; grid-template-columns: 120px 1fr;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  align-items: center;
}
.dl-row:last-child { border-bottom: none; }
dt { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.35); }
dd { color: rgba(255,255,255,0.8); font-size: 0.9rem; margin: 0; }
</style>
