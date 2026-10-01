import React, { useState } from 'react';

interface LogWorkTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogTime: (hours: number, note: string) => void;
}

export const LogWorkTimeModal: React.FC<LogWorkTimeModalProps> = ({
  isOpen,
  onClose,
  onLogTime
}) => {
  const [hours, setHours] = useState(2);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogTime(hours, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-3xl space-y-4 shadow-2xl border border-white/20 animate-fade-in">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-tertiary">timer</span>
            <h3 className="text-sm font-bold text-on-surface">Log Work Time</h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-outline mb-1">
              Time Spent (Hours)
            </label>
            <input 
              type="number"
              min="0.5"
              step="0.5"
              max="24"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 1)}
              className="w-full p-2.5 rounded-xl bg-surface-container-lowest text-on-surface border border-white/10 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-outline mb-1">
              Work Description / Commit Reference
            </label>
            <textarea 
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Profiling SQLite WAL checkpoint starvation on macOS APFS volume..."
              className="w-full p-2.5 rounded-xl bg-surface-container-lowest text-on-surface border border-white/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-primary-container hover:brightness-110 text-on-primary-container font-semibold text-xs transition shadow-md"
            >
              Submit Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
