// src/auth/authConfig.ts

import { WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts'

export const TOKEN_KEYS = {
    ACCESS: 'auth.access_token',
    REFRESH: 'auth.refresh_token',
    EXPIRES: 'auth.expires_at',
} as const

export const tokenStore = {
    save(accessToken: string, refreshToken?: string, expiresIn?: number) {
        localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken)
        if (refreshToken) localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken)
        if (expiresIn) {
            localStorage.setItem(TOKEN_KEYS.EXPIRES, String(Math.floor(Date.now() / 1000) + expiresIn))
        }
    },
    clear() {
        Object.values(TOKEN_KEYS).forEach((k) => localStorage.removeItem(k))
    },
    getAccess: () => localStorage.getItem(TOKEN_KEYS.ACCESS),
    getRefresh: () => localStorage.getItem(TOKEN_KEYS.REFRESH),
    isExpiring(): boolean {
        const exp = localStorage.getItem(TOKEN_KEYS.EXPIRES)
        return exp ? Number(exp) - Math.floor(Date.now() / 1000) < 60 : false
    },
}

const env = import.meta.env

export function createUserManagerSettings(): UserManagerSettings {
    const localStore = new WebStorageStateStore({ store: window.localStorage })
    return {
        userStore: localStore,
        stateStore: localStore,
        authority: env.VITE_APP_IDENTITY_BASE_URL as string,
        client_id: env.VITE_APP_IDENTITY_CLIENTID as string,
        client_secret: env.VITE_APP_IDENTITY_CLIENTSECRET as string,
        redirect_uri: env.VITE_APP_IDENTITY_REDIRECT_URI as string,
        post_logout_redirect_uri: `${env.VITE_APP_SERVICE_URL as string}/signout-oidc`,
        response_type: 'code',
        scope: env.VITE_APP_IDENTITY_SCOPE as string,
        filterProtocolClaims: true,
        loadUserInfo: true,
        automaticSilentRenew: false,
        monitorSession: false,
    }
}
