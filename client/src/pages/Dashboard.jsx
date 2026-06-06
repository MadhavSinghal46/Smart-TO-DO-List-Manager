import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Toast from '../components/Toast';
import { taskAPI } from '../services/api';

const Dashboard = () => {
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      const { data } = await taskAPI.getAll();
      setPending(data.pending);
      setCompleted(data.completed);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    try {
      await taskAPI.create(formData);
      showToast('Task created successfully.');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task.', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await taskAPI.update(editingTask._id, formData);
      showToast('Task updated successfully.');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task.', 'error');
    }
  };

  const handleComplete = async (id) => {
    try {
      await taskAPI.complete(id);
      showToast('Task marked as completed.');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete task.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(id);
      showToast('Task deleted successfully.');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200" role="alert">
            {error}
          </div>
        )}

        <div className="mb-8">
          {editingTask ? (
            <TaskForm
              initialData={editingTask}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
              submitLabel="Save Changes"
            />
          ) : (
            <TaskForm onSubmit={handleCreate} />
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Pending Tasks
                  <span className="ml-2 text-sm font-normal text-slate-500">({pending.length})</span>
                </h2>
              </div>
              <TaskList
                tasks={pending}
                emptyMessage="No pending tasks. Add one above to get started!"
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onComplete={handleComplete}
              />
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Completed Tasks
                  <span className="ml-2 text-sm font-normal text-slate-500">({completed.length})</span>
                </h2>
              </div>
              <TaskList
                tasks={completed}
                emptyMessage="No completed tasks yet. Finish a pending task to see it here!"
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onComplete={handleComplete}
              />
            </section>
          </div>
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default Dashboard;
