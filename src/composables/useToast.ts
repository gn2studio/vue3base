import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: number
    type: ToastType
    title: string
    message?: string
}

let _counter = 0
const toasts = ref<Toast[]>([])

export function useToast() {
    const add = (type: ToastType, title: string, message?: string, duration = 3500) => {
        const id = ++_counter
        toasts.value.push({ id, type, title, message })
        setTimeout(() => remove(id), duration)
    }

    const remove = (id: number) => {
        const idx = toasts.value.findIndex(t => t.id === id)
        if (idx !== -1) toasts.value.splice(idx, 1)
    }

    return {
        toasts,
        remove,
        success: (title: string, msg?: string) => add('success', title, msg),
        error: (title: string, msg?: string) => add('error', title, msg),
        info: (title: string, msg?: string) => add('info', title, msg),
        warn: (title: string, msg?: string) => add('warning', title, msg),
    }
}
