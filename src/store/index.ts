import { createStore } from 'vuex'
import type { ITask } from '@/interfaces'

export interface State {
  tasks: ITask[]
}

export default createStore<State>({
  state: {
    tasks: [] as ITask[],
  },
  mutations: {
    SET_TASKS(state, tasks: ITask[]) {
      state.tasks = tasks
    },
    SET_ADD_TASK(state, task: ITask) {
      state.tasks.unshift(task)
    },
    SET_REMOVE_TASK(state, id: number) {
      state.tasks = state.tasks.filter((t) => t.id !== id)
    },
    SET_TOGGLE_TASK(state, id: number) {
      state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    },
  },
  getters: {
    getTasks: (state) => state.tasks,
    getCompletedTasks: (state) => state.tasks.filter((task) => task.completed),
    getNotCompletedTasks: (state) => state.tasks.filter((task) => !task.completed),
  },
  actions: {
    addTask({ commit }, task: ITask) {
      commit('SET_ADD_TASK', task)
    },
    addTasks({ commit }, tasks: ITask[]) {
      commit('SET_TASKS', tasks)
    },
    toggleTask({ commit }, id: number) {
      commit('SET_TOGGLE_TASK', id)
    },
    removeTask({ commit }, id: number) {
      commit('SET_REMOVE_TASK', id)
    },
  },
})
