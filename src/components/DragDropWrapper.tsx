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
        const loadDnd = async () => {
            const dnd = await import('react-beautiful-dnd');
            setComponents({
                DragDropContext: dnd.DragDropContext,
                Droppable: dnd.Droppable,
                Draggable: dnd.Draggable,
            });
        };
        loadDnd();
    }, []);

    if (!components) {
        return null;
    }

    return <>{children(components)}</>;
}