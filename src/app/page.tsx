import { TaskProvider } from '@/contexts/TaskContext';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Task Manager
              </h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Task Form Card */}
            <div className="md:col-span-1">
              <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">
                      New
                    </span>
                    <h2 className="text-lg font-semibold">Add Task</h2>
                  </div>
                </div>
                <div className="p-6">
                  <TaskForm />
                </div>
              </div>
            </div>

            {/* Task List Card */}
            <div className="md:col-span-2">
              <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Your Tasks</h2>
                </div>
                <div className="p-6">
                  <TaskList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TaskProvider>
  );
}