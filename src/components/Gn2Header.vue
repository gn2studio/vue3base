<template>
  <nav class="gn2-nav">
    <div class="nav-container page-container flex items-center justify-between gap-4">

      <!-- Logo -->
      <router-link to="/" class="logo flex items-center text-xl font-extrabold no-underline tracking-tighter shrink-0">
        GN2<span>Studio</span>
      </router-link>

      <!-- Desktop Navigation -->
      <div v-if="isDesktop" class="desktop-nav">
        <!-- 회사소개 (드롭다운) -->
        <div class="nav-dropdown-wrap" @mouseenter="openMenu('company')" @mouseleave="closeMenu()">
          <router-link to="/company/greetings" class="nav-item" :class="{ active: isActive('/company') }">
            회사소개 <i class="fa-solid fa-chevron-down ml-1 text-xs opacity-60 transition-transform duration-200" :class="{ 'rotate-180': activeMenu === 'company' }"></i>
          </router-link>
          <transition name="dropdown">
            <div v-if="activeMenu === 'company'" class="dropdown-menu">
              <router-link to="/company/greetings" class="dropdown-item" @click="closeMenu()">인사말</router-link>
              <router-link to="/company/history" class="dropdown-item" @click="closeMenu()">연혁</router-link>
              <router-link to="/company/channels" class="dropdown-item" @click="closeMenu()">채널</router-link>
            </div>
          </transition>
        </div>

        <!-- 주요서비스 -->
        <router-link to="/services" class="nav-item">주요서비스</router-link>

        <!-- 포트폴리오 -->
        <router-link to="/portfolio" class="nav-item">포트폴리오</router-link>

        <!-- 고객센터 (드롭다운) -->
        <div class="nav-dropdown-wrap" @mouseenter="openMenu('customer')" @mouseleave="closeMenu()">
          <router-link to="/customer/notice" class="nav-item" :class="{ active: isActive('/customer') }">
            고객센터 <i class="fa-solid fa-chevron-down ml-1 text-xs opacity-60 transition-transform duration-200" :class="{ 'rotate-180': activeMenu === 'customer' }"></i>
          </router-link>
          <transition name="dropdown">
            <div v-if="activeMenu === 'customer'" class="dropdown-menu">
              <router-link to="/customer/notice" class="dropdown-item" @click="closeMenu()">공지사항</router-link>
              <router-link to="/customer/faq" class="dropdown-item" @click="closeMenu()">FAQ</router-link>
              <router-link to="/customer/inquiry" class="dropdown-item" @click="closeMenu()">문의사항</router-link>
              <router-link to="/customer/partnership" class="dropdown-item" @click="closeMenu()">사업제휴</router-link>
            </div>
          </transition>
        </div>
      </div>

      <!-- Auth Area (Desktop) -->
      <div v-if="isDesktop" class="auth-area-desktop">
        <!-- 로그인 상태: 닉네임 + 드롭다운 -->
        <div v-if="authStore.isAuthenticated" class="user-dropdown-wrap" @click.stop>
          <button class="user-dropdown-btn" @click="toggleUserMenu">
            <div class="user-avatar">
              <i class="fa-solid fa-user text-xs"></i>
            </div>
            <span class="user-name-text">{{ userName }}</span>
            <i class="fa-solid fa-chevron-down text-xs transition-transform duration-200" :class="{ 'rotate-180': userMenuOpen }"></i>
          </button>
          <transition name="dropdown">
            <div v-if="userMenuOpen" class="user-dropdown-menu">
              <router-link to="/account/profile" class="dropdown-item" @click="closeUserMenu">
                <i class="fa-solid fa-id-card mr-2 opacity-60"></i>정보확인
              </router-link>
              <router-link to="/account/password" class="dropdown-item" @click="closeUserMenu">
                <i class="fa-solid fa-key mr-2 opacity-60"></i>비밀번호 변경
              </router-link>
              <hr class="dropdown-divider" />
              <button class="dropdown-item dropdown-item-danger w-full text-left" @click="handleLogout">
                <i class="fa-solid fa-right-from-bracket mr-2 opacity-60"></i>로그아웃
              </button>
            </div>
          </transition>
        </div>
        <!-- 비로그인 상태: 로그인 버튼 -->
        <button v-else @click="openLoginModal" class="auth-btn login-btn">
          <i class="fa-solid fa-lock text-xs"></i> 로그인
        </button>
      </div>

      <!-- Mobile Hamburger -->
      <button v-if="!isDesktop" class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="메뉴 열기">
        <span :class="['bar', { open: mobileOpen }]"></span>
        <span :class="['bar', { open: mobileOpen }]"></span>
        <span :class="['bar', { open: mobileOpen }]"></span>
      </button>
    </div>

    <!-- Mobile Menu Drawer -->
    <transition name="slide-down">
      <div v-if="mobileOpen" class="mobile-drawer md:hidden">
        <div class="mobile-group">
          <p class="mobile-group-label">회사소개</p>
          <router-link to="/company/greetings" class="mobile-item" @click="mobileOpen = false">인사말</router-link>
          <router-link to="/company/history" class="mobile-item" @click="mobileOpen = false">연혁</router-link>
          <router-link to="/company/channels" class="mobile-item" @click="mobileOpen = false">채널</router-link>
        </div>
        <div class="mobile-group">
          <router-link to="/services" class="mobile-item font-semibold" @click="mobileOpen = false">주요서비스</router-link>
          <router-link to="/portfolio" class="mobile-item font-semibold" @click="mobileOpen = false">포트폴리오</router-link>
        </div>
        <div class="mobile-group">
          <p class="mobile-group-label">고객센터</p>
          <router-link to="/customer/notice" class="mobile-item" @click="mobileOpen = false">공지사항</router-link>
          <router-link to="/customer/faq" class="mobile-item" @click="mobileOpen = false">FAQ</router-link>
          <router-link to="/customer/inquiry" class="mobile-item" @click="mobileOpen = false">문의사항</router-link>
          <router-link to="/customer/partnership" class="mobile-item" @click="mobileOpen = false">사업제휴</router-link>
        </div>
        <div class="mobile-group border-t border-white/10 pt-4">
          <template v-if="authStore.isAuthenticated">
            <div class="mobile-auth-user">
              <div class="user-avatar user-avatar-sm"><i class="fa-solid fa-user text-xs"></i></div>
              <span class="text-white/70 text-sm">{{ userName }}</span>
            </div>
            <router-link to="/account/profile" class="mobile-item" @click="mobileOpen = false">
              <i class="fa-solid fa-id-card mr-2 opacity-50"></i>정보확인
            </router-link>
            <router-link to="/account/password" class="mobile-item" @click="mobileOpen = false">
              <i class="fa-solid fa-key mr-2 opacity-50"></i>비밀번호 변경
            </router-link>
            <button @click="handleLogout(); mobileOpen = false" class="mobile-item text-left text-red-400/80 w-full">
              <i class="fa-solid fa-right-from-bracket mr-2 opacity-80"></i>로그아웃
            </button>
          </template>
          <button v-else @click="openLoginModal(); mobileOpen = false" class="auth-btn login-btn w-full justify-center">
            <i class="fa-solid fa-lock text-xs"></i> 로그인
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDialog } from '@/composables/useDialog'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const dialog = useDialog()

