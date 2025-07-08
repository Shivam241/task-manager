'use client'

import { useEffect, useState } from 'react';

interface DragDropWrapperProps {
    children: (components: {
        DragDropContext: any;
        Droppable: any;
        Draggable: any;
    }) => React.ReactNode;
}

export default function DragDropWrapper({ children }: DragDropWrapperProps) {
    const [components, setComponents] = useState<any>(null);

    useEffect(() => {
        // Load react-beautiful-dnd on client side only
        const loadDnd = async () => {
            const dnd = await import('react-beautiful-dnd');
            
            // Reset server context to prevent SSR issues
            if (typeof window !== 'undefined') {
                dnd.resetServerContext();
            }
            
            setComponents({
                DragDropContext: dnd.DragDropContext,
                Droppable: dnd.Droppable,
                Draggable: dnd.Draggable,
            });
        };
        loadDnd();
    }, []);

    if (!components) {
        return null; // or a loading spinner
    }

    return <>{children(components)}</>;
}