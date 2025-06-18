<template>
  <main>
    <div class="filters">
      <button @click="activeFilter = 'all'" :class="{ active: activeFilter === 'all' }">All</button>
      <button
        @click="activeFilter = 'notCompleted'"
        :class="{ active: activeFilter === 'notCompleted' }"
      >
        Active
      </button>
      <button @click="activeFilter = 'completed'" :class="{ active: activeFilter === 'completed' }">
        Completed
      </button>
    </div>

    <div>
      <AddTask @add-task="addTask" :loading="loading.addTask" />
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="loadTasks">Retry</button>
    </div>

    <div v-if="loading.tasks">
      <div class="loading-indicator">Loading tasks...</div>
    </div>
    <div v-else>
      <TaskList
        :tasks="filteredTasks"
        @toggle-task="toggleTaskStatus"
        @remove-task="removeTask"
        :loading="loading.taskAction"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import TaskList from '@/components/TaskList.vue'
import AddTask from '@/components/AddTask.vue'
import { taskApi } from '@/api/apiMock'
import type { ITask } from '@/interfaces'

type TaskFilter = 'all' | 'completed' | 'notCompleted'

const store = useStore()
const activeFilter = ref<TaskFilter>('all')
const error = ref<string | null>(null)
const loading = ref({
  tasks: false,
  addTask: false,
  taskAction: false,
})

const loadTasks = async () => {
  try {
    loading.value.tasks = true
    error.value = null
    const response = await taskApi.getTasks()
    store.dispatch('addTasks', response.data)
  } catch (e) {
    error.value = 'Failed to load tasks'
    console.error('API Error:', e)
  } finally {
    loading.value.tasks = false
  }
}

const allTasks = computed<ITask[]>(() => store.getters.getTasks)
const completedTasks = computed<ITask[]>(() => store.getters.getCompletedTasks)
const notCompletedTasks = computed<ITask[]>(() => store.getters.getNotCompletedTasks)

const filteredTasks = computed<ITask[]>(() => {
  switch (activeFilter.value) {
    case 'completed':
      return completedTasks.value
    case 'notCompleted':
      return notCompletedTasks.value
    default:
      return allTasks.value
  }
})

const addTask = async (title: string) => {
  if (!title.trim()) return

  try {
    loading.value.addTask = true
    error.value = null
    const response = await taskApi.addTask(title)
    store.dispatch('addTask', response.data.title)
  } catch (e) {
    error.value = 'Failed to add task'
    console.error('API Error:', e)
  } finally {
    loading.value.addTask = false
  }
}

const toggleTaskStatus = async (id: number) => {
  try {
    loading.value.taskAction = true
    await taskApi.toggleTask(id)
    store.dispatch('toggleTask', id)
  } catch (e) {
    error.value = 'Failed to update task'
    console.error('API Error:', e)
  } finally {
    loading.value.taskAction = false
  }
}

const removeTask = async (id: number) => {
  try {
    loading.value.taskAction = true
    await taskApi.removeTask(id)
    store.dispatch('removeTask', id)
  } catch (e) {
    error.value = 'Failed to delete task'
    console.error('API Error:', e)
  } finally {
    loading.value.taskAction = false
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<style lang="scss" scoped>
main {
  max-width: rem(400);
}

.filters {
  display: flex;
  justify-content: space-between;
  gap: rem(12);
  margin-bottom: rem(24);

  button {
    background: #f0f0f0;
    font-size: rem(16);
    font-weight: 500;
    border-radius: rem(4);
    border: rem(1) solid #ddd;
    padding: rem(8) rem(20);
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      background: #42b983;
      color: white;
      border-color: #42b983;
    }
  }
}

.error-message {
  background-color: #ffebee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #c62828;
  border-radius: rem(4);
  padding: rem(16);
  margin: rem(16) 0;

  button {
    background: #c62828;
    color: white;
    border: none;
    border-radius: rem(4);
    padding: rem(4) rem(8);
    cursor: pointer;
  }
}
</style>
