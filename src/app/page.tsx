"use client";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCallback } from "react";
import { Task } from "@/types/task.type";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);


  const addTask = useCallback((text: string) => {
    if (text.trim() === '') return;
    setTasks((prev) => [
      ...prev,
      { id: uuidv4(), text: text.trim(), completed: false },
    ]);
  }, [setTasks]);

  const handleSubmit = () => {
    addTask("New Task");
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button
            onClick={handleSubmit}>
            submit
          </Button>
        </div>
      </main>
    </div>
  );
}

