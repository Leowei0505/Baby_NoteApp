<template>
  <main class="page tasks-page">
    <header class="tasks-heading">
      <div>
        <p class="eyebrow">完成一個小目標，收下一枚印章 ♡</p>
        <h1>任務</h1>
      </div>
      <img src="/4.png" alt="" aria-hidden="true" />
    </header>

    <form class="task-composer" @submit.prevent="addNewTask">
      <label for="new-task-title">新增一個小任務</label>
      <div class="task-input-row">
        <input
          id="new-task-title"
          v-model="draftTitle"
          autocomplete="off"
          maxlength="60"
          placeholder="例如：今天喝足水"
        />
        <button class="task-add-button" type="submit" aria-label="新增任務">＋</button>
      </div>
    </form>

    <p v-if="notice" class="task-notice" role="status" aria-live="polite">
      {{ notice }}
      <RouterLink v-if="showPointsLink" to="/points">前往集點蓋章</RouterLink>
    </p>

    <section class="task-section" aria-labelledby="pending-tasks-title">
      <div class="task-section-heading">
        <h2 id="pending-tasks-title">待完成</h2>
        <span>{{ pendingTasks.length }} 項</span>
      </div>

      <p v-if="pendingTasks.length === 0" class="task-empty">
        還沒有待辦任務，新增一個小目標吧！
      </p>

      <ul v-else class="task-list">
        <li v-for="task in pendingTasks" :key="task.id" class="task-item">
          <span class="task-status-dot" aria-hidden="true"></span>
          <span class="task-title">{{ task.title }}</span>
          <button class="task-complete-button" type="button" @click="finishTask(task.id)">
            完成領章
          </button>
          <button
            class="task-delete-button"
            type="button"
            :aria-label="`刪除任務：${task.title}`"
            @click="removeTask(task.id)"
          >
            ×
          </button>
        </li>
      </ul>
    </section>

    <section v-if="completedTasks.length" class="task-section completed-section" aria-labelledby="completed-tasks-title">
      <div class="task-section-heading">
        <h2 id="completed-tasks-title">已完成</h2>
        <span>{{ completedTasks.length }} 項</span>
      </div>

      <ul class="task-list">
        <li v-for="task in completedTasks" :key="task.id" class="task-item is-completed">
          <span class="task-status-check" aria-label="已完成">✓</span>
          <span class="task-title">{{ task.title }}</span>
          <span class="task-stamp-badge">已獲章</span>
          <button
            class="task-delete-button"
            type="button"
            :aria-label="`刪除任務：${task.title}`"
            @click="removeTask(task.id)"
          >
            ×
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { babyAppData, completeTask, createTask, deleteTask } from '../composables/useBabyAppData'

const draftTitle = ref('')
const notice = ref('')
const showPointsLink = ref(false)
const pendingTasks = computed(() => babyAppData.tasks.filter((task) => !task.completed))
const completedTasks = computed(() => babyAppData.tasks.filter((task) => task.completed))

function addNewTask() {
  const result = createTask(draftTitle.value)
  showPointsLink.value = false

  if (!result.added) {
    notice.value = result.reason === 'empty' ? '請先輸入任務名稱。' : '目前無法保存，請確認裝置儲存空間。'
    return
  }

  draftTitle.value = ''
  notice.value = '已新增任務。'
}

function finishTask(id) {
  const result = completeTask(id)
  showPointsLink.value = result.completed

  if (result.completed) notice.value = '任務完成，獲得一枚待蓋章！'
  else if (result.reason === 'storage') notice.value = '目前無法保存，任務尚未完成，請再試一次。'
  else if (result.reason === 'completed') notice.value = '這項任務已完成並獲得過印章。'
  else notice.value = '找不到這項任務，請重新整理後再試。'
}

function removeTask(id) {
  if (deleteTask(id)) {
    notice.value = '已刪除任務。'
    showPointsLink.value = false
  } else {
    notice.value = '目前無法刪除，請再試一次。'
  }
}
</script>

<!-- 任務頁樣式獨立維護，與其他頁面互不干擾。 -->
<style scoped src="./TaskView.css"></style>
