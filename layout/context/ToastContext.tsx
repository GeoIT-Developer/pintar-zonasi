'use client';

import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext<React.RefObject<Toast> | undefined>(undefined);

export default function ToastProvider({ children }: { children: ReactNode }) {
    const toast = useRef<Toast>(null);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <Toast ref={toast} />
        </ToastContext.Provider>
    );
}

export const useToastContext = (): React.RefObject<Toast> => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastContext');
    }
    return context;
};
