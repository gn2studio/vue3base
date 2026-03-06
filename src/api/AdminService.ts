import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'
import { isTokenExpiringSoon } from '@/utils/auth'

// ── Board API 전용 Axios 인스턴스 ─────────────────────────────────
const boardApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BOARD_API_URL as string,
    timeout: 15000,
})

// ── 토큰 갱신 동시성 제어 (Board API 전용) ──────────────────────
let isBoardRefreshing = false
let boardPendingRequests: Array<(token: string) => void> = []

function processBoardQueue(token: string): void {
    boardPendingRequests.forEach((cb) => cb(token))
    boardPendingRequests = []
}

function rejectBoardQueue(err: unknown): void {
    boardPendingRequests.forEach((cb) => cb(''))
    boardPendingRequests = []
}

// ── 요청 인터셉터: Authorization 헤더 + 만료 직전 선제 갱신 ──────
boardApiClient.interceptors.request.use(
    async (config) => {
        const authStore = useAuthStore()
        let token = authStore.accessToken

        // 토큰이 5분 내 만료 예정이면 API 요청 전에 먼저 갱신
        if (token && isTokenExpiringSoon(token)) {
            if (!isBoardRefreshing) {
                isBoardRefreshing = true
                try {
                    const ok = await authStore.silentRenew()
                    const newToken = authStore.accessToken
                    if (ok && newToken) {
                        processBoardQueue(newToken)
                        token = newToken
                    } else {
                        rejectBoardQueue(new Error('Token refresh failed'))
                    }
                } finally {
                    isBoardRefreshing = false
                }
            } else {
                // 갱신이 이미 진행 중이면 완료 때까지 대기
                await new Promise<void>((resolve) => {
                    boardPendingRequests.push(() => resolve())
                })
                token = authStore.accessToken
            }
        }

        if (token) config.headers['Authorization'] = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error),
)

// ── 응답 인터셉터: 401 → silent renew → 재시도 + 큐 처리 ─────────
boardApiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isBoardRefreshing) {
                // 갱신 진행 중: 큐에 넣고 완료 후 재시도
                return new Promise((resolve, reject) => {
                    boardPendingRequests.push((token: string) => {
                        if (!token) return reject(error)
                        originalRequest.headers['Authorization'] = `Bearer ${token}`
                        resolve(boardApiClient(originalRequest))
                    })
                })
            }

            originalRequest._retry = true
            isBoardRefreshing = true

            const authStore = useAuthStore()
            try {
                const ok = await authStore.silentRenew()

                if (ok && authStore.accessToken) {
                    const newToken = authStore.accessToken
                    processBoardQueue(newToken)
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                    return boardApiClient(originalRequest)
                } else {
                    // refresh_token 도 만료 → 세션 초기화 후 로그인
                    rejectBoardQueue(error)
                    await authStore.logout()
                    return Promise.reject(error)
                }
            } finally {
                isBoardRefreshing = false
            }
        }

        return Promise.reject(error)
    },
)

// ── 공통 타입 ─────────────────────────────────────────────────────

export interface PagedResult<T> {
    items: T[]
    totalCount: number
    curPage: number
    pageSize: number
}

/** API 공통 응답 Envelope */
export interface ApiListResponse<T> {
    data: T[]
    success: boolean
    errorCode: number
    count: number
    value: string
    message: string
}

export interface ApiSingleResponse<T> {
    data: T
    success: boolean
    errorCode: number
    value: string
    message: string
}

/** API 서버에서 실제로 내려오는 사이트 항목 구조 */
export interface SiteItemRaw {
    id: string
    slug: string
    title: string
    description: string
    thumbnail: string
    keywords: string
    isActive?: boolean
    createdAt?: string
}

export interface SiteItem {
    siteId: string
    slug: string
    title: string
    description: string
    thumbnail: string
    keywords: string
    isActive: boolean
    createdAt: string
}

