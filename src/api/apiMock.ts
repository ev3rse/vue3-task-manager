import type { ITask, IApiResponse, ITaskApi, IApiError } from '@/interfaces'

interface IApiMockConfig {
  delay: number
  errorProbability: number
}

const defaultConfig: IApiMockConfig = {
  delay: 300,
  errorProbability: 0,
}

class ApiMock implements ITaskApi {
  private tasks: ITask[]
  private config: IApiMockConfig

  constructor(initialTasks: ITask[] = [], config: Partial<IApiMockConfig> = {}) {
    this.tasks = [...initialTasks]
    this.config = { ...defaultConfig, ...config }
  }

  private async simulateRequest<T>(data: T): Promise<IApiResponse<T>> {
    await new Promise((resolve) => setTimeout(resolve, this.config.delay))

    if (Math.random() < this.config.errorProbability) {
      throw this.createError('Random API error', 500)
    }

    return {
      data,
      status: 200,
      timestamp: new Date(),
    }
  }

  private createError(message: string, status: number): IApiError {
    return {
      message,
      status,
      code: `ERR_${status}`,
    }
  }

  async getTasks(): Promise<IApiResponse<ITask[]>> {
    return this.simulateRequest([...this.tasks])
  }

  async addTask(title: string): Promise<IApiResponse<ITask>> {
    if (!title.trim()) {
      throw this.createError('Title cannot be empty', 400)
    }

    const newTask: ITask = {
      id: Date.now(),
      title,
      completed: false,
    }

    this.tasks.unshift(newTask)
    return this.simulateRequest(newTask)
  }

  async toggleTask(id: number): Promise<IApiResponse<ITask>> {
    const task = this.tasks.find((t) => t.id === id)
    if (!task) throw this.createError('Task not found', 404)

    task.completed = !task.completed
    return this.simulateRequest({ ...task })
  }

  async removeTask(id: number): Promise<IApiResponse<number>> {
    const initialLength = this.tasks.length
    this.tasks = this.tasks.filter((t) => t.id !== id)

    if (this.tasks.length === initialLength) {
      throw this.createError('Task not found', 404)
    }

    return this.simulateRequest(id)
  }

  async searchTasks(query: string): Promise<IApiResponse<ITask[]>> {
    const filtered = this.tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase()),
    )
    return this.simulateRequest(filtered)
  }
}

export const taskApi = new ApiMock([
  { id: 1, title: 'Example task 1', completed: false, createdAt: new Date() },
  { id: 2, title: 'Example task 2', completed: false, createdAt: new Date() },
  { id: 3, title: 'Example task 3', completed: true, createdAt: new Date(Date.now() - 86400000) },
  { id: 4, title: 'Example task 4', completed: true, createdAt: new Date(Date.now() - 86400000) },
  { id: 5, title: 'Example task 5', completed: true, createdAt: new Date(Date.now() - 86400000) },
  {
    id: 6,
    title: 'Example task 6',
    completed: false,
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 7,
    title: 'Example task 7',
    completed: false,
    createdAt: new Date(Date.now() - 172800000),
  },
])
