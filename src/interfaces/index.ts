export interface ITask {
  id: number
  title: string
  completed: boolean
  createdAt?: Date
}

export interface IApiResponse<T> {
  data: T
  status: number
  timestamp: Date
}

export interface IApiError {
  message: string
  status: number
  code?: string
}

export type TaskApiResponse = IApiResponse<ITask | ITask[] | number>
export type TaskApiError = IApiError

export interface ITaskApi {
  getTasks(): Promise<IApiResponse<ITask[]>>
  addTask(title: string): Promise<IApiResponse<ITask>>
  toggleTask(id: number): Promise<IApiResponse<ITask>>
  removeTask(id: number): Promise<IApiResponse<number>>
  searchTasks(query: string): Promise<IApiResponse<ITask[]>>
}
export interface IAppError {
  message: string;
  code?: string;
  status?: number;
}
