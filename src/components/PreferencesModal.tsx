import React from 'react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 rounded-3xl space-y-4 shadow-2xl border border-white/20 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-primary">sliders</span>
            <h3 className="text-sm font-bold text-on-surface">DevPulse Preferences</h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-outline mb-1">
              Default Startup Workspace
            </label>
            <select className="w-full p-2.5 rounded-xl bg-surface-container-lowest text-on-surface border border-white/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
              <option>Today's Tasks & Velocity</option>
              <option>Jira Stories (CORE-1042)</option>
              <option>GitHub Activity</option>
              <option>Schedule & Deadlines</option>
              <option>History & Search</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/60 border border-white/5">
            <div>
              <span className="font-medium text-on-surface block">Low-Memory SQLite Mode</span>
              <span className="text-[10px] text-outline">Caps cache footprint below 20MB</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-container bg-black/40 border-white/20 cursor-pointer accent-primary-container" />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/60 border border-white/5">
            <div>
              <span className="font-medium text-on-surface block">Apple Glass Vibrancy Shader</span>
              <span className="text-[10px] text-outline">Enable NSVisualEffect blur compositor</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-container bg-black/40 border-white/20 cursor-pointer accent-primary-container" />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest/60 border border-white/5">
            <div>
              <span className="font-medium text-on-surface block">Biometric Touch ID Lock</span>
              <span className="text-[10px] text-outline">Require biometrics for keyring decryption</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-container bg-black/40 border-white/20 cursor-pointer accent-primary-container" />
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="flex-1 py-2.5 rounded-xl bg-primary-container hover:brightness-110 text-on-primary-container font-semibold text-xs transition shadow-md"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