// ── Responsive State ──────────────────────────────
const isDesktop = ref(window.innerWidth >= 768)
const handleResize = () => { isDesktop.value = window.innerWidth >= 768 }
onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleOutsideClick)
})

// ── Dropdown State ────────────────────────────────
const activeMenu = ref<string | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const openMenu = (name: string) => {
  if (closeTimer) clearTimeout(closeTimer)
  activeMenu.value = name
}
const closeMenu = () => {
  closeTimer = setTimeout(() => { activeMenu.value = null }, 150)
}

// ── Mobile Menu ───────────────────────────────────
const mobileOpen = ref(false)
const toggleMobileMenu = () => { mobileOpen.value = !mobileOpen.value }

// ── User Dropdown ───────────────────
const userMenuOpen = ref(false)
const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value }
const closeUserMenu = () => { userMenuOpen.value = false }

const handleOutsideClick = () => { userMenuOpen.value = false }

// ── Auth ──────────────────────────────────────────
const emit = defineEmits<{ (e: 'open-login'): void }>()
const openLoginModal = () => emit('open-login')
const handleLogout = async () => {
  closeUserMenu()
  const confirmed = await dialog.confirm(
    '로그아웃',
    '정말 로그아웃하시겠습니까?',
    { variant: 'danger', confirmLabel: '로그아웃', cancelLabel: '취소' }
  )
  if (!confirmed) return
  mobileOpen.value = false
  await authStore.logout()
  await router.push('/')
}