/** SiteItemRaw → SiteItem 정규화 */
function normalizeSiteItem(raw: SiteItemRaw): SiteItem {
    return {
        siteId:      raw.id,
        slug:        raw.slug,
        title:       raw.title,
        description: raw.description ?? '',
        thumbnail:   raw.thumbnail ?? '',
        keywords:    raw.keywords ?? '',
        isActive:    raw.isActive ?? false,
        createdAt:   raw.createdAt ?? '',
    }
}

/** API 서버 BoardTypecs enum과 1:1 대응 (고정값 – 변경 불가) */
export const BOARD_TYPES = [
    { value: 'Normal',      label: 'Normal (일반)' },
    { value: 'Gallery',     label: 'Gallery (갤러리)' },
    { value: 'Question',    label: 'Question (문의/Q&A)' },
    { value: 'OnlyManager', label: 'OnlyManager (관리자 전용)' },
] as const

export type BoardType = typeof BOARD_TYPES[number]['value']

export interface BoardMaster {
    masterCode: string
    title: string
    boardType: BoardType
    section: string
    icon: string
    description: string
    sortNo: number
    isActive: boolean
}

/** API 서버에서 실제로 내려오는 BoardMaster 원시 구조 */
export interface BoardMasterRaw {
    id: string
    masterCode: string
    title: string
    boardType: string
    section: string
    icon: string
    description: string
    seq: number          // sortNo 대응
    siteId: string
    isActive?: boolean
}

function normalizeBoardMaster(raw: BoardMasterRaw): BoardMaster {
    return {
        masterCode:  raw.masterCode,
        title:       raw.title,
        boardType:   raw.boardType as BoardType,
        section:     raw.section ?? '',
        icon:        raw.icon ?? '',
        description: raw.description ?? '',
        sortNo:      raw.seq ?? 0,
        isActive:    raw.isActive ?? true,
    }
}

export interface BoardCategory {
    category: string
    title: string
    sortNo: number
}

export interface BoardContent {
    contentId: string
    title: string
    authorName: string
    createdAt: string
    viewCount: number
    isDeleted: boolean
}

// ── Site Service ──────────────────────────────────────────────────

export class SiteService {
    static endpoints = {
        LIST: '/Sites',
        VIEW: (slug: string) => `/Site/View/${slug}`,
        REGIST: '/Site/Regist',
        UPDATE: '/Site/Update',
        DELETE: (id: string) => `/Site/Delete/${id}`,
    }

    /**
     * @description 사이트 목록 (페이지네이션)
     * @todo Swagger: GET /Sites?CurPage={page}&PageSize={size}
     */
    static async getSites(curPage = 1, pageSize = 10): Promise<PagedResult<SiteItem>> {
        console.log('[SiteService.getSites]', { curPage, pageSize })
        try {
            const res = await boardApiClient.get<ApiListResponse<SiteItemRaw>>(
                this.endpoints.LIST,
                { params: { CurPage: curPage, PageSize: pageSize } },
            )
            const envelope = res.data
            return {
                items:      (envelope.data ?? []).map(normalizeSiteItem),
                totalCount: envelope.count ?? 0,
                curPage,
                pageSize,
            }
        } catch {
            // Mock 데이터 (API 미연결 시)
            await new Promise(r => setTimeout(r, 600))
            return {
                items: [
                    { siteId: 'site-001', slug: 'gn2studio', title: 'GN2Studio 공식 사이트', description: '메인 홈페이지', thumbnail: '', keywords: 'vue,typescript', isActive: true, createdAt: '2025-01-01' },
                    { siteId: 'site-002', slug: 'merrytoktok', title: '메리톡톡', description: '웹소설 커뮤니티', thumbnail: '', keywords: 'novel,community', isActive: true, createdAt: '2025-06-01' },
                    { siteId: 'site-003', slug: 'waggle', title: '와글커뮤니티', description: '커뮤니티 SaaS', thumbnail: '', keywords: 'community,saas', isActive: false, createdAt: '2026-01-01' },
                ],
                totalCount: 3, curPage: 1, pageSize: 10,
            }
        }
    }

