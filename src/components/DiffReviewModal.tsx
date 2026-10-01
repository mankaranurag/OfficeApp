import React from 'react';

interface DiffReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onSnooze: () => void;
}

export const DiffReviewModal: React.FC<DiffReviewModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onSnooze
}) => {
  if (!isOpen) return null;

  const diffLines = [
    { type: 'header', text: '@@ -45,9 +45,16 @@ pub struct SQLiteConnectionPool {' },
    { type: 'normal', text: '     pool: Arc<Mutex<Vec<sqlite3>>>,', lineOld: 45, lineNew: 45 },
    { type: 'normal', text: '     max_capacity: usize,', lineOld: 46, lineNew: 46 },
    { type: 'delete', text: '-    timeout_ms: u64,', lineOld: 47, lineNew: '' },
    { type: 'add', text: '+    timeout_ms: u64, // bounded pool timeout to avoid IPC starvation', lineOld: '', lineNew: 47 },
    { type: 'add', text: '+    wal_autocheckpoint_pages: u32,', lineOld: '', lineNew: 48 },
    { type: 'add', text: '+    memory_cap_bytes: usize,', lineOld: '', lineNew: 49 },
    { type: 'normal', text: ' }', lineOld: 48, lineNew: 50 },
    { type: 'header', text: '@@ -82,6 +89,14 @@ impl SQLiteConnectionPool {' },
    { type: 'normal', text: '     pub fn configure_wal_mode(&self) -> Result<(), EngineError> {', lineOld: 82, lineNew: 89 },
    { type: 'add', text: '+        unsafe {', lineOld: '', lineNew: 90 },
    { type: 'add', text: '+            sqlite3_exec(self.handle, "PRAGMA journal_mode=WAL;", 0, 0, 0);', lineOld: '', lineNew: 91 },
    { type: 'add', text: '+            sqlite3_exec(self.handle, "PRAGMA synchronous=NORMAL;", 0, 0, 0);', lineOld: '', lineNew: 92 },
    { type: 'add', text: '+            sqlite3_wal_autocheckpoint(self.handle, 1000);', lineOld: '', lineNew: 93 },
    { type: 'add', text: '+        }', lineOld: '', lineNew: 94 },
    { type: 'delete', text: '-        // default synchronous mode (blocking fsync)', lineOld: 83, lineNew: '' },
    { type: 'normal', text: '         Ok(())', lineOld: 84, lineNew: 95 },
    { type: 'normal', text: '     }', lineOld: 85, lineNew: 96 }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-3xl rounded-3xl p-6 shadow-2xl space-y-4 border border-white/20 animate-fade-in max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono text-[11px] font-bold">
                URGENT REVIEW
              </span>
              <span className="font-mono text-xs text-primary font-bold">PR #88</span>
              <span className="text-xs text-outline">• Branch: <code className="text-secondary font-mono">feat/sqlite-wal</code></span>
            </div>
            <h2 className="text-base font-bold text-on-surface mt-1">
              PR #88 — Core Memory Sandbox Pipeline
            </h2>
            <p className="text-xs text-on-surface-variant">
              Target: <code className="text-on-surface font-mono">main</code> • 6 commits • +428 / -84 lines • Reviewer: Alex Rivera
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Diff Viewer Body */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-surface-container-lowest/80 p-3 font-mono text-xs space-y-0.5 border border-white/5">
          <div className="flex items-center justify-between pb-2 text-[11px] text-outline border-b border-white/10 mb-2">
            <span>crates/devpulse_engine/src/persistence/sqlite_pool.rs</span>
            <span className="text-emerald-400">+148 -22</span>
          </div>

          {diffLines.map((line, idx) => {
            if (line.type === 'header') {
              return (
                <div key={idx} className="py-1 px-2 text-primary font-bold bg-primary/10 rounded text-[11px]">
                  {line.text}
                </div>
              );
            }
            const isAdd = line.type === 'add';
            const isDel = line.type === 'delete';
            return (
              <div 
                key={idx} 
                className={`flex items-center px-2 py-0.5 rounded text-[11px] ${
                  isAdd ? 'bg-emerald-500/15 text-emerald-300' : isDel ? 'bg-red-500/15 text-red-300' : 'text-on-surface-variant'
                }`}
              >
                <span className="w-8 text-right text-outline pr-2 select-none text-[10px] opacity-60">
                  {line.lineOld}
                </span>
                <span className="w-8 text-right text-outline pr-2 select-none text-[10px] opacity-60">
                  {line.lineNew}
                </span>
                <span className="font-mono whitespace-pre flex-1">{line.text}</span>
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={onSnooze}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition"
            >
              Snooze 15m
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-outline hover:text-on-surface text-xs font-medium transition"
            >
              Close
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onApprove}
              className="px-5 py-2 rounded-xl bg-primary-container hover:brightness-110 text-on-primary-container text-xs font-bold shadow-lg transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Approve & Sign Off Diff</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
