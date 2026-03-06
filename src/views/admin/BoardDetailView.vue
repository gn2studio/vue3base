<template>
  <div>
    <!-- Breadcrumb -->
    <div class="admin-breadcrumb">
      <router-link to="/admin/sites" class="bc-link">사이트 목록</router-link>
      <span class="bc-sep">›</span>
      <router-link :to="`/admin/sites/${slug}`" class="bc-link">{{ slug }}</router-link>
      <span class="bc-sep">›</span>
      <span class="bc-current">{{ masterData?.title ?? masterCode }}</span>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="skeleton-row h-24"></div>
    </div>

    <template v-else>
      <!-- ① 게시판 설정 폼 -->
      <div class="admin-card mb-6">
        <h3 class="section-h3 mb-5">
          <i class="fa-solid" :class="boardForm.icon || 'fa-list'" style="color: var(--accent)"></i>
          게시판 설정
        </h3>
        <div class="form-grid">
          <div class="form-row">
            <label>게시판 코드</label>
            <input :value="masterCode" type="text" class="form-input" disabled />
          </div>
          <div class="form-row">
            <label>게시판명 <span class="required">*</span></label>
            <input v-model="boardForm.title" type="text" class="form-input" />
          </div>
          <div class="form-row">
            <label>유형</label>
            <select v-model="boardForm.boardType" class="form-input">
              <option value="Board">Board</option>
              <option value="Notice">Notice</option>
              <option value="Faq">Faq</option>
              <option value="Qna">Qna</option>
            </select>
          </div>
          <div class="form-row">
            <label>섹션</label>
            <input v-model="boardForm.section" type="text" class="form-input" placeholder="main" />
          </div>
          <div class="form-row">
            <label>아이콘 (FA)</label>
            <input v-model="boardForm.icon" type="text" class="form-input" placeholder="fa-bell" />
          </div>
          <div class="form-row">
            <label>설명</label>
            <input v-model="boardForm.description" type="text" class="form-input" placeholder="게시판에 대한 간단 설명" />
          </div>
          <div class="form-row">
            <label>순번</label>
            <input v-model.number="boardForm.sortNo" type="number" class="form-input" />
          </div>
        </div>
        <div class="form-row form-check mt-4">
          <label class="check-label">
            <input type="checkbox" v-model="boardForm.isActive" class="form-checkbox" />
            활성화
          </label>
        </div>
        <div class="mt-5 flex justify-end">
          <button class="btn-primary" :disabled="boardSaving" @click="saveBoard">
            <i v-if="boardSaving" class="fa-solid fa-spinner fa-spin mr-2"></i>
            {{ boardSaving ? '저장 중...' : '설정 저장' }}
          </button>
        </div>
      </div>

      <!-- ② 카테고리 관리 (ListGroup 스타일) -->
      <div class="admin-card mb-6">
        <div class="section-header-row mb-4">
          <h3 class="section-h3">카테고리 관리</h3>
          <button class="btn-primary btn-sm" @click="openCatModal()">
            <i class="fa-solid fa-plus mr-1"></i>카테고리 추가
          </button>
        </div>

        <!-- ListGroup -->
        <div v-if="catLoading" class="space-y-2">
          <div v-for="i in 3" :key="i" class="skeleton-row h-12"></div>
        </div>
        <ul v-else class="list-group">
          <li v-if="categories.length === 0" class="list-group-empty">
            등록된 카테고리가 없습니다.
          </li>
          <li v-for="cat in categories" :key="cat.category" class="list-group-item">
            <div class="list-item-main">
              <span class="list-item-dot"></span>
              <div>
                <p class="list-item-title">{{ cat.title }}</p>
                <p class="list-item-sub">
                  <code class="code-tag-sm">{{ cat.category }}</code>
                  <span class="ml-2 text-xs text-white/30">순번: {{ cat.sortNo }}</span>
                </p>
              </div>
            </div>
            <button class="btn-icon btn-red btn-xs" @click="deleteCat(cat)" title="삭제">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </li>
        </ul>
      </div>

      <!-- ③ 게시물 목록 -->
      <div class="admin-card">
        <div class="section-header-row mb-4">
          <h3 class="section-h3">게시물 목록</h3>
          <div class="flex items-center gap-2">
            <input
              v-model="keyword"
              type="text"
              class="form-input input-sm"
              placeholder="검색어"
              @keyup.enter="loadContents(1)"
            />
            <button class="btn-secondary btn-sm" @click="loadContents(1)">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <div v-if="contentsLoading" class="space-y-2">
          <div v-for="i in 5" :key="i" class="skeleton-row h-12"></div>
        </div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>조회</th>
              <th>작성일</th>
              <th class="text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in contents" :key="c.contentId">
              <td class="text-white">{{ c.title }}</td>
              <td class="text-muted">{{ c.authorName }}</td>
              <td class="text-muted">{{ c.viewCount }}</td>
              <td class="text-muted">{{ c.createdAt }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-red" @click="removeContent(c.contentId)" title="삭제">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="contents.length === 0">
              <td colspan="5" class="empty-row">게시물이 없습니다.</td>
            </tr>
          </tbody>
        </table>

        <div v-if="contentTotalPages > 1" class="mt-4">
          <Gn2Pagination :current-page="contentPage" :total-pages="contentTotalPages" @change="loadContents" />
        </div>
      </div>
    </template>

    <!-- Category Add Modal -->
    <transition name="modal-fade">
      <div v-if="showCatModal" class="modal-backdrop" @click.self="showCatModal = false">
        <div class="modal-box modal-sm">
          <div class="modal-header">
            <h3>카테고리 추가</h3>
            <button class="modal-close" @click="showCatModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <label>카테고리 코드 <span class="required">*</span></label>
              <input v-model="catForm.category" type="text" class="form-input" placeholder="general" />
            </div>
            <div class="form-row">
              <label>카테고리명 <span class="required">*</span></label>
              <input v-model="catForm.title" type="text" class="form-input" placeholder="일반" />
            </div>
            <div class="form-row">
              <label>순번</label>
              <input v-model.number="catForm.sortNo" type="number" class="form-input" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="showCatModal = false">취소</button>
            <button class="btn-primary" :disabled="catSaving" @click="saveCategory">
              {{ catSaving ? '저장 중...' : '추가' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import {
  BoardMasterService, BoardCategoryService, BoardContentService,
  type BoardMaster, type BoardCategory, type BoardContent
} from '@/api/AdminService'
import { useToast } from '@/composables/useToast'
import Gn2Pagination from '@/components/Gn2Pagination.vue'

const route = useRoute()
const toast = useToast()

const slug = route.params.slug as string
const masterCode = route.params.masterCode as string

const loading = ref(true)
const masterData = ref<BoardMaster | null>(null)
const boardSaving = ref(false)
const boardForm = reactive<Partial<BoardMaster>>({
  masterCode, title: '', boardType: 'Board', section: 'main', icon: '', description: '', sortNo: 1, isActive: true
})

// Categories
const categories = ref<BoardCategory[]>([])
const catLoading = ref(true)
const showCatModal = ref(false)
const catSaving = ref(false)
const catForm = reactive({ category: '', title: '', sortNo: 1 })

// Contents
const contents = ref<BoardContent[]>([])
const contentsLoading = ref(false)
const contentPage = ref(1)
const contentTotalPages = ref(1)
const keyword = ref('')

// ── Load ─────────────────────────────────────────────────────────
const loadMaster = async () => {
  loading.value = true
  try {
    const data = await BoardMasterService.getMaster(slug, masterCode)
    masterData.value = data
    Object.assign(boardForm, data)
  } catch { toast.error('게시판 정보 로드 실패') }
  finally { loading.value = false }
}

const loadCategories = async () => {
  catLoading.value = true
  try { categories.value = await BoardCategoryService.getCategories(slug, masterCode) }
  catch { toast.error('카테고리 로드 실패') }
  finally { catLoading.value = false }
}

const loadContents = async (page = 1) => {
  contentsLoading.value = true
  contentPage.value = page
  try {
    const res = await BoardContentService.getContents(slug, masterCode, page, 10, keyword.value)
    contents.value = res.items
    contentTotalPages.value = Math.ceil(res.totalCount / res.pageSize)
  } catch { toast.error('게시물 로드 실패') }
  finally { contentsLoading.value = false }
}

// ── Board ────────────────────────────────────────────────────────
const saveBoard = async () => {
  boardSaving.value = true
  try {
    await BoardMasterService.saveMaster(slug, boardForm)
    toast.success('설정 저장 완료')
  } catch { toast.error('저장 실패') }
  finally { boardSaving.value = false }
}

// ── Category ─────────────────────────────────────────────────────
const openCatModal = () => {
  Object.assign(catForm, { category: '', title: '', sortNo: categories.value.length + 1 })
  showCatModal.value = true
}

const saveCategory = async () => {
  if (!catForm.category || !catForm.title) { toast.warn('필수 항목을 입력해주세요.'); return }
  catSaving.value = true
  try {
    await BoardCategoryService.registCategory(slug, { ...catForm, masterCode })
    toast.success('카테고리 추가 완료')
    showCatModal.value = false
    await loadCategories()
  } catch { toast.error('카테고리 추가 실패') }
  finally { catSaving.value = false }
}

const deleteCat = async (cat: BoardCategory) => {
  if (!confirm(`"${cat.title}" 카테고리를 삭제하시겠습니까?`)) return
  try {
    await BoardCategoryService.deleteCategory(slug, masterCode, cat.category)
    toast.success('카테고리 삭제 완료')
    await loadCategories()
  } catch { toast.error('삭제 실패') }
}

// ── Content ──────────────────────────────────────────────────────
const removeContent = async (contentId: string) => {
  if (!confirm('이 게시물을 삭제하시겠습니까?')) return
  try {
    await BoardContentService.removeContent(slug, contentId)
    toast.success('게시물 삭제 완료')
    await loadContents(contentPage.value)
  } catch { toast.error('삭제 실패') }
}

onMounted(async () => {
  await Promise.all([loadMaster(), loadCategories(), loadContents()])
})
</script>

<style scoped>
.admin-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; }
.bc-link { color: var(--accent); text-decoration: none; font-size: 0.875rem; }
.bc-sep { color: rgba(255,255,255,0.3); font-size: 0.875rem; }
.bc-current { color: rgba(255,255,255,0.5); font-size: 0.875rem; }

.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
.section-header-row { display: flex; align-items: center; justify-content: space-between; }
.section-h3 { font-size: 1.05rem; font-weight: 700; color: white; gap: 0.5rem; display: flex; align-items: center; }

/* ListGroup */
.list-group {
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
  list-style: none;
  padding: 0; margin: 0;
}
.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: background 0.2s;
}
.list-group-item:last-child { border-bottom: none; }
.list-group-item:hover { background: rgba(255,255,255,0.04); }

.list-item-main { display: flex; align-items: center; gap: 0.75rem; }
.list-item-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: oklch(75% 0.15 200);
  flex-shrink: 0;
}
.list-item-title { color: rgba(255,255,255,0.85); font-size: 0.9rem; font-weight: 600; margin: 0; }
.list-item-sub { color: rgba(255,255,255,0.35); font-size: 0.78rem; margin: 2px 0 0; display: flex; align-items: center; }
.list-group-empty { padding: 1.5rem; text-align: center; color: rgba(255,255,255,0.3); font-size: 0.875rem; }

.code-tag-sm {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
  padding: 1px 6px; border-radius: 4px; font-size: 0.72rem; color: rgba(255,255,255,0.5);
}
.input-sm { width: 180px; }
.btn-xs { width: 28px; height: 28px; padding: 0; }
</style>
