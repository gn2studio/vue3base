import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'
import { isTokenExpiringSoon } from '@/utils/auth'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: 15000,
})

// ── 토큰 갱신 동시성 제어 ─────────────────────────────────────────
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

function processQueue(token: string): void {
    pendingRequests.forEach((cb) => cb(token))
    pendingRequests = []
}

function rejectQueue(err: unknown): void {
    pendingRequests.forEach((cb) => cb(''))
    pendingRequests = []
}

// ── 요청 인터셉터: Authorization 헤더 + 만료 직전 선제 갱신 ────────
apiClient.interceptors.request.use(
    async (config) => {
        const authStore = useAuthStore()
        let token = authStore.accessToken

        // 토큰이 5분 내 만료 예정이면 API 요청 전에 먼저 갱신
        if (token && isTokenExpiringSoon(token)) {
            if (!isRefreshing) {
                isRefreshing = true
                try {
                    const ok = await authStore.silentRenew()
                    const newToken = authStore.accessToken
                    if (ok && newToken) {
                        processQueue(newToken)
                        token = newToken
                    } else {
                        rejectQueue(new Error('Token refresh failed'))
                    }
                } finally {
                    isRefreshing = false
                }
            } else {
                // 갱신이 이미 진행 중이면 완료 때까지 대기
                await new Promise<void>((resolve) => {
                    pendingRequests.push(() => resolve())
                })
                token = authStore.accessToken
            }
        }

        if (token) config.headers['Authorization'] = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error),
)

// ── 응답 인터셉터: 401 → silent renew → 재시도 + 큐 처리 ──────────
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // 갱신 진행 중: 큐에 넣고 완료 후 재시도
                return new Promise((resolve, reject) => {
                    pendingRequests.push((token: string) => {
                        if (!token) return reject(error)
                        originalRequest.headers['Authorization'] = `Bearer ${token}`
                        resolve(apiClient(originalRequest))
                    })
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            const authStore = useAuthStore()
            try {
                const success = await authStore.silentRenew()

                if (success && authStore.accessToken) {
                    const newToken = authStore.accessToken
                    processQueue(newToken)
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                    return apiClient(originalRequest)
                } else {
                    // refresh_token 도 만료 → 세션 초기화 후 로그인
                    rejectQueue(error)
                    await authStore.logout()
                    return Promise.reject(error)
                }
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    },
)

export default apiClient
