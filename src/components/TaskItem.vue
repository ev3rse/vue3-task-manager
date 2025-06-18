<template>
  <div class="task-item">
    <div class="task-item__id">{{ index + 1 }}.</div>
    <div class="task-item__checkbox">
      <input
        class="form-check-input"
        type="checkbox"
        :checked="task.completed"
        :disabled="disabled"
        @change="handleToggle"
      />
    </div>
    <div class="task-item__title">
      <label
        :for="`checkboxitem-${task.id}`"
        :class="{ completed: task.completed, 'not-completed': !task.completed }"
      >
        {{ task.title }}
      </label>
    </div>
    <div class="task-item__btn">
      <button
        class="btn btn-danger btn-delete"
        type="button"
        :disabled="disabled"
        @click="$emit('remove-task', task.id)"
      >
        X
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { ITask } from '@/interfaces'

const props = defineProps({
  task: { type: Object as PropType<ITask>, required: true },
  index: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'toggle-task', id: number): void
  (e: 'remove-task', id: number): void
}>()

const handleToggle = () => {
  emit('toggle-task', props.task.id)
}
</script>

<style lang="scss" scoped>
.task-item {
  height: rem(50);
  display: grid;
  grid-template-columns: rem(20) rem(30) 1fr rem(40);
  gap: rem(10);
  align-items: center;
  padding: rem(8) 0;
  border-bottom: rem(1) solid #eee;

  &__title {
    label {
      cursor: pointer;
      user-select: none;

      &.completed {
        text-decoration: line-through;
        color: #888;
        font-style: italic;
      }

      &.not-completed {
        font-weight: 500;
      }
    }
  }

  &__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      cursor: pointer;
      width: rem(18);
      height: rem(18);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-delete {
      width: rem(30);
      height: rem(30);
      font-weight: bold;
      padding: rem(3) rem(8);
      border: none;
      border-radius: rem(4);
      background-color: #ff4444;
      color: white;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: darken(#ff4444, 10%);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  &__checkbox input:disabled,
  &__btn button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
