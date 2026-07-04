import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-extrabold text-sm tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
