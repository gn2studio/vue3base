<template>
  <div v-if="editor" class="editor-container">
    <div class="control-group">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        Italic
      </button>
      <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
        Paragraph
      </button>
    </div>

    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>안녕하세요! Tiptap 에디터입니다. 👋</p>',
  extensions: [
    StarterKit,
  ],
})
</script>

<style scoped>
/* 에디터 테두리와 기본 스타일 설정 */
.editor-container {
  border: 1px solid #ddd;
  padding: 10px;
}

.control-group {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

button {
  margin-right: 5px;
  padding: 4px 8px;
  cursor: pointer;
}

button.is-active {
  background: #000;
  color: #fff;
}

/* 에디터 내부 입력창 스타일 (중요) */
:deep(.tiptap) {
  min-height: 200px;
  outline: none;
}
</style>