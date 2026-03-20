'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFilters } from '@/types';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import FilterBar from '@/components/FilterBar';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { tasksData, loading, fetchTasks, createTask, updateTask, deleteTask, toggleTask } = useTasks();

  const [filters, setFilters] = useState<TaskFilters>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  // Fetch ALL tasks once on load — no filters sent to backend
  const loadTasks = useCallback(() => {
    fetchTasks({ limit: 1000 });
  }, [fetchTasks]);

  useEffect(() => {
    if (user) loadTasks();
  }, [user, loadTasks]);

  // Client-side filtering — no backend calls
  const filteredTasks = useMemo(() => {
    const all = tasksData?.tasks || [];
    return all.filter((task) => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(q) &&
            !(task.description?.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [tasksData?.tasks, filters]);

  const handleCreate = async (data: Partial<Task>) => {
    try {
      await createTask(data);
      toast.success('Task created!');
      setModalOpen(false);
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, data);
      toast.success('Task updated!');
      setEditingTask(null);
      setModalOpen(false);
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTask(id);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  if (authLoading) return null;

  const totalTasks = tasksData?.tasks.length || 0;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandIcon}>⬡</span>
          <span>TaskFlow</span>
        </div>
        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.navActive}`}>
            <span>▦</span> All Tasks
          </div>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>My Tasks</h1>
            <p className={styles.taskCount}>
              {filteredTasks.length} of {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            + New Task
          </button>
        </header>

        <FilterBar filters={filters} onChange={setFilters} />

        {loading ? (
          <div className={styles.emptyState}>
            <span className="text-muted mono">Loading tasks...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>◫</div>
            <p>{totalTasks === 0 ? 'No tasks yet' : 'No tasks match your filters'}</p>
            <span className="text-muted">
              {totalTasks === 0 ? 'Create your first task to get started' : 'Try clearing the filters'}
            </span>
          </div>
        ) : (
          <div className={styles.taskGrid}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          onSubmit={editingTask ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}