<template>
  <div :class="['overlay', { 'is-open': isOpen }]" @click.self="close">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h2 id="modal-title">🔐 로그인</h2>
        <button class="close-btn" @click="close" aria-label="닫기">✕</button>
      </div>

      <div v-if="errorMsg" id="error-msg" role="alert">{{ errorMsg }}</div>

      <form id="login-form" @submit.prevent="handleSubmit" novalidate>
        <div class="field">
          <label for="username">아이디 (이메일)</label>
          <input
            type="text"
            id="username"
            name="username"
            v-model="form.username"
            placeholder="example@email.com"
            autocomplete="username"
            required
            ref="usernameInput"
          />
        </div>
        <div class="field">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            v-model="form.password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? '인증 중...' : '로그인' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const isOpen = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const form = reactive({
  username: '',
  password: ''
})

const usernameInput = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  (e: 'login-success'): void
}>()

const open = () => {
  isOpen.value = true
  // 약간의 딜레이 후 focus
  nextTick(() => {
    setTimeout(() => {
      usernameInput.value?.focus()
    }, 10)
  })
}

const close = () => {
  isOpen.value = false
  setTimeout(() => {
    form.username = ''
    form.password = ''
    errorMsg.value = ''
  }, 300)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const handleSubmit = async () => {
  const username = form.username.trim()
  const password = form.password

  if (!username || !password) {
    errorMsg.value = '아이디와 비밀번호를 입력해 주세요.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const result = await authStore.loginWithPassword(username, password)
    if (result.success) {
      close()
      emit('login-success')
    } else {
      errorMsg.value = result.error ?? '로그인에 실패했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

// 부모 컴포넌트나 라우터에서 접근할 수 있도록 노출
defineExpose({
  open,
  close
})
</script>

<style scoped>
.overlay {
  display: flex;
  opacity: 0;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  pointer-events: none; /* 클릭 방지 */
}
.overlay.is-open {
  opacity: 1;
  pointer-events: auto; /* 열렸을 때 클릭 허용 */
}

/* 약간 편법: isOpen이 false일때 사실상 화면에서 안보이게 처리. */
.overlay:not(.is-open) {
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0s linear 0.3s;
}

.modal {
  background: oklch(15% 0.02 250);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: oklch(70% 0.05 250);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
  padding: 0;
}
.close-btn:hover { color: #fff; }

.field {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: oklch(75% 0.05 250);
  margin-bottom: 0.4rem;
  letter-spacing: 0.02em;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: oklch(20% 0.02 250);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  box-sizing: border-box;
}
input:focus {
  border-color: oklch(55% 0.18 250);
  box-shadow: 0 0 0 3px oklch(55% 0.18 250 / 0.2);
}
input::placeholder { color: oklch(50% 0.05 250); }

#error-msg {
  padding: 0.75rem 1rem;
  background: oklch(30% 0.1 15 / 0.3);
  border: 1px solid oklch(50% 0.15 15 / 0.5);
  border-radius: 8px;
  color: oklch(80% 0.1 15);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.85rem;
  background: oklch(55% 0.18 250);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
  letter-spacing: 0.02em;
}
.submit-btn:hover:not(:disabled) {
  background: oklch(60% 0.2 250);
  box-shadow: 0 0 20px oklch(55% 0.18 250 / 0.5);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
