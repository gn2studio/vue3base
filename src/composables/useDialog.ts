import { ref, markRaw } from 'vue'

// ── 타입 정의 ──────────────────────────────────────────────────────

export type DialogType = 'confirm' | 'alert'
export type DialogVariant = 'default' | 'danger' | 'warning' | 'success'

interface DialogState {
    visible: boolean
    type: DialogType
    variant: DialogVariant
    title: string
    message: string
    confirmLabel: string
    cancelLabel: string
    resolve: ((value: boolean) => void) | null
}

// ── 전역 싱글턴 상태 ───────────────────────────────────────────────

const state = ref<DialogState>({
    visible: false,
    type: 'alert',
    variant: 'default',
    title: '',
    message: '',
    confirmLabel: '확인',
    cancelLabel: '취소',
    resolve: null,
})

// ── 내부 헬퍼 ─────────────────────────────────────────────────────

function openDialog(
    type: DialogType,
    title: string,
    message: string,
    options: {
        variant?: DialogVariant
        confirmLabel?: string
        cancelLabel?: string
    } = {}
): Promise<boolean> {
    return new Promise((resolve) => {
        state.value = {
            visible: true,
            type,
            variant: options.variant ?? 'default',
            title,
            message,
            confirmLabel: options.confirmLabel ?? (type === 'confirm' ? '확인' : '확인'),
            cancelLabel: options.cancelLabel ?? '취소',
            resolve,
        }
    })
}

export function _resolveDialog(confirmed: boolean) {
    state.value.resolve?.(confirmed)
    state.value.visible = false
    state.value.resolve = null
}

// ── 공개 API (composable) ──────────────────────────────────────────

export function useDialog() {
    /**
     * @description 확인/취소 선택 다이얼로그
     * @returns Promise<boolean> - true: 확인, false: 취소
     *
     * @example
     * const ok = await useDialog().confirm('로그아웃', '정말 로그아웃하시겠습니까?', { variant: 'danger' })
     * if (ok) await authStore.logout()
     */
    async function confirm(
        title: string,
        message: string,
        options: { variant?: DialogVariant; confirmLabel?: string; cancelLabel?: string } = {}
    ): Promise<boolean> {
        return openDialog('confirm', title, message, options)
    }

    /**
     * @description 단순 알림 다이얼로그 (확인 버튼만)
     * @returns Promise<void>
     *
     * @example
     * await useDialog().alert('접근 불가', '접근 권한이 없습니다.', { variant: 'warning' })
     */
    async function alert(
        title: string,
        message: string,
        options: { variant?: DialogVariant; confirmLabel?: string } = {}
    ): Promise<void> {
        await openDialog('alert', title, message, { ...options })
    }

    return { confirm, alert, state }
}
