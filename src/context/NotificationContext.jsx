import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Show a toast notification
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // Show a custom confirmation dialog
  const confirm = useCallback(({ title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    return new Promise((resolve) => {
      setConfirmConfig({
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirmConfig(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmConfig(null);
          resolve(false);
        },
      });
    });
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Toast Containers */}
      <div className="fixed top-6 right-6 z-55 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border animate-slide-in-right ${
              toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              toast.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-850' :
              toast.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
              'bg-blue-50 border-blue-100 text-blue-800'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600" />}
              {toast.type === 'warning' && <AlertTriangle size={16} className="text-amber-600" />}
              {toast.type === 'error' && <XCircle size={16} className="text-rose-600" />}
              {toast.type === 'info' && <Info size={16} className="text-blue-600" />}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog Modal */}
      {confirmConfig && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-zoom-in">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  {confirmConfig.title || 'Attention Required'}
                </h4>
              </div>
              <p className="text-xs text-slate-650 font-medium leading-relaxed">
                {confirmConfig.message}
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={confirmConfig.onCancel}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {confirmConfig.cancelText}
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-red-500/10"
              >
                {confirmConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
