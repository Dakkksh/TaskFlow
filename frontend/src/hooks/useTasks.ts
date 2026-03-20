import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Task, TasksResponse, TaskFilters } from '@/types';

export const useTasks = () => {
  const [tasksData, setTasksData] = useState<TasksResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters: TaskFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));

      const { data } = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
      setTasksData(data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch tasks';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (payload: Partial<Task>) => {
    const { data } = await api.post('/tasks', payload);
    const newTask = data.task as Task;

    // ✅ Add new task to local state instantly
    setTasksData((prev) => {
      if (!prev) return { tasks: [newTask], pagination: { page: 1, limit: 1000, total: 1, totalPages: 1, hasNext: false, hasPrev: false } };
      return {
        ...prev,
        tasks: [newTask, ...prev.tasks],
        pagination: { ...prev.pagination, total: prev.pagination.total + 1 },
      };
    });

    return newTask;
  }, []);

  const updateTask = useCallback(async (id: string, payload: Partial<Task>) => {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    const updatedTask = data.task as Task;

    // ✅ Update task in local state instantly
    setTasksData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? updatedTask : t)),
      };
    });

    return updatedTask;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await api.delete(`/tasks/${id}`);

    // ✅ Remove task from local state instantly
    setTasksData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
        pagination: { ...prev.pagination, total: prev.pagination.total - 1 },
      };
    });
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const { data } = await api.post(`/tasks/${id}/toggle`);
    const updatedTask = data.task as Task;

    // ✅ Update task status in local state instantly
    setTasksData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? updatedTask : t)),
      };
    });

    return updatedTask;
  }, []);

  return {
    tasksData,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};