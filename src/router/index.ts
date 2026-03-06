import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { isTokenExpiringSoon } from '@/utils/auth'

// ── Auth ──────────────────────────────────────────
const LogoutCallbackView = () => import('@/views/auth/LogoutCallbackView.vue')

// ── Home ──────────────────────────────────────────
const HomeView = () => import('@/views/HomeView.vue')

// ── Company ───────────────────────────────────────
const CompanyGreetingsView = () => import('@/views/company/CompanyGreetingsView.vue')
const CompanyHistoryView = () => import('@/views/company/CompanyHistoryView.vue')
const CompanyChannelsView = () => import('@/views/company/CompanyChannelsView.vue')

// ── Services ──────────────────────────────────────
const ServiceListView = () => import('@/views/services/ServiceListView.vue')
const ServiceDetailView = () => import('@/views/services/ServiceDetailView.vue')

// ── Portfolio ─────────────────────────────────────
const PortfolioListView = () => import('@/views/portfolio/PortfolioListView.vue')
const PortfolioDetailView = () => import('@/views/portfolio/PortfolioDetailView.vue')

// ── Customer ──────────────────────────────────────
const NoticeView = () => import('@/views/customer/NoticeView.vue')
const FaqView = () => import('@/views/customer/FaqView.vue')
const InquiryView = () => import('@/views/customer/InquiryView.vue')
const PartnershipView = () => import('@/views/customer/PartnershipView.vue')

// ── Placeholder (fallback) ────────────────────────
const PlaceholderView = () => import('@/views/PlaceholderView.vue')

// ── Admin ─────────────────────────────────────────
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const SiteListView = () => import('@/views/admin/SiteListView.vue')
const SiteDetailView = () => import('@/views/admin/SiteDetailView.vue')
const BoardDetailView = () => import('@/views/admin/BoardDetailView.vue')

// ── Account ───────────────────────────────────────
const AccountProfileView = () => import('@/views/account/AccountProfileView.vue')
const AccountPasswordView = () => import('@/views/account/AccountPasswordView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // ── 홈 ──────────────────────────────────────
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // ── 회사소개 ─────────────────────────────────
    {
      path: '/company',
      redirect: '/company/greetings',
    },
    {
      path: '/company/greetings',
      name: 'company-greetings',
      component: CompanyGreetingsView,
    },
    {
      path: '/company/history',
      name: 'company-history',
      component: CompanyHistoryView,
    },
    {
      path: '/company/channels',
      name: 'company-channels',
      component: CompanyChannelsView,
    },

    // ── 주요서비스 ───────────────────────────────
    {
      path: '/services',
      name: 'services',
      component: ServiceListView,
    },
    {
      path: '/services/:id',
      name: 'service-detail',
      component: ServiceDetailView,
    },

    // ── 포트폴리오 ───────────────────────────────
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioListView,
    },
    {
      path: '/portfolio/:id',
      name: 'portfolio-detail',
      component: PortfolioDetailView,
    },

    // ── 고객센터 ─────────────────────────────────
    {
      path: '/customer',
      redirect: '/customer/notice',
    },
    {
      path: '/customer/notice',
      name: 'customer-notice',
      component: NoticeView,
    },
    {
      path: '/customer/faq',
      name: 'customer-faq',
      component: FaqView,
    },
    {
      path: '/customer/inquiry',
      name: 'customer-inquiry',
      component: InquiryView,
    },
    {
      path: '/customer/partnership',
      name: 'customer-partnership',
      component: PartnershipView,
    },

    // ── Account ───────────────────────────────────
    {
      path: '/account/profile',
      name: 'account-profile',
      component: AccountProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/account/password',
      name: 'account-password',
      component: AccountPasswordView,
      meta: { requiresAuth: true },
    },

    // ── Auth ─────────────────────────────────────
    {
      path: '/signout-oidc',
      name: 'logoutCallback',
      component: LogoutCallbackView,
      meta: { isAuthRoute: true },
    },

    // ── Admin ─────────────────────────────────────
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/sites' },
        {
          path: 'sites',
          name: 'admin-sites',
          component: SiteListView,
        },
        {
          path: 'sites/:slug',
          name: 'admin-site-detail',
          component: SiteDetailView,
        },
        {
          path: 'sites/:slug/board/:masterCode',
          name: 'admin-board-detail',
          component: BoardDetailView,
        },
      ],
    },

    // ── 404 Fallback ─────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: PlaceholderView,
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  if (to.meta.isAuthRoute) return next()

  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) await authStore.initialize()

  // 기줄 토큰이 존재하지만 5분 이내 만료 예정이면 페이지 이동 전 선제적으로 갱신
  if (authStore.isAuthenticated && isTokenExpiringSoon(authStore.accessToken)) {
    const renewed = await authStore.silentRenew()
    // silentRenew 실패 시 logout() 내부에서 세션을 이미 클리어하므로 달리 처리할 필요 없음
    void renewed
  }

  // Account 페이지: 로그인 필요
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      const { useDialog } = await import('@/composables/useDialog')
      await useDialog().alert('로그인 필요', '로그인이 필요한 페이지입니다.', { variant: 'warning' })
      return next('/')
    }
  }

  // Admin 권한 체크 (엄격한 Role 검증)
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      const { useDialog } = await import('@/composables/useDialog')
      await useDialog().alert('로그인 필요', '관리자 페이지는 로그인이 필요합니다.', { variant: 'warning' })
      return next('/')
    }

    // useAuthStore.isAdmin: profile(userinfo) 우선 → fallback JWT 파싱
    if (!authStore.isAdmin) {
      const { useDialog } = await import('@/composables/useDialog')
      await useDialog().alert(
        '접근 권한 없음',
        '접근 권한이 없습니다.\n관리자 계정으로 로그인해주세요.',
        { variant: 'danger', confirmLabel: '확인' }
      )
      return next('/')
    }
  }

  next()
})

export default router
