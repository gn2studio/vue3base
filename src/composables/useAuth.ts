import { useAuthStore } from '@/stores/useAuthStore'

export function useAuth() {
    const authStore = useAuthStore()
    return {
        isAuthenticated: authStore.isAuthenticated ? true : false,
        user: authStore.user,
        profile: authStore.profile,
        accessToken: authStore.accessToken,
        expiresAt: authStore.expiresAt,
        isLoading: authStore.isLoading,
        login: authStore.login,
        logout: authStore.logout,
        silentRenew: authStore.silentRenew,
    }
}
