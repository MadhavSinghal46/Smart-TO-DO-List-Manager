import { formatDateTime } from '../utils/formatDate';

const TaskCard = ({ task, onEdit, onDelete, onComplete, showActions = true }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <div
      className={`rounded-xl border p-4 transition-shadow hover:shadow-md ${
        isCompleted
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium ${
              isCompleted ? 'text-emerald-800 line-through' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className={`mt-1 text-sm ${isCompleted ? 'text-emerald-700' : 'text-slate-600'}`}>
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>Created: {formatDateTime(task.createdAt)}</span>
            {isCompleted && task.completedAt && (
              <span>Completed: {formatDateTime(task.completedAt)}</span>
            )}
          </div>
        </div>
        {showActions && !isCompleted && (
          <div className="flex flex-shrink-0 gap-2">
            <button
              onClick={() => onComplete(task._id)}
              title="Mark as complete"
              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(task)}
              title="Edit task"
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id)}
              title="Delete task"
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        {showActions && isCompleted && (
          <button
            onClick={() => onDelete(task._id)}
            title="Delete task"
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
