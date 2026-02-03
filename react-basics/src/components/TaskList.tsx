import { Task } from '../data'

type TaskListProps = {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          {task.title} {task.completed ? '✅' : '❌'}
        </li>
      ))}
    </ul>
  )
}