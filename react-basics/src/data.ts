export type Task = {                        
  id: number
  title: string
  completed: boolean
}

export const tasks: Task[] = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Understand useState', completed: true },
  { id: 3, title: 'render lists with map', completed: false },
]