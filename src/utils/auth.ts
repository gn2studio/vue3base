/**
 * src/utils/auth.ts
 *
 * JWT 유틸리티 모듈
 * - 토큰 파싱, 만료 여부 확인, 조기(선제적) 만료 감지
 * - Role 클레임 추출 (MS WS-Federation URI 포함)
 */

const MS_ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

// ── JWT 파싱 ──────────────────────────────────────────────────────

/**
 * JWT 페이로드를 Base64URL 디코딩하여 JSON 객체로 반환.
 * 파싱 실패 시 null 반환.
 */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.')
        if (parts.length < 2) return null

        const base64Url = parts[1] ?? ''
        if (!base64Url) return null
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const paddingNeeded = (4 - (base64.length % 4)) % 4
        const padded = base64 + '='.repeat(paddingNeeded)

        // UTF-8 멀티바이트 문자 깨짐 방지
        const jsonPayload = decodeURIComponent(
            atob(padded)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch {
        return null
    }
}

// ── 만료 여부 확인 ────────────────────────────────────────────────

/**
 * JWT가 현재 시점에서 이미 만료되었는지 확인.
 * token 이 null/undefined/빈 문자열이면 만료로 취급.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
    if (!token) return true
    const payload = parseJwtPayload(token)
    if (!payload || typeof payload.exp !== 'number') return true
    return payload.exp <= Math.floor(Date.now() / 1000)
}

/**
 * JWT가 `thresholdSeconds` 이내에 만료될 예정인지 확인 (선제적 갱신용).
 * 기본 임계값: 300초 (5분)
 *
 * @param token             Raw JWT 문자열
 * @param thresholdSeconds  만료까지 남은 시간 임계치 (초)
 */
export function isTokenExpiringSoon(
    token: string | null | undefined,
    thresholdSeconds = 300
): boolean {
    if (!token) return true
    const payload = parseJwtPayload(token)
    if (!payload || typeof payload.exp !== 'number') return true
    const secondsLeft = payload.exp - Math.floor(Date.now() / 1000)
    return secondsLeft < thresholdSeconds
}

/**
 * JWT 만료까지 남은 시간을 초 단위로 반환.
 * 이미 만료된 경우 0 또는 음수를 반환.
 */
export function tokenSecondsRemaining(token: string | null | undefined): number {
    if (!token) return 0
    const payload = parseJwtPayload(token)
    if (!payload || typeof payload.exp !== 'number') return 0
    return payload.exp - Math.floor(Date.now() / 1000)
}

// ── Role 클레임 추출 ──────────────────────────────────────────────

/**
 * JWT 페이로드에서 role 클레임을 추출하여 문자열 배열로 반환.
 * 지원 클레임 키: `role`, `roles`, MS WS-Federation URI
 */
export function extractRolesFromToken(token: string | null | undefined): string[] {
    if (!token) return []
    const payload = parseJwtPayload(token)
    if (!payload) return []

    const raw = payload.role ?? payload.roles ?? payload[MS_ROLE_CLAIM] ?? null
    if (raw === null || raw === undefined) return []
    if (Array.isArray(raw)) return raw.map(String)
    return [String(raw)]
}

/**
 * JWT에 'Admin' 역할 클레임이 포함되어 있는지 확인.
 */
export function hasAdminRole(token: string | null | undefined): boolean {
    return extractRolesFromToken(token).includes('Admin')
}
