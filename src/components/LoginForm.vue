<template>
  <div class="login-wrap">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h2 class="login-title">🔐 로그인</h2>

      <p v-if="errorMsg" class="error-msg" role="alert">{{ errorMsg }}</p>

      <div class="field">
        <label for="login-email">이메일</label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          placeholder="example@email.com"
          autocomplete="username"
          required
        />
      </div>

      <div class="field">
        <label for="login-password">비밀번호</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          required
        />
      </div>

      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? '로그인 중...' : '로그인' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const emit = defineEmits<{ success: [] }>()

const authStore = useAuthStore()

const email       = ref('')
const password    = ref('')
const errorMsg    = ref('')
const isSubmitting = ref(false)

async function handleSubmit(): Promise<void> {
  if (!email.value || !password.value) {
    errorMsg.value = '이메일과 비밀번호를 입력해 주세요.'
    return
  }

  isSubmitting.value = true
  errorMsg.value     = ''

  try {
    const result = await authStore.loginWithPassword(email.value, password.value)
    if (result.success) {
      emit('success')
    } else {
      errorMsg.value = result.error ?? '아이디 또는 비밀번호를 확인하세요.'
    }
  } finally {
    isSubmitting.value = false
    password.value     = ''
  }
}
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}
.login-form {
  width: 100%;
  max-width: 400px;
  background: oklch(15% 0.02 250);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.login-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
  margin: 0;
}
.error-msg {
  padding: .75rem 1rem;
  background: oklch(30% .1 15 / .3);
  border: 1px solid oklch(50% .15 15 / .5);
  border-radius: 8px;
  color: oklch(80% .1 15);
  font-size: .875rem;
  margin: 0;
}
.field {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}
label {
  font-size: .85rem;
  font-weight: 600;
  color: oklch(75% .05 250);
}
input {
  padding: .75rem 1rem;
  background: oklch(20% .02 250);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 10px;
  color: #fff;
  font-size: .95rem;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
input:focus {
  border-color: oklch(55% .18 250);
  box-shadow: 0 0 0 3px oklch(55% .18 250 / .2);
}
input::placeholder { color: oklch(50% .05 250); }
.submit-btn {
  padding: .85rem;
  background: oklch(55% .18 250);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s, box-shadow .2s, opacity .2s;
}
.submit-btn:hover:not(:disabled) {
  background: oklch(60% .2 250);
  box-shadow: 0 0 20px oklch(55% .18 250 / .5);
}
.submit-btn:disabled { opacity: .6; cursor: not-allowed; }
</style>
