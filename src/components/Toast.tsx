import React from 'react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-16 right-6 z-50 transition-all duration-300 pointer-events-none flex items-center space-x-3 px-4 py-3 rounded-2xl glass-card border border-blue-500/40 text-xs shadow-2xl animate-fade-in text-on-surface">
      <div className="w-7 h-7 rounded-xl bg-blue-500/20 flex items-center justify-center text-[#3e90ff]">
        <span className="material-symbols-outlined text-[16px]">notifications_active</span>
      </div>
      <div className="font-medium">{message}</div>
    </div>
  );
};
