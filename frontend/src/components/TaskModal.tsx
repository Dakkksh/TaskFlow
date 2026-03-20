'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Task } from '@/types';
import styles from './TaskModal.module.css';

interface TaskFormData {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
}

interface Props {
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
}

export default function TaskModal({ task, onClose, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      reset({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    });
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <span className={styles.error}>{errors.title.message}</span>}
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              rows={3}
              placeholder="Add more details..."
              {...register('description')}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Priority</label>
              <select {...register('priority')}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {task && (
              <div className={styles.field}>
                <label>Status</label>
                <select {...register('status')}>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Due Date</label>
            <input type="date" {...register('dueDate')} />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
