<template>
  <div>
    <!-- Breadcrumb -->
    <div class="admin-breadcrumb">
      <router-link to="/admin/sites" class="bc-link">사이트 목록</router-link>
      <span class="bc-sep">›</span>
      <span class="bc-current">{{ site?.title ?? slug }}</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4 mt-4">
      <div class="skeleton-row h-32"></div>
      <div class="skeleton-row h-48"></div>
    </div>

    <template v-else-if="site">
      <!-- Site Meta Card -->
      <div class="admin-card site-meta-card mb-6">
        <div class="section-header-row mb-4">
          <h3 class="section-h3">사이트 정보</h3>
          <button class="btn-secondary btn-sm" @click="openEditSiteModal">
            <i class="fa-solid fa-pen mr-1"></i>정보 수정
          </button>
        </div>
        <div class="site-meta-layout">
          <!-- Thumbnail -->
          <div v-if="site.thumbnail" class="site-thumbnail-wrap">
            <img :src="site.thumbnail" :alt="site.title" class="site-thumbnail" />
          </div>
          <div v-else class="site-thumbnail-placeholder">
            <i class="fa-solid fa-image text-3xl opacity-30"></i>
          </div>
          <!-- Meta Grid -->
          <div class="site-meta-grid">
            <div class="meta-item">
              <span class="meta-label">사이트명</span>
              <span class="meta-value text-white font-bold">{{ site.title }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Slug</span>
              <code class="code-tag">{{ site.slug }}</code>
            </div>
            <div class="meta-item">
              <span class="meta-label">설명</span>
              <span class="meta-value">{{ site.description || '-' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">키워드</span>
              <span class="meta-value">{{ site.keywords || '-' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">상태</span>
              <span class="badge" :class="site.isActive ? 'badge-green' : 'badge-gray'">
                {{ site.isActive ? '활성' : '비활성' }}
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">생성일</span>
              <span class="meta-value">{{ site.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Board Masters Section -->
      <div class="admin-card">
        <div class="section-header-row">
          <h3 class="section-h3">게시판 관리</h3>
          <button class="btn-primary btn-sm" @click="openBoardModal()">
            <i class="fa-solid fa-plus mr-1"></i>게시판 추가
          </button>
        </div>

        <div v-if="boardLoading" class="space-y-2 mt-4">
          <div v-for="i in 3" :key="i" class="skeleton-row h-14"></div>
        </div>

        <table v-else class="admin-table mt-4">
          <thead>
            <tr>
              <th>게시판명</th>
              <th>유형</th>
              <th>섹션</th>
              <th>순번</th>
              <th>상태</th>
              <th class="text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="board in boards" :key="board.masterCode">
              <td>
                <button class="board-name-btn" @click="goBoard(board.masterCode)">
                  <i class="fa-solid mr-2 opacity-60" :class="board.icon || 'fa-list'"></i>
                  {{ board.title }}
                </button>
              </td>
              <td><span class="badge badge-blue">{{ board.boardType }}</span></td>
              <td class="text-muted">{{ board.section }}</td>
              <td class="text-muted">{{ board.sortNo }}</td>
              <td>
                <span class="badge" :class="board.isActive ? 'badge-green' : 'badge-gray'">
                  {{ board.isActive ? '활성' : '비활성' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon btn-yellow" @click="openBoardModal(board)" title="수정">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn-icon btn-red" @click="confirmDeleteBoard(board)" title="삭제">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="boards.length === 0">
              <td colspan="6" class="empty-row">등록된 게시판이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Board Modal -->
    <transition name="modal-fade">
      <div v-if="showBoardModal" class="modal-backdrop" @click.self="showBoardModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h3>{{ editBoard ? '게시판 수정' : '게시판 추가' }}</h3>
            <button class="modal-close" @click="showBoardModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <label>게시판 코드 <span class="required">*</span></label>
              <input v-model="boardForm.masterCode" type="text" class="form-input" placeholder="NOTICE" :disabled="!!editBoard" />
            </div>
            <div class="form-row">
              <label>게시판명 <span class="required">*</span></label>
              <input v-model="boardForm.title" type="text" class="form-input" placeholder="공지사항" />
            </div>
            <div class="form-row">
              <label>유형</label>
              <select v-model="boardForm.boardType" class="form-input">
                <option value="Normal">Normal (일반)</option>
                <option value="Gallery">Gallery (갤러리)</option>
                <option value="Question">Question (문의/Q&A)</option>
                <option value="OnlyManager">OnlyManager (관리자 전용)</option>
              </select>
            </div>
            <div class="form-row">
              <label>섹션</label>
              <input v-model="boardForm.section" type="text" class="form-input" placeholder="main" />
            </div>
            <div class="form-row">
              <label>아이콘 (FA 클래스)</label>
              <input v-model="boardForm.icon" type="text" class="form-input" placeholder="fa-bell" />
            </div>
            <div class="form-row">
              <label>설명</label>
              <input v-model="boardForm.description" type="text" class="form-input" placeholder="게시판 설명" />
            </div>
            <div class="form-row">
              <label>순번</label>
              <input v-model.number="boardForm.sortNo" type="number" class="form-input" />
            </div>
            <div class="form-row form-check">
              <label class="check-label">
                <input type="checkbox" v-model="boardForm.isActive" class="form-checkbox" />
                활성화
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="showBoardModal = false">취소</button>
            <button class="btn-primary" :disabled="boardSaving" @click="saveBoard">
              {{ boardSaving ? '저장 중...' : '저장' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit Site Modal -->
    <transition name="modal-fade">
      <div v-if="showEditSiteModal" class="modal-backdrop" @click.self="showEditSiteModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h3>사이트 정보 수정</h3>
            <button class="modal-close" @click="showEditSiteModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <label>사이트명 <span class="required">*</span></label>
              <input v-model="siteForm.title" type="text" class="form-input" />
            </div>
            <div class="form-row">
              <label>Slug</label>
              <input :value="siteForm.slug" type="text" class="form-input" disabled />
            </div>
            <div class="form-row">
              <label>설명</label>
              <input v-model="siteForm.description" type="text" class="form-input" />
            </div>
            <div class="form-row">
              <label>썸네일 URL</label>
              <input v-model="siteForm.thumbnail" type="text" class="form-input" placeholder="https://example.com/thumbnail.png" />
            </div>
            <div class="form-row">
              <label>키워드</label>
              <input v-model="siteForm.keywords" type="text" class="form-input" />
            </div>
            <div class="form-row form-check">
              <label class="check-label">
                <input type="checkbox" v-model="siteForm.isActive" class="form-checkbox" />
                활성화
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="showEditSiteModal = false">취소</button>
            <button class="btn-primary" :disabled="siteSaving" @click="saveSiteEdit">
              {{ siteSaving ? '저장 중...' : '저장' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Board Confirm -->
    <transition name="modal-fade">
      <div v-if="deleteBoardTarget" class="modal-backdrop" @click.self="deleteBoardTarget = null">
        <div class="modal-box modal-sm">
          <div class="modal-header">
            <h3>게시판 삭제</h3>
            <button class="modal-close" @click="deleteBoardTarget = null">✕</button>
          </div>
          <div class="modal-body">
            <p class="text-white/70"><strong>{{ deleteBoardTarget.title }}</strong> 게시판을 삭제하시겠습니까?</p>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="deleteBoardTarget = null">취소</button>
            <button class="btn-danger" :disabled="boardSaving" @click="deleteBoard">삭제</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SiteService, BoardMasterService, type SiteItem, type BoardMaster } from '@/api/AdminService'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const slug = route.params.slug as string
const site = ref<SiteItem | null>(null)
const boards = ref<BoardMaster[]>([])
const loading = ref(true)
const boardLoading = ref(true)

// ── Site Edit ─────────────────────────────────────────────────────
const showEditSiteModal = ref(false)
const siteSaving = ref(false)
const siteForm = reactive<Partial<SiteItem>>({ title: '', slug: '', description: '', thumbnail: '', keywords: '', isActive: true })

const openEditSiteModal = () => {
  if (site.value) Object.assign(siteForm, site.value)
  showEditSiteModal.value = true
}

const saveSiteEdit = async () => {
  if (!siteForm.title) { toast.warn('입력 오류', '사이트명은 필수입니다.'); return }
  siteSaving.value = true
  try {
    await SiteService.updateSite(siteForm)
    toast.success('수정 완료', '사이트 정보가 업데이트되었습니다.')
    showEditSiteModal.value = false
    await loadSite()
  } catch { toast.error('저장 실패') }
  finally { siteSaving.value = false }
}

// ── Board ─────────────────────────────────────────────────────────
const showBoardModal = ref(false)
const editBoard = ref<BoardMaster | null>(null)
const deleteBoardTarget = ref<BoardMaster | null>(null)
const boardSaving = ref(false)
const boardForm = reactive<Partial<BoardMaster>>({
  masterCode: '', title: '', boardType: 'Normal', section: 'main', icon: '', description: '', sortNo: 1, isActive: true
})

const goBoard = (masterCode: string) => router.push(`/admin/sites/${slug}/board/${masterCode}`)

const loadSite = async () => {
  loading.value = true
  try { site.value = await SiteService.getSite(slug) }
  catch { toast.error('사이트 로드 실패') }
  finally { loading.value = false }
}

const loadBoards = async () => {
  boardLoading.value = true
  try { boards.value = await BoardMasterService.getMasters(slug) }
  catch { toast.error('게시판 목록 로드 실패') }
  finally { boardLoading.value = false }
}

const openBoardModal = (board?: BoardMaster) => {
  editBoard.value = board ?? null
  if (board) Object.assign(boardForm, board)
  else Object.assign(boardForm, { masterCode: '', title: '', boardType: 'Normal', section: 'main', icon: '', description: '', sortNo: 1, isActive: true })
  showBoardModal.value = true
}

const saveBoard = async () => {
  if (!boardForm.masterCode || !boardForm.title) { toast.warn('입력 오류', '코드와 게시판명은 필수입니다.'); return }
  boardSaving.value = true
  try {
    await BoardMasterService.saveMaster(slug, boardForm)
    toast.success(editBoard.value ? '게시판 수정 완료' : '게시판 추가 완료')
    showBoardModal.value = false
    await loadBoards()
  } catch { toast.error('저장 실패') }
  finally { boardSaving.value = false }
}

const confirmDeleteBoard = (board: BoardMaster) => { deleteBoardTarget.value = board }

const deleteBoard = async () => {
  if (!deleteBoardTarget.value) return
  boardSaving.value = true
  try {
    await BoardMasterService.deleteMaster(slug, deleteBoardTarget.value.masterCode)
    toast.success('게시판 삭제 완료')
    deleteBoardTarget.value = null
    await loadBoards()
  } catch { toast.error('삭제 실패') }
  finally { boardSaving.value = false }
}

onMounted(async () => {
  await Promise.all([loadSite(), loadBoards()])
})
</script>

<style scoped>
.admin-breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; }
.bc-link { color: var(--accent); text-decoration: none; font-size: 0.875rem; }
.bc-sep { color: rgba(255,255,255,0.3); font-size: 0.875rem; }
.bc-current { color: rgba(255,255,255,0.5); font-size: 0.875rem; }

.site-meta-layout { display: flex; gap: 1.5rem; align-items: flex-start; }
.site-thumbnail-wrap { flex-shrink: 0; }
.site-thumbnail { width: 120px; height: 90px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); }
.site-thumbnail-placeholder {
  width: 120px; height: 90px; border-radius: 10px;
  border: 1px dashed rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.3); flex-shrink: 0;
}
.site-meta-grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; }
.meta-item { display: flex; flex-direction: column; gap: 4px; }
.meta-label { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.06em; }
.meta-value { color: rgba(255,255,255,0.7); font-size: 0.9rem; }

.section-header-row { display: flex; align-items: center; justify-content: space-between; }
.section-h3 { font-size: 1.1rem; font-weight: 700; color: white; }

.board-name-btn {
  background: none; border: none; color: oklch(78% 0.1 200);
  cursor: pointer; font-size: 0.9rem; font-weight: 600; text-align: left;
  padding: 0; transition: color 0.2s;
}
.board-name-btn:hover { color: oklch(90% 0.12 200); text-decoration: underline; }
</style>
