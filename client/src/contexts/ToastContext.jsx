import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', options = {}) => {
        const id = Date.now();
        setToasts(prev => [...prev, {
            id,
            message,
            type,
            undoAction: options.undoAction,
            undoText: options.undoText || 'Undo'
        }]);
    }, []);

    const showSuccess = useCallback((message) => {
        showToast(message, 'success');
    }, [showToast]);

    const showError = useCallback((message) => {
        showToast(message, 'error');
    }, [showToast]);

    const showDelete = useCallback((message, undoAction) => {
        showToast(message, 'delete', { undoAction });
    }, [showToast]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showDelete }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                        undoAction={toast.undoAction}
                        undoText={toast.undoText}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
