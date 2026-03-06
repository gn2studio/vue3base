<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <router-link to="/admin" class="sidebar-logo">
          <i class="fa-solid fa-shield-halved text-accent text-xl"></i>
          <span v-if="!sidebarCollapsed" class="ml-2 font-extrabold tracking-tight">Admin</span>
        </router-link>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <i class="fa-solid" :class="sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-group">
          <p v-if="!sidebarCollapsed" class="nav-group-label">사이트 관리</p>
          <router-link to="/admin/sites" class="nav-item" active-class="active">
            <i class="fa-solid fa-globe nav-icon"></i>
            <span v-if="!sidebarCollapsed">사이트 목록</span>
          </router-link>
        </div>
        <div class="nav-group">
          <p v-if="!sidebarCollapsed" class="nav-group-label">시스템</p>
          <router-link to="/" class="nav-item">
            <i class="fa-solid fa-house nav-icon"></i>
            <span v-if="!sidebarCollapsed">메인 사이트</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- Main Area -->
    <div class="admin-main">
      <!-- Top Bar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">{{ pageTitle }}</h1>
        </div>
        <div class="topbar-right">
          <div class="admin-profile">
            <div class="avatar">
              <i class="fa-solid fa-user-tie text-sm"></i>
            </div>
            <span v-if="authStore.profile" class="profile-name">
              {{ authStore.profile.name ?? authStore.profile.preferred_username ?? 'Admin' }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>

    <!-- Toast Container -->
    <AdminToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AdminToast from '@/components/admin/AdminToast.vue'

const authStore = useAuthStore()
const sidebarCollapsed = ref(false)
const route = useRoute()

const pageTitleMap: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/sites': '사이트 관리',
}
const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(pageTitleMap)) {
    if (route.path.startsWith(path) && route.path === path) return title
  }
  if (route.path.includes('/board/')) return '게시판 관리'
  if (route.path.includes('/sites/')) return '사이트 상세'
  return 'Admin'
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: oklch(12% 0.04 250);
}

/* Sidebar */
.admin-sidebar {
  width: 220px;
  min-height: 100vh;
  background: oklch(14% 0.05 250);
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.admin-sidebar.collapsed { width: 64px; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  min-height: 64px;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
}
.collapse-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  transition: color 0.2s;
}
.collapse-btn:hover { color: white; }

.sidebar-nav { flex: 1; padding: 1rem 0.5rem; overflow-y: auto; }
.nav-group { margin-bottom: 1.5rem; }
.nav-group-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.25);
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
}
.nav-item:hover { background: rgba(255,255,255,0.07); color: white; }
.nav-item.active { background: oklch(55% 0.18 250 / 0.15); color: oklch(75% 0.15 200); }
.nav-icon { width: 18px; text-align: center; flex-shrink: 0; }

/* Main */
.admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

/* Topbar */
.admin-topbar {
  height: 64px;
  background: oklch(14% 0.05 250);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 20;
}
.topbar-title { font-size: 1rem; font-weight: 700; color: white; }
.topbar-right { display: flex; align-items: center; gap: 1rem; }
.admin-profile { display: flex; align-items: center; gap: 0.6rem; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: oklch(55% 0.18 250);
  display: flex; align-items: center; justify-content: center;
  color: white;
}
.profile-name { font-size: 0.85rem; color: rgba(255,255,255,0.7); }

/* Content */
.admin-content { flex: 1; padding: 1.5rem; overflow-y: auto; }
</style>
