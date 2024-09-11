import React, { useState, useRef, useCallback, ReactNode } from 'react';

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

type SizeType = {
    width: number | string;
    height: number | string;
};

export default function ResizableDiv({ children, className, width, height }: { children: ReactNode; className: string } & SizeType) {
    const [dimensions, setDimensions] = useState<SizeType>({ width, height });
    const resizableRef = useRef<HTMLDivElement | null>(null);
    const isResizing = useRef(false);

    const handleMouseDown = useCallback(() => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isResizing.current && resizableRef.current) {
            const newWidth = Math.max(e.clientX - resizableRef.current.offsetLeft, MIN_WIDTH);
            const newHeight = Math.max(e.clientY - resizableRef.current.offsetTop, MIN_HEIGHT);
            setDimensions({ width: newWidth, height: newHeight });
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    return (
        <div ref={resizableRef} style={{ width: dimensions.width, height: dimensions.height, position: 'relative' }} className={className}>
            <div
                style={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#333',
                    right: 0,
                    bottom: 0,
                    cursor: 'se-resize',
                    zIndex: 5
                }}
                onMouseDown={handleMouseDown}
            />
            {children}
        </div>
    );
}