    /**
     * @description 사이트 상세 조회
     * @todo Swagger: GET /Site/View/{Slug}
     */
    static async getSite(slug: string): Promise<SiteItem> {
        try {
            const res = await boardApiClient.get<ApiSingleResponse<SiteItemRaw>>(this.endpoints.VIEW(slug))
            return normalizeSiteItem(res.data.data)
        } catch {
            // Mock 데이터 (API 미연결 시)
            await new Promise(r => setTimeout(r, 300))
            return {
                siteId: `site-${slug}`,
                slug,
                title: `${slug} 사이트`,
                description: '사이트 설명입니다.',
                thumbnail: '',
                keywords: 'vue,typescript',
                isActive: true,
                createdAt: '2025-01-01',
            }
        }
    }

    /**
     * @description 사이트 등록
     * @todo Swagger: POST /Site/Regist
     */
    static async registSite(data: Partial<SiteItem>): Promise<void> {
        await boardApiClient.post(this.endpoints.REGIST, data)
    }

    /**
     * @description 사이트 수정
     * @todo Swagger: PUT /Site/Update
     */
    static async updateSite(data: Partial<SiteItem>): Promise<void> {
        await boardApiClient.put(this.endpoints.UPDATE, data)
    }

    /**
     * @description 사이트 삭제
     * @todo Swagger: DELETE /Site/Delete/{id}
     */
    static async deleteSite(siteId: string): Promise<void> {
        await boardApiClient.delete(this.endpoints.DELETE(siteId))
    }
}

// ── BoardMaster Service ───────────────────────────────────────────

export class BoardMasterService {
    /**
     * @description 사이트의 게시판 마스터 목록
     * @todo Swagger: GET /Site/{Slug}/Board/Masters
     */
    static async getMasters(slug: string): Promise<BoardMaster[]> {
        try {
            const res = await boardApiClient.get<ApiListResponse<BoardMasterRaw>>(`/Site/${slug}/Board/Masters`)
            return (res.data.data ?? []).map(normalizeBoardMaster)
        } catch {
            await new Promise(r => setTimeout(r, 400))
            return [
                { masterCode: 'NOTICE', title: '공지사항', boardType: 'Normal' as BoardType, section: 'main', icon: 'fa-bell', description: '사이트 공지사항 게시판', sortNo: 1, isActive: true },
                { masterCode: 'GALLERY', title: '갤러리', boardType: 'Gallery' as BoardType, section: 'main', icon: 'fa-circle-question', description: '갤러리 게시판', sortNo: 2, isActive: true },
                { masterCode: 'INQUIRY', title: '문의사항', boardType: 'Question' as BoardType, section: 'main', icon: 'fa-envelope', description: '1:1 문의 게시판', sortNo: 3, isActive: true },
            ]
        }
    }

    /**
     * @description 게시판 마스터 상세 조회
     * @todo Swagger: GET /Site/{Slug}/Board/Master/View/{MasterCode}
     */
    static async getMaster(slug: string, masterCode: string): Promise<BoardMaster> {
        try {
            const res = await boardApiClient.get<ApiSingleResponse<BoardMasterRaw>>(`/Site/${slug}/Board/Master/View/${masterCode}`)
            return normalizeBoardMaster(res.data.data)
        } catch {
            await new Promise(r => setTimeout(r, 300))
            return {
                masterCode,
                title: `${masterCode} 게시판`,
                boardType: 'Normal' as BoardType,
                section: 'main',
                icon: 'fa-list',
                description: '',
                sortNo: 1,
                isActive: true,
            }
        }
    }

