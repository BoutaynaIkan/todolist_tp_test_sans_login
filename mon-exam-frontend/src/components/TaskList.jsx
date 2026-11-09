
import TaskItem from './TaskItem'

function TaskList({ tasks, onDeleteTask, onCheckboxChange, onUpdateTask, categories, isUpdatingTask, isDeletingTask, credentials }) {
    if (tasks.length === 0) {
        return <p className='task-text'>Aucune tâche à afficher.</p>
    }   
  return (
    <ul className="task-list" data-cy="todo-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} onCheckboxChange={onCheckboxChange} onUpdateTask={onUpdateTask} categories={categories} isUpdatingTask={isUpdatingTask} isDeletingTask={isDeletingTask} />
      ))}
    </ul>
  )
}

export default TaskList