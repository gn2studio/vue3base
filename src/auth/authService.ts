// src/auth/authService.ts

import { UserManager, type UserProfile } from 'oidc-client-ts'
import axios from 'axios'
import { createUserManagerSettings, tokenStore } from './authConfig'

const env = import.meta.env
const IDS = env.VITE_APP_IDENTITY_BASE_URL as string

export interface LoginResult {
    success: boolean
    error?: string
}

interface TokenResponse {
    access_token: string
    refresh_token?: string
    expires_in?: number
    token_type?: string
    scope?: string
    id_token?: string
}

type UserChangedCallback = (profile: UserProfile | null) => void

export class AuthService {
    static #instance: AuthService | null = null

    readonly #userManager: UserManager
    #profile: UserProfile | null = null
    #listeners: UserChangedCallback[] = []

    private constructor() {
        this.#userManager = new UserManager(createUserManagerSettings())
    }

    static getInstance(): AuthService {
        AuthService.#instance ??= new AuthService()
        return AuthService.#instance
    }

    get isAuthenticated(): boolean { return !!tokenStore.getAccess() }
    get accessToken(): string | null { return tokenStore.getAccess() }
    get user(): UserProfile | null { return this.#profile }

    async initialize(): Promise<void> {
        const token = tokenStore.getAccess()
        if (token && !tokenStore.isExpiring()) {
            this.#profile = await this.#fetchUserInfo(token)
            this.#emit()
            return
        }
        const rt = tokenStore.getRefresh()
        if (rt) await this.refreshSilent()
    }

    async apiLogin(email: string, password: string): Promise<LoginResult> {
        try {
            const res = await axios.post<TokenResponse>(
                `${IDS}/connect/token`,
                new URLSearchParams({
                    grant_type: 'password',
                    client_id: env.VITE_APP_IDENTITY_CLIENTID,
                    client_secret: env.VITE_APP_IDENTITY_CLIENTSECRET,
                    username: email,
                    password,
                    scope: env.VITE_APP_IDENTITY_SCOPE,
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )
            const { access_token, refresh_token, expires_in } = res.data
            tokenStore.save(access_token, refresh_token, expires_in)
            this.#profile = await this.#fetchUserInfo(access_token)
            this.#emit()
            return { success: true }
        } catch (err: unknown) {
            const msg = this.#extractError(err)
            return { success: false, error: msg }
        }
    }

    async refreshSilent(): Promise<boolean> {
        const rt = tokenStore.getRefresh()
        if (!rt) { await this.logout(); return false }
        try {
            const res = await axios.post<TokenResponse>(
                `${IDS}/connect/token`,
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: rt,
                    client_id: env.VITE_APP_IDENTITY_CLIENTID,
                    client_secret: env.VITE_APP_IDENTITY_CLIENTSECRET,
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )
            if (res.status === 200) {
                const { access_token, refresh_token, expires_in } = res.data
                tokenStore.save(access_token, refresh_token, expires_in)
                this.#profile = await this.#fetchUserInfo(access_token)
                this.#emit()
                return true
            }
        } catch {
            await this.logout()
        }
        return false
    }

    async logout(): Promise<void> {
        await this.logoutClear()
        window.location.href = '/'
    }

    async logoutClear(): Promise<void> {
        tokenStore.clear()
        this.#profile = null
        await this.#userManager.removeUser()
        this.#emit()
    }

    onUserChanged(cb: UserChangedCallback): void {
        this.#listeners.push(cb)
    }

    async #fetchUserInfo(accessToken: string): Promise<UserProfile | null> {
        try {
            const res = await axios.get<UserProfile>(`${IDS}/connect/userinfo`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            return res.data
        } catch { return null }
    }

    #extractError(err: unknown): string {
        if (axios.isAxiosError(err)) {
            return err.response?.data?.error_description
                ?? err.response?.data?.error
                ?? err.message
        }
        return err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
    }

    #emit(): void {
        this.#listeners.forEach((cb) => cb(this.#profile))
    }
}

export const authService = AuthService.getInstance()
