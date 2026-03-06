// src/stores/useAuthStore.ts

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserProfile } from 'oidc-client-ts'
import { authService, type LoginResult } from '@/auth/authService'
import { tokenStore } from '@/auth/authConfig'
import { extractRolesFromToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
    const profile = ref<UserProfile | null>(null)
    const isLoading = ref(false)

    // ★ 핵심 수정: localStorage는 Vue의 반응성 시스템이 추적하지 못하므로
    //   ref로 별도 관리하여 로그인/로그아웃 시 즉시 UI에 반영되게 함
    const _isAuthenticated = ref<boolean>(!!tokenStore.getAccess())
    const _accessToken = ref<string | null>(tokenStore.getAccess())

    const isAuthenticated = computed(() => _isAuthenticated.value)
    const accessToken = computed(() => _accessToken.value)

    // role 클레임 목록: profile (userinfo) 우선 → fallback JWT 파싱
    const roles = computed<string[]>(() => {
        const p = profile.value as Record<string, unknown> | null
        const MS_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        const raw = p?.role ?? p?.roles ?? p?.[MS_CLAIM] ?? null
        if (raw !== null && raw !== undefined) {
            if (Array.isArray(raw)) return (raw as unknown[]).map(String)
            return [String(raw)]
        }
        // fallback: JWT access token 직접 파싱
        return extractRolesFromToken(_accessToken.value)
    })

    /** 현재 사용자가 Admin 역할을 보유하는지 여부 (전역 Getter) */
    const isAdmin = computed(() => roles.value.includes('Admin'))

    function _syncTokenState() {
        _isAuthenticated.value = !!tokenStore.getAccess()
        _accessToken.value = tokenStore.getAccess()
    }

    async function initialize(): Promise<void> {
        isLoading.value = true
        try { await authService.initialize() }
        finally { isLoading.value = false }
        profile.value = authService.user
        _syncTokenState()
    }

    async function loginWithPassword(email: string, password: string): Promise<LoginResult> {
        isLoading.value = true
        try {
            const result = await authService.apiLogin(email, password)
            if (result.success) {
                profile.value = authService.user
                _syncTokenState()
            }
            return result
        } finally {
            isLoading.value = false
        }
    }

    async function login(): Promise<void> {
        // Fallback for views that use login()
    }

    async function completeLogin(): Promise<{ redirectPath: string }> {
        return { redirectPath: '/' }
    }

    async function completeLogout(): Promise<void> {
        await logout()
    }

    async function silentRenew(): Promise<boolean> {
        const ok = await authService.refreshSilent()
        _syncTokenState()
        return ok
    }

    async function logout(): Promise<void> {
        tokenStore.clear()
        profile.value = null
        _isAuthenticated.value = false
        _accessToken.value = null
        // authService.logout()은 window.location.href = '/' 포함하므로 라우터 이동 후 호출
        await authService.logoutClear()
    }

    // authService에서 profile 변경 이벤트 수신
    authService.onUserChanged((p) => {
        profile.value = p
        _syncTokenState()
    })

    return {
        profile,
        user: profile,
        isLoading,
        isAuthenticated,
        accessToken,
        roles,
        isAdmin,
        expiresAt: computed(() => null),
        initialize,
        loginWithPassword,
        login,
        logout,
        silentRenew,
        completeLogin,
        completeLogout
    }
})
