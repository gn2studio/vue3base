<template>
  <Teleport to="body">
    <div class="toast-container">
      <transition-group name="toast-slide">
        <div v-for="t in toasts" :key="t.id" class="toast-item" :class="t.type">
          <i class="fa-solid toast-icon" :class="iconMap[t.type]"></i>
          <div class="toast-body">
            <p class="toast-title">{{ t.title }}</p>
            <p v-if="t.message" class="toast-msg">{{ t.message }}</p>
          </div>
          <button class="toast-close" @click="remove(t.id)">✕</button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

const iconMap: Record<string, string> = {
  success: 'fa-circle-check',
  error: 'fa-circle-xmark',
  info: 'fa-circle-info',
  warning: 'fa-triangle-exclamation',
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  pointer-events: none;
}
.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  min-width: 280px;
  max-width: 380px;
  pointer-events: all;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  border: 1px solid transparent;
}
.toast-item.success { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); }
.toast-item.error   { background: rgba(239,68,68,0.12);  border-color: rgba(239,68,68,0.3); }
.toast-item.info    { background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.3); }
.toast-item.warning { background: rgba(234,179,8,0.12);  border-color: rgba(234,179,8,0.3); }

.toast-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
.success .toast-icon { color: rgb(74 222 128); }
.error .toast-icon   { color: rgb(248 113 113); }
.info .toast-icon    { color: rgb(96 165 250); }
.warning .toast-icon { color: rgb(250 204 21); }

.toast-body { flex: 1; }
.toast-title { color: white; font-weight: 600; font-size: 0.875rem; margin: 0; }
.toast-msg { color: rgba(255,255,255,0.55); font-size: 0.8rem; margin: 2px 0 0; }
.toast-close {
  background: none; border: none; color: rgba(255,255,255,0.35);
  cursor: pointer; font-size: 0.8rem; flex-shrink: 0;
}
.toast-close:hover { color: white; }

.toast-slide-enter-active { transition: all 0.3s ease; }
.toast-slide-leave-active { transition: all 0.25s ease; }
.toast-slide-enter-from { opacity: 0; transform: translateX(40px); }
.toast-slide-leave-to { opacity: 0; transform: translateX(40px); }
</style>
