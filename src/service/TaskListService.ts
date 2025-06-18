import type { ITask } from '@/interfaces'

let mockTasks: ITask[] = [
  { id: 1, title: 'Example task 1', completed: false },
  { id: 2, title: 'Example task 2', completed: true },
  { id: 3, title: 'Example task 3', completed: false },
  { id: 4, title: 'Example task 4', completed: true },
  { id: 5, title: 'Example task 5', completed: false },
  { id: 6, title: 'Example task 6', completed: false },
  { id: 7, title: 'Example task 7', completed: true },
  { id: 8, title: 'Example task 8', completed: false },
  { id: 9, title: 'Example task 9', completed: false },
]

export const TaskListService = {
  async getTasks(): Promise<ITask[]> {
    return [...mockTasks]
  },

  async addTask(title: string): Promise<ITask> {
    const newTask: ITask = {
      id: Date.now(),
      title,
      completed: false,
    }
    mockTasks.unshift(newTask)
    return newTask
  },

  async toggleTask(id: number): Promise<ITask> {
    const task = mockTasks.find((t) => t.id === id)
    if (!task) throw new Error('Task not found')
    task.completed = !task.completed
    return task
  },

  async removeTask(id: number): Promise<number> {
    mockTasks = mockTasks.filter((t) => t.id !== id)
    return id
  },
}
