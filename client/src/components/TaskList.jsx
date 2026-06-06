import TaskCard from './TaskCard';

const TaskList = ({ tasks, emptyMessage, onEdit, onDelete, onComplete, showActions = true }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default TaskList;
