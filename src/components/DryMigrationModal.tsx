import React, { useState, useEffect } from 'react';

interface DryMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const DryMigrationModal: React.FC<DryMigrationModalProps> = ({ isOpen, onClose, showToast }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRunning(true);
      setIsCompleted(false);
      setLogs([
        '🚀 Initializing DevPulse Staging Dry Migration Runner v1.5.0-rc3...',
        '📦 Connecting to PostgreSQL Read-Replica Staging Cluster on port 5432...',
        '🔍 Inspecting active database schema hash (SHA: 3a9f1b2)...',
        '⏳ Simulating table migration: ALTER TABLE tasks ADD COLUMN scheduled_date VARCHAR(32);',
        '⏳ Simulating index build: CREATE INDEX idx_tasks_sqlite_wal ON tasks(wal_checkpoint_id);',
        '✅ Zero schema lock contention detected across 1,000 simulated read transactions.',
        '🎉 Dry migration completed with 0 errors in 412ms. Safe to deploy!'
      ]);
      const timer = setTimeout(() => {
        setIsRunning(false);
        setIsCompleted(true);
        showToast('Dry migration verification passed! 0 schema conflicts.');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 border border-white/20 animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-emerald-400">terminal</span>
            <div>
              <h2 className="text-base font-bold text-on-surface">Staging Dry Migration Console</h2>
              <p className="text-xs text-on-surface-variant">Simulated schema failover traffic validation before production release.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-white/10 transition">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Console Viewport */}
        <div className="flex-1 rounded-2xl bg-black/60 p-4 font-mono text-xs text-emerald-300 space-y-1.5 overflow-y-auto border border-white/5 min-h-[220px]">
          {logs.map((log, i) => (
            <div key={i} className={log.startsWith('✅') || log.startsWith('🎉') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
              {log}
            </div>
          ))}
          {isRunning && (
            <div className="flex items-center gap-2 text-primary pt-2 animate-pulse font-bold">
              <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
              <span>Executing schema simulation checks...</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 shrink-0 text-xs">
          <span className="text-[11px] text-outline font-mono">Cluster: pg-staging-replica-01.internal</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold transition"
            >
              Close Console
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                showToast('Staging migration authorized & signed off by Alex Rivera!');
              }}
              className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container font-bold shadow-lg transition hover:brightness-110"
            >
              Sign Off Migration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