    /**
     * @description 게시판 마스터 저장 (등록/수정 통합)
     * @todo Swagger: POST /Site/{Slug}/Board/Master/Save
     * @body BoardMasterSaveDto { masterCode, title, boardType, section, icon, sortNo }
     */
    static async saveMaster(slug: string, data: Partial<BoardMaster>): Promise<void> {
        await boardApiClient.post(`/Site/${slug}/Board/Master/Save`, data)
    }

    /**
     * @description 게시판 마스터 삭제
     * @todo Swagger: DELETE /Site/{Slug}/Board/Master/{masterCode}/Delete
     */
    static async deleteMaster(slug: string, masterCode: string): Promise<void> {
        await boardApiClient.delete(`/Site/${slug}/Board/Master/${masterCode}/Delete`)
    }
}

// ── BoardCategory Service ─────────────────────────────────────────

export class BoardCategoryService {
    /**
     * @description 카테고리 목록
     * @todo Swagger: GET /Site/{Slug}/Board/Categories/{MasterCode}
     */
    static async getCategories(slug: string, masterCode: string): Promise<BoardCategory[]> {
        try {
            const res = await boardApiClient.get(`/Site/${slug}/Board/Categories/${masterCode}`)
            return res.data
        } catch {
            await new Promise(r => setTimeout(r, 300))
            return [
                { category: 'general', title: '일반', sortNo: 1 },
                { category: 'notice', title: '공지', sortNo: 2 },
                { category: 'event', title: '이벤트', sortNo: 3 },
            ]
        }
    }

    /**
     * @description 카테고리 등록
     * @todo Swagger: POST /Site/{Slug}/Board/Category/Regist
     * @body BoardCategoryRegistCommand { masterCode, category, title, sortNo }
     */
    static async registCategory(slug: string, data: { masterCode: string; category: string; title: string; sortNo: number }): Promise<void> {
        await boardApiClient.post(`/Site/${slug}/Board/Category/Regist`, data)
    }

    /**
     * @description 카테고리 삭제
     * @todo Swagger: DELETE /Site/{Slug}/Board/Category/Delete?MasterCode=&Category=
     */
    static async deleteCategory(slug: string, masterCode: string, category: string): Promise<void> {
        await boardApiClient.delete(`/Site/${slug}/Board/Category/Delete`, { params: { MasterCode: masterCode, Category: category } })
    }
}

// ── BoardContent Service ──────────────────────────────────────────

export class BoardContentService {
    /**
     * @description 게시물 목록 (페이지네이션)
     * @todo Swagger: GET /Site/{Slug}/Board/{MasterCode}/Contents?CurPage=&PageSize=&Keyword=
     */
    static async getContents(slug: string, masterCode: string, curPage = 1, pageSize = 10, keyword = ''): Promise<PagedResult<BoardContent>> {
        try {
            const res = await boardApiClient.get(`/Site/${slug}/Board/${masterCode}/Contents`, {
                params: { CurPage: curPage, PageSize: pageSize, Keyword: keyword || undefined }
            })
            return res.data
        } catch {
            await new Promise(r => setTimeout(r, 500))
            const items: BoardContent[] = Array.from({ length: 5 }, (_, i) => ({
                contentId: `content-${i + 1}`,
                title: `샘플 게시물 ${(curPage - 1) * pageSize + i + 1}`,
                authorName: 'admin',
                createdAt: '2026-03-01',
                viewCount: Math.floor(Math.random() * 100),
                isDeleted: false,
            }))
            return { items, totalCount: 23, curPage, pageSize }
        }
    }

    /**
     * @description 게시물 삭제 (소프트 딜리트)
     * @todo Swagger: POST /Site/{Slug}/Board/Content/Remove/{ContentId}
     */
    static async removeContent(slug: string, contentId: string): Promise<void> {
        await boardApiClient.post(`/Site/${slug}/Board/Content/Remove/${contentId}`)
    }
}

export default boardApiClient
