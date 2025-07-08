"use client"
import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task } from '@/types/task.type';
import { v4 as uuidv4 } from 'uuid';

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  filterTasks: (filter: 'all' | 'completed' | 'pending') => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const addTask = useCallback((text: string) => {
    if (text.trim() === '') return;
    setTasks((prev) => [
      ...prev,
      { id: uuidv4(), text: text.trim(), completed: false },
    ]);
  }, [setTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, [setTasks]);

  const filterTasks = useCallback(
    (filter: 'all' | 'completed' | 'pending') => {
      if (filter === 'all') return tasks;
      return tasks.filter((task) =>
        filter === 'completed' ? task.completed : !task.completed
      );
    },
    [tasks]
  );

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, toggleTask, deleteTask, filterTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}