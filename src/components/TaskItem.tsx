import { memo, useCallback } from 'react';
import { Task } from '@/types/task.type';
import { useTasks } from '@/contexts/TaskContext';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

function TaskItemComponent({ task }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTasks();

  const handleToggle = useCallback(() => toggleTask(task.id), [toggleTask, task.id]);
  const handleDelete = useCallback(() => deleteTask(task.id), [deleteTask, task.id]);

  return (
    <div className={cn(
      "group rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md",
      task.completed && "opacity-75 bg-muted/50"
    )}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* Task Text */}
          <span className={cn(
            "flex-1 text-sm leading-relaxed transition-all duration-200",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.text}
          </span>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const TaskItem = memo(TaskItemComponent);