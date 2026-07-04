import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Database, 
  ShieldCheck, 
  Globe, 
  Save 
} from 'lucide-react';

export default function Settings({ currentUser }) {
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Admin',
    email: currentUser?.email || '',
    language: 'English',
    regionScope: currentUser?.region || 'All'
  });

  const [toggles, setToggles] = useState({
    emailAlerts: true,
    pushAlerts: false,
    autoBackup: true,
    strictSla: true
  });

  const [savedStatus, setSavedStatus] = useState(false);

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div id="settings-panel" className="p-8 max-w-4xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">System Settings & Parameters</h2>
        <p className="text-xs text-slate-500 font-semibold">Manage your user profile, active session scopes, global triggers, and automatic data backup parameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
            <User size={16} className="text-blue-500" />
            <span>Profile Configuration</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">Full Operational Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">Security Access Email</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 font-semibold cursor-not-allowed focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Global Regional Preferences */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
            <Globe size={16} className="text-emerald-500" />
            <span>Regional Preferences</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">System Locale Language</label>
              <select
                value={profile.language}
                onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="English">English (Global)</option>
                <option value="Turkish">Türkçe (Local)</option>
                <option value="German">Deutsch (EU)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">Operational Region Limit</label>
              <input
                type="text"
                disabled
                value={profile.regionScope}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 font-semibold cursor-not-allowed focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Interactive Alerts Preferences */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
            <Bell size={16} className="text-amber-500" />
            <span>Interactive System Flags</span>
          </h4>

          <div className="space-y-3.5">
            {[
              { id: 'emailAlerts', title: 'Operational Digest Emails', desc: 'Trigger daily PDF logs directly to active manager accounts.' },
              { id: 'pushAlerts', title: 'Live Sound Notifications', desc: 'Synthesize sound ripples when new kitchen orders arrive in the queue.' },
              { id: 'autoBackup', title: 'Durable db.json Auto-backups', desc: 'Enable secondary cloud state synchronization intervals.' },
              { id: 'strictSla', title: 'Strict SLA Tracking', desc: 'Highlight food orders exceed 15-minute preparation limits in red.' }
            ].map(flag => (
              <div key={flag.id} className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">{flag.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{flag.desc}</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleToggle(flag.id)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    toggles[flag.id] ? 'bg-blue-600 flex justify-end' : 'bg-slate-200 flex justify-start'
                  }`}
                >
                  <span className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 justify-end">
          {savedStatus && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in">
              ✓ Parameters saved successfully
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-650/10"
          >
            <Save size={13} />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