const userName = computed(() => {
  const profile = authStore.profile
  if (!profile) return '사용자'
  return profile.name ?? (profile as any).preferred_username ?? profile.sub ?? '사용자'
})

// ── Route Active Helper ───────────────────────────
const isActive = (prefix: string) => route.path.startsWith(prefix)
</script>

<style scoped>
.gn2-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(14, 14, 20, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  width: 100%;
}

.nav-container {
  height: 64px;
}

/* Responsive: desktop navigation */
.desktop-nav {
  display: none;
  align-items: center;
  gap: 2rem;
}
.auth-area-desktop {
  display: none;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}
.mobile-menu-btn {
  display: flex;
}

@media (min-width: 768px) {
  .desktop-nav { display: flex; }
  .auth-area-desktop { display: flex; }
  .mobile-menu-btn { display: none; }
}


/* Logo */
.logo { color: oklch(95% 0.01 250); }
.logo span { color: var(--accent); }

/* Nav Item */
.nav-item {
  color: oklch(80% 0.04 250);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  padding: 0.4rem 0;
  transition: color 0.25s ease;
  white-space: nowrap;
}
.nav-item:hover,
.nav-item.router-link-active,
.nav-item.active {
  color: #fff;
}
.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
  border-radius: 2px;
}
.nav-item:hover::after,
.nav-item.router-link-active::after,
.nav-item.active::after { width: 100%; }

/* Dropdown */
.nav-dropdown-wrap {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 18, 28, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  min-width: 148px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  z-index: 200;
}
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: rgba(18, 18, 28, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateX(-50%) rotate(45deg);
}
.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: oklch(75% 0.04 250);
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.dropdown-item:hover,
.dropdown-item.router-link-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

/* Dropdown Transition */
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
.dropdown-leave-to { opacity: 0; transform: translateX(-50%) translateY(-8px); }

/* Auth Buttons */
.auth-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
}
.login-btn {
  background: oklch(55% 0.18 250);
  color: #fff;
}
.login-btn:hover {
  background: oklch(62% 0.2 250);
  box-shadow: 0 0 20px oklch(55% 0.18 250 / 0.5);
}
.logout-btn {
  background: rgba(255, 255, 255, 0.08);
  color: oklch(80% 0.05 250);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.logout-btn:hover {
  background: rgba(255, 60, 60, 0.15);
  border-color: rgba(255, 60, 60, 0.4);
  color: #fff;
}
.user-info { color: oklch(80% 0.1 200); }

/* User Dropdown */
.user-dropdown-wrap { position: relative; }
.user-dropdown-btn {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 6px 12px 6px 6px;
  cursor: pointer; color: white;
  transition: all 0.2s ease;
}
.user-dropdown-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}
.user-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: oklch(55% 0.18 250);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.7rem;
  flex-shrink: 0;
}
.user-avatar-sm { width: 22px; height: 22px; }
.user-name-text { font-size: 0.85rem; font-weight: 600; }

.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(18, 18, 28, 0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 8px;
  min-width: 180px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  z-index: 200;
}
.dropdown-divider {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 6px 0;
}
.dropdown-item-danger { color: rgba(248,113,113,0.8) !important; }
.dropdown-item-danger:hover { background: rgba(239,68,68,0.12) !important; color: rgb(248,113,113) !important; }

/* Mobile Auth User */
.mobile-auth-user {
  display: flex; align-items: center; gap: 10px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 4px;
}

/* Mobile Hamburger */
.mobile-menu-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  width: 36px;
}
.bar {
  display: block;
  height: 2px;
  width: 24px;
  background: oklch(80% 0.05 250);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Mobile Drawer */
.mobile-drawer {
  background: rgba(14, 14, 22, 0.97);
  backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 1rem 1.5rem 1.5rem;
}
.mobile-group {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mobile-group-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: oklch(60% 0.04 250);
  padding: 0.25rem 0.5rem;
  margin-bottom: 2px;
}
.mobile-item {
  display: block;
  padding: 0.6rem 0.75rem;
  color: oklch(80% 0.05 250);
  text-decoration: none;
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.mobile-item:hover,
.mobile-item.router-link-active {
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
}

/* Mobile Drawer Transition */
.slide-down-enter-active,
.slide-down-leave-active { transition: max-height 0.3s ease, opacity 0.3s ease; overflow: hidden; }
.slide-down-enter-from,
.slide-down-leave-to { max-height: 0; opacity: 0; }
.slide-down-enter-to,
.slide-down-leave-from { max-height: 500px; opacity: 1; }
</style>
