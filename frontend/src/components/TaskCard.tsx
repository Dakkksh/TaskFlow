'use client';
import { Task } from '@/types';
import { format } from 'date-fns';
import styles from './TaskCard.module.css';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const PRIORITY_LABEL: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }: Props) {
  const statusClass = task.status.toLowerCase().replace('_', '_');
  const priorityClass = task.priority.toLowerCase();

  return (
    <div className={`${styles.card} ${task.status === 'COMPLETED' ? styles.completed : ''}`}>
      <div className={styles.topRow}>
        <span className={`badge badge-${statusClass}`}>{STATUS_LABEL[task.status]}</span>
        <span className={`badge badge-${priorityClass}`}>{PRIORITY_LABEL[task.priority]}</span>
      </div>

      <h3 className={styles.title}>{task.title}</h3>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      {task.dueDate && (
        <p className={styles.dueDate}>
          Due: <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
        </p>
      )}

      <div className={styles.actions}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onToggle(task.id)}
          title="Cycle status"
        >
          ↻ Toggle
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
