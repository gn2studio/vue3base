<template>
  <div v-if="totalPages > 1" class="gn2-pagination">
    <!-- Previous -->
    <button
      class="page-btn nav-btn"
      :class="{ disabled: currentPage === 1 }"
      :disabled="currentPage === 1"
      @click="emit('change', currentPage - 1)"
      aria-label="이전 페이지"
    >
      <i class="fa-solid fa-chevron-left text-xs"></i>
    </button>

    <!-- Page Numbers -->
    <template v-for="page in pageRange" :key="page">
      <span v-if="page === '...'" class="page-ellipsis">···</span>
      <button
        v-else
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="emit('change', page as number)"
      >{{ page }}</button>
    </template>

    <!-- Next -->
    <button
      class="page-btn nav-btn"
      :class="{ disabled: currentPage === totalPages }"
      :disabled="currentPage === totalPages"
      @click="emit('change', currentPage + 1)"
      aria-label="다음 페이지"
    >
      <i class="fa-solid fa-chevron-right text-xs"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  maxVisible?: number
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

// 페이지 범위 계산 (최대 maxVisible 개 표시, 양 끝 + 현재 주변)
const pageRange = computed(() => {
  const max = props.maxVisible ?? 7
  const total = props.totalPages
  const current = props.currentPage

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  const half = Math.floor(max / 2)

  let start = Math.max(2, current - half)
  let end = Math.min(total - 1, current + half)

  if (current - half < 2) end = Math.min(total - 1, max - 1)
  if (current + half > total - 1) start = Math.max(2, total - max + 2)

  pages.push(1)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)

  return pages
})
</script>

<style scoped>
.gn2-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: oklch(75% 0.04 250);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.page-btn.active {
  background: oklch(55% 0.18 250);
  border-color: oklch(55% 0.18 250);
  color: white;
  font-weight: 700;
  box-shadow: 0 0 16px oklch(55% 0.18 250 / 0.4);
}

.page-btn.nav-btn {
  min-width: 38px;
}

.page-btn.disabled,
.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-ellipsis {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  padding: 0 4px;
  user-select: none;
}
</style>
