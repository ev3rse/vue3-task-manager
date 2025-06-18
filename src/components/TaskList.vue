<template>
  <div class="task-list">
    <TransitionGroup name="task-list" tag="div">
      <TaskItem
        v-for="(task, index) in tasks"
        :key="task.id"
        :index="index"
        :task="task"
        :disabled="loading"
        @toggle-task="handleToggleTask"
        @remove-task="handleRemoveTask"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useStore } from 'vuex'
import { taskApi } from '@/api/apiMock'
import type { ITask } from '@/interfaces'
import TaskItem from './TaskItem.vue'

defineProps<{
  tasks: ITask[]
  loading: boolean
}>()

const store = useStore()

const handleToggleTask = async (id: number) => {
  store.dispatch('toggleTask', id)

  try {
    await taskApi.toggleTask(id)
  } catch (e) {
    store.dispatch('toggleTask', id)
    console.error('Error:', e)
  }
}

const handleRemoveTask = async (id: number) => {
  try {
    await taskApi.removeTask(id)
    store.dispatch('removeTask', id)
  } catch (e) {
    console.error('API Error:', e)
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  width: 100%;
  margin-top: 1rem;

  &-item {
    display: inline-block;
    margin-right: 10px;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.5s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  &-move {
    transition: transform 0.5s ease;
  }
}
</style>
