// Updated TaskList.tsx with CSS-based non-shifting drag behavior
'use client'

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { TaskItem } from './TaskItem';
import { ListTodo, CheckCircle2, Clock } from 'lucide-react';
import DragDropWrapper from '@/components/DragDropWrapper';

export default function TaskList() {
    const { tasks, setTasks, filterTasks } = useTasks();
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
    const [mounted, setMounted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const draggedOverIndexRef = useRef<number | null>(null);

    const filteredTasks = useMemo(() => filterTasks(filter), [filter, filterTasks]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isDragging) {
            // Add styles to prevent shifting
            const style = document.createElement('style');
            style.id = 'no-shift-drag-styles';
            style.textContent = `
                /* Freeze all transforms except for the dragged item */
                [data-rbd-droppable-id] > *:not([data-rbd-draggable-id="${filteredTasks[draggedIndex || 0]?.id}"]) {
                    transform: none !important;
                    transition: none !important;
                }
                
                /* Hide the placeholder that react-beautiful-dnd creates */
                [data-rbd-placeholder-context-id] {
                    display: none !important;
                }
                
                /* Make the dragged item's original position semi-transparent */
                [data-rbd-draggable-id="${filteredTasks[draggedIndex || 0]?.id}"] > div {
                    opacity: ${isDragging ? '0' : '1'};
                }
            `;
            document.head.appendChild(style);

            return () => {
                const existingStyle = document.getElementById('no-shift-drag-styles');
                if (existingStyle) {
                    existingStyle.remove();
                }
            };
        }
    }, [isDragging, draggedIndex, filteredTasks]);

    const onDragStart = (start: any) => {
        setIsDragging(true);
        setDraggedIndex(start.source.index);
        document.body.style.cursor = 'grabbing';
    };

    const onDragEnd = (result: any) => {
        setIsDragging(false);
        setDraggedIndex(null);
        draggedOverIndexRef.current = null;
        document.body.style.cursor = '';

        if (!result.destination) return;

        const items = Array.from(filteredTasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const newTasks = [...tasks];
        const originalIndex = tasks.findIndex(t => t.id === reorderedItem.id);

        if (originalIndex !== -1) {
            newTasks.splice(originalIndex, 1);

            let insertIndex = 0;
            if (result.destination.index > 0) {
                const prevTaskId = items[result.destination.index - 1].id;
                insertIndex = newTasks.findIndex(t => t.id === prevTaskId) + 1;
            }

            newTasks.splice(insertIndex, 0, reorderedItem);
            setTasks(newTasks);
        }
    };

    const completedCount = tasks.filter(task => task.completed).length;
    const pendingCount = tasks.filter(task => !task.completed).length;

    const renderContent = () => {
        if (!mounted) {
            return (
                <div className="space-y-2">
                    {filteredTasks.map((task) => (
                        <div key={task.id}>
                            <TaskItem task={task} />
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <DragDropWrapper>
                {({ DragDropContext, Droppable, Draggable }) => (
                    <DragDropContext 
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                    >
                        <Droppable droppableId="tasks" isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={false}>
                            {(provided: any) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="relative"
                                    style={{
                                        minHeight: filteredTasks.length === 0 ? '200px' : 'auto',
                                    }}
                                >
                                    {filteredTasks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="rounded-full bg-muted p-3 mb-4">
                                                <ListTodo className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                                            <p className="text-muted-foreground">
                                                Add your first task to get started!
                                            </p>
                                        </div>
                                    ) : (
                                        filteredTasks.map((task, index) => (
                                            <Draggable 
                                                key={task.id} 
                                                draggableId={task.id} 
                                                index={index}
                                            >
                                                {(provided: any, snapshot: any) => {
                                                    const style = {
                                                        ...provided.draggableProps.style,
                                                        // Only apply transform to the dragged item
                                                        transform: snapshot.isDragging 
                                                            ? provided.draggableProps.style?.transform 
                                                            : 'none',
                                                        // Ensure proper positioning
                                                        position: snapshot.isDragging ? 'fixed' : 'relative',
                                                        // High z-index for dragged item
                                                        zIndex: snapshot.isDragging ? 9999 : 'auto',
                                                        // Shadow for dragged item
                                                        boxShadow: snapshot.isDragging 
                                                            ? '0 10px 30px rgba(0,0,5,0.3)' 
                                                            : 'none',
                                                        // Slightly scale up the dragged item
                                                        scale: snapshot.isDragging ? '1' : '1',
                                                        // Remove margin during drag to prevent gaps
                                                        marginBottom: snapshot.isDragging ? '0' : '8px',
                                                        // Ensure full width
                                                        width: snapshot.isDragging 
                                                            ? `${provided.draggableProps.style?.width || '100%'}` 
                                                            : '100%',
                                                    };
                                                    return (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={style}
                                                        >
                                                            <div style={{ 
                                                                opacity: snapshot.isDragging && !snapshot.isDropAnimating ? 0 : 1,
                                                                transition: 'opacity 0.2s'
                                                            }}>
                                                                <TaskItem task={task} />
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </DragDropWrapper>
        );
    };

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-semibold">{tasks.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="font-semibold text-green-600">{completedCount}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="font-semibold text-orange-600">{pendingCount}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-1 p-1 bg-muted rounded-lg">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    All
                    <span className="ml-1 px-2 py-0.5 text-xs bg-muted-foreground/20 rounded-full">
                        {tasks.length}
                    </span>
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'completed'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Completed
                    <span className="ml-1 px-2 py-0.5 text-xs bg-muted-foreground/20 rounded-full">
                        {completedCount}
                    </span>
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Pending
                    <span className="ml-1 px-2 py-0.5 text-xs bg-muted-foreground/20 rounded-full">
                        {pendingCount}
                    </span>
                </button>
            </div>

            {/* Task Content */}
            {renderContent()}
        </div>
    );
}