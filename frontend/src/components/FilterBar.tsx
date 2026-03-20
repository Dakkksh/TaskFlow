'use client';
import { useRef, useState, useEffect } from 'react';
import { TaskFilters } from '@/types';
import styles from './FilterBar.module.css';

interface Props {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!filters.search) setSearch('');
  }, [filters.search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: val, page: 1 });
    }, 400);
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, status: e.target.value as TaskFilters['status'], page: 1 });
  };

  const handlePriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, priority: e.target.value as TaskFilters['priority'], page: 1 });
  };

  const handleClear = () => {
    setSearch('');
    onChange({ page: 1, limit: filters.limit });
  };

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className={styles.bar}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      <select value={filters.status || ''} onChange={handleStatus} className={styles.select}>
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select value={filters.priority || ''} onChange={handlePriority} className={styles.select}>
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      {hasFilters && (
        <button className="btn btn-ghost btn-sm" onClick={handleClear}>
          Clear
        </button>
      )}
    </div>
  );
}