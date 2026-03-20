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
    return data.task as Task;
  }, []);

  const updateTask = useCallback(async (id: string, payload: Partial<Task>) => {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    return data.task as Task;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await api.delete(`/tasks/${id}`);
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const { data } = await api.post(`/tasks/${id}/toggle`);
    const updatedTask = data.task as Task;

    // ✅ Update local state immediately — no refetch needed
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