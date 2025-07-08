'use client';

import { useState, useCallback } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Plus, Loader2 } from 'lucide-react';

export default function TaskForm() {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTask } = useTasks();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) {
        alert('Task cannot be empty');
        return;
      }

      setIsSubmitting(true);
      try {
        addTask(input);
        setInput('');
      } catch (error) {
        alert('Failed to add task');
      } finally {
        setIsSubmitting(false);
      }
    },
    [input, addTask]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full h-12 px-3 py-2 text-base border border-input bg-background rounded-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        className="w-full h-12 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={isSubmitting || !input.trim()}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </>
        )}
      </button>
    </form>
  );
}