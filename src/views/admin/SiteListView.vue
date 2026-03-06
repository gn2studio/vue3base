<template>
  <div>
    <!-- Page Header -->
    <div class="admin-page-header">
      <h2 class="page-h2">사이트 목록</h2>
      <button class="btn-primary" @click="openModal()">
        <i class="fa-solid fa-plus mr-2"></i>사이트 추가
      </button>
    </div>

    <!-- Table -->
    <div class="admin-card">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="skeleton-row"></div>
      </div>

      <!-- Table -->
      <table v-else class="admin-table">
        <thead>
          <tr>
            <th>사이트명</th>
            <th>Slug</th>
            <th>설명</th>
            <th>상태</th>
            <th>생성일</th>
            <th class="text-right">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="site in sites" :key="site.siteId">
            <td class="font-semibold text-white">{{ site.title }}</td>
            <td><code class="code-tag">{{ site.slug }}</code></td>
            <td class="text-muted">{{ site.description }}</td>
            <td>
              <span class="badge" :class="site.isActive ? 'badge-green' : 'badge-gray'">
                {{ site.isActive ? '활성' : '비활성' }}
              </span>
            </td>
            <td class="text-muted">{{ site.createdAt }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon btn-blue" @click="goDetail(site.slug)" title="상세">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i>
                </button>
                <button class="btn-icon btn-yellow" @click="openModal(site)" title="수정">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon btn-red" @click="confirmDelete(site)" title="삭제">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!!sites && sites.length === 0">
            <td colspan="6" class="empty-row">등록된 사이트가 없습니다.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6">
        <Gn2Pagination :current-page="curPage" :total-pages="totalPages" @change="loadSites" />
      </div>
    </div>

    <!-- Site Form Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h3>{{ editTarget ? '사이트 수정' : '사이트 추가' }}</h3>
            <button class="modal-close" @click="showModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <label>사이트명 <span class="required">*</span></label>
              <input v-model="form.title" type="text" class="form-input" placeholder="GN2Studio 공식 사이트" />
            </div>
            <div class="form-row">
              <label>Slug <span class="required">*</span></label>
              <input v-model="form.slug" type="text" class="form-input" placeholder="gn2studio" :disabled="!!editTarget" />
            </div>
            <div class="form-row">
              <label>설명</label>
              <input v-model="form.description" type="text" class="form-input" placeholder="사이트 간단 설명" />
            </div>
            <div class="form-row">
              <label>썸네일 URL</label>
              <input v-model="form.thumbnail" type="text" class="form-input" placeholder="https://example.com/thumbnail.png" />
            </div>
            <div class="form-row">
              <label>키워드</label>
              <input v-model="form.keywords" type="text" class="form-input" placeholder="vue,typescript,admin" />
            </div>
            <div class="form-row form-check">
              <label class="check-label">
                <input type="checkbox" v-model="form.isActive" class="form-checkbox" />
                활성화
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="showModal = false">취소</button>
            <button class="btn-primary" :disabled="saving" @click="saveSite">
              {{ saving ? '저장 중...' : '저장' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirm Modal -->
    <transition name="modal-fade">
      <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <div class="modal-box modal-sm">
          <div class="modal-header">
            <h3>사이트 삭제</h3>
            <button class="modal-close" @click="deleteTarget = null">✕</button>
          </div>
          <div class="modal-body">
            <p class="text-white/70"><strong class="text-white">{{ deleteTarget.title }}</strong> 사이트를 삭제하시겠습니까?</p>
            <p class="text-red-400 text-sm mt-2">이 작업은 되돌릴 수 없습니다.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="deleteTarget = null">취소</button>
            <button class="btn-danger" :disabled="saving" @click="deleteSite">
              {{ saving ? '삭제 중...' : '삭제' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { SiteService, type SiteItem } from '@/api/AdminService'
import { useToast } from '@/composables/useToast'
import Gn2Pagination from '@/components/Gn2Pagination.vue'

const router = useRouter()
const toast = useToast()

const sites = ref<SiteItem[]>([])
const loading = ref(false)
const curPage = ref(1)
const totalPages = ref(1)

const showModal = ref(false)
const editTarget = ref<SiteItem | null>(null)
const deleteTarget = ref<SiteItem | null>(null)
const saving = ref(false)

const form = reactive<Partial<SiteItem>>({ title: '', slug: '', description: '', keywords: '', isActive: true })

const loadSites = async (page = 1) => {
  loading.value = true
  curPage.value = page
  try {
    const result = await SiteService.getSites(page, 10)
    sites.value = result.items
    totalPages.value = Math.ceil(result.totalCount / result.pageSize)
  } catch (e) {
    toast.error('목록 로드 실패', '사이트 목록을 가져오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

const openModal = (site?: SiteItem) => {
  editTarget.value = site ?? null
  if (site) Object.assign(form, site)
  else Object.assign(form, { title: '', slug: '', description: '', thumbnail: '', keywords: '', isActive: true })
  showModal.value = true
}

const saveSite = async () => {
  if (!form.title || !form.slug) { toast.warn('입력 오류', '필수 항목을 입력해주세요.'); return }
  saving.value = true
  try {
    if (editTarget.value) await SiteService.updateSite(form)
    else await SiteService.registSite(form)
    toast.success(editTarget.value ? '수정 완료' : '등록 완료')
    showModal.value = false
    await loadSites()
  } catch {
    toast.error('저장 실패', '다시 시도해주세요.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (site: SiteItem) => { deleteTarget.value = site }

const deleteSite = async () => {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await SiteService.deleteSite(deleteTarget.value.siteId)
    toast.success('삭제 완료', `${deleteTarget.value.title} 사이트가 삭제되었습니다.`)
    deleteTarget.value = null
    await loadSites()
  } catch {
    toast.error('삭제 실패')
  } finally {
    saving.value = false
  }
}

const goDetail = (slug: string) => router.push(`/admin/sites/${slug}`)

onMounted(() => loadSites())
</script>

<style scoped>
.admin-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.page-h2 { font-size: 1.4rem; font-weight: 800; color: white; }
</style>
