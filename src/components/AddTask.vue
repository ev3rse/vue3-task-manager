<template>
  <form @submit.prevent="handleSubmit" class="add-form">
    <div class="input-group">
      <input
        v-model="title"
        type="text"
        class="form-control"
        placeholder="Enter task title"
        :disabled="loading"
        @keydown.enter="handleSubmit"
      />
      <button class="btn btn-primary button-add" type="submit" :disabled="!titleValid || loading">
        <span v-if="!loading">Add</span>
        <span v-else class="spinner-border spinner-border-sm" role="status"></span>
      </button>
    </div>
    <small v-if="error" class="text-danger">{{ error }}</small>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { taskApi } from '@/api/apiMock'
import store from '@/store'

const title = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const titleValid = computed(() => title.value.trim().length > 0)

const handleSubmit = async () => {
  try {
    loading.value = true
    const response = await taskApi.addTask(title.value.trim())
    store.dispatch('addTask', response.data)
    title.value = ''
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.add-form {
  margin-bottom: rem(24);
}

.input-group {
  display: flex;
  margin-bottom: rem(4);

  .form-control {
    flex: 1;
    padding: rem(8) rem(16);
    border: rem(1) solid #ddd;
    border-radius: rem(4) 0 0 rem(4);
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #42b983;
    }

    &:disabled {
      background-color: #f5f5f5;
    }
  }

  .button-add {
    background-color: #42b983;
    color: white;
    border-radius: 0 rem(4) rem(4) 0;
    border: rem(1) solid #42b983;
    padding: rem(8) rem(24);
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background-color: darken(#42b983, 5%);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
  }
}

.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
}

.spinner-border {
  display: inline-block;
  width: rem(16);
  height: rem(16);
  vertical-align: text-bottom;
  border: rem(3) solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}
@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>
