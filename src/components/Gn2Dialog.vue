<template>
  <Teleport to="body">
    <transition name="dialog-fade">
      <div v-if="state.visible" class="dialog-backdrop" @click.self="handleBackdropClick">
        <transition name="dialog-scale">
          <div v-if="state.visible" class="dialog-box" :class="`dialog-${state.variant}`" role="dialog" :aria-modal="true">

            <!-- Icon -->
            <div class="dialog-icon-wrap">
              <div class="dialog-icon">
                <i class="fa-solid" :class="iconClass"></i>
              </div>
            </div>

            <!-- Content -->
            <div class="dialog-content">
              <h3 class="dialog-title">{{ state.title }}</h3>
              <p class="dialog-message">{{ state.message }}</p>
            </div>

            <!-- Actions -->
            <div class="dialog-actions">
              <!-- Confirm Type: 취소 + 확인 -->
              <template v-if="state.type === 'confirm'">
                <button class="dialog-btn dialog-btn-cancel" @click="handleCancel">
                  {{ state.cancelLabel }}
                </button>
                <button class="dialog-btn dialog-btn-confirm" :class="`btn-${state.variant}`" @click="handleConfirm">
                  {{ state.confirmLabel }}
                </button>
              </template>
              <!-- Alert Type: 확인만 -->
              <template v-else>
                <button class="dialog-btn dialog-btn-confirm dialog-btn-full" :class="`btn-${state.variant}`" @click="handleConfirm">
                  {{ state.confirmLabel }}
                </button>
              </template>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDialog, _resolveDialog } from '@/composables/useDialog'

const { state } = useDialog()

const iconClass = computed(() => {
  switch (state.value.variant) {
    case 'danger':  return 'fa-triangle-exclamation'
    case 'warning': return 'fa-circle-exclamation'
    case 'success': return 'fa-circle-check'
    default:        return state.value.type === 'confirm' ? 'fa-circle-question' : 'fa-circle-info'
  }
})

const handleConfirm = () => _resolveDialog(true)
const handleCancel  = () => _resolveDialog(false)

// Alert 타입은 backdrop 클릭으로 닫기, Confirm은 명시적 클릭만 허용
const handleBackdropClick = () => {
  if (state.value.type === 'alert') _resolveDialog(true)
}
</script>

<style scoped>
.dialog-backdrop {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}

.dialog-box {
  background: oklch(17% 0.05 250);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
}

/* Icon */
.dialog-icon-wrap { display: flex; justify-content: center; }
.dialog-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}

/* Variant 아이콘 색상 */
.dialog-default .dialog-icon  { background: rgba(99,102,241,0.15); color: oklch(72% 0.18 270); }
.dialog-danger  .dialog-icon  { background: rgba(239,68,68,0.12);  color: rgb(248,113,113); }
.dialog-warning .dialog-icon  { background: rgba(234,179,8,0.12);  color: rgb(250,204,21); }
.dialog-success .dialog-icon  { background: rgba(34,197,94,0.12);  color: rgb(74,222,128); }

/* Variant 테두리 강조 */
.dialog-danger  { border-color: rgba(239,68,68,0.25); }
.dialog-warning { border-color: rgba(234,179,8,0.25); }
.dialog-success { border-color: rgba(34,197,94,0.25); }

/* Content */
.dialog-content { width: 100%; }
.dialog-title {
  font-size: 1.05rem; font-weight: 800; color: white;
  margin: 0 0 0.5rem; letter-spacing: -0.02em;
}
.dialog-message {
  font-size: 0.875rem; color: rgba(255, 255, 255, 0.55);
  line-height: 1.6; margin: 0;
}

/* Actions */
.dialog-actions {
  display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;
}

.dialog-btn {
  flex: 1; padding: 0.7rem 1rem;
  border-radius: 12px; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease; border: none;
}

.dialog-btn-cancel {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.dialog-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

/* Confirm 버튼 variant별 색상 */
.dialog-btn-confirm.btn-default {
  background: oklch(55% 0.18 250); color: white;
}
.dialog-btn-confirm.btn-default:hover {
  background: oklch(62% 0.2 250);
  box-shadow: 0 0 16px oklch(55% 0.18 250 / 0.5);
}
.dialog-btn-confirm.btn-danger {
  background: rgba(239, 68, 68, 0.85); color: white;
}
.dialog-btn-confirm.btn-danger:hover {
  background: rgb(239, 68, 68);
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.5);
}
.dialog-btn-confirm.btn-warning {
  background: rgba(234, 179, 8, 0.85); color: #000;
}
.dialog-btn-confirm.btn-warning:hover {
  background: rgb(234, 179, 8);
  box-shadow: 0 0 16px rgba(234, 179, 8, 0.5);
}
.dialog-btn-confirm.btn-success {
  background: rgba(34, 197, 94, 0.85); color: #000;
}
.dialog-btn-confirm.btn-success:hover {
  background: rgb(34, 197, 94);
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.5);
}
.dialog-btn-full { flex: 1; }

/* Transitions */
.dialog-fade-enter-active, .dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity: 0; }

.dialog-scale-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dialog-scale-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dialog-scale-enter-from { opacity: 0; transform: scale(0.85) translateY(20px); }
.dialog-scale-leave-to   { opacity: 0; transform: scale(0.95); }
</style>
