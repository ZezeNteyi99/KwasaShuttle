import React, { useState } from 'react';
import { Save, Check, ShieldAlert, Key } from 'lucide-react';

interface SettingsViewProps {
  adminPassword?: string;
  onPasswordChange?: (newPassword: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ adminPassword, onPasswordChange }) => {
  const [settings, setSettings] = useState({
    companyName: 'KwasaShuttle',
    email: 'admin@kwasashuttle.co.za',
    currency: 'ZAR',
    taxRate: 15,
    notifications: true,
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [saved, setSaved] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setTimeout(() => setSaved(true), 500);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.current !== adminPassword) {
      setPasswordStatus({ message: 'Current password is incorrect.', type: 'error' });
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordStatus({ message: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (passwordForm.new.length < 6) {
      setPasswordStatus({ message: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    if (onPasswordChange) {
      onPasswordChange(passwordForm.new);
      setPasswordStatus({ message: 'Password updated successfully!', type: 'success' });
      setPasswordForm({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            General Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Company Name</label>
               <input 
                 name="companyName"
                 type="text" 
                 className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 value={settings.companyName}
                 onChange={handleChange}
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Admin Email</label>
               <input 
                 name="email"
                 type="email" 
                 className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 value={settings.email}
                 onChange={handleChange}
               />
             </div>
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 pt-4">Financial Settings</h3>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Currency</label>
               <select 
                 name="currency"
                 className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 value={settings.currency}
                 onChange={handleChange}
               >
                 <option value="ZAR">South African Rand (ZAR)</option>
                 <option value="USD">US Dollar (USD)</option>
                 <option value="EUR">Euro (EUR)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Tax Rate (%)</label>
               <input 
                 name="taxRate"
                 type="number" 
                 className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 value={settings.taxRate}
                 onChange={handleChange}
               />
             </div>
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 pt-4">Preferences</h3>
          <div className="flex items-center gap-3">
            <input 
               name="notifications"
               type="checkbox" 
               id="notif"
               className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
               checked={settings.notifications}
               onChange={handleChange} 
            />
            <label htmlFor="notif" className="text-sm text-slate-700 dark:text-slate-400">Enable email notifications for new bookings</label>
          </div>

          <div className="pt-4 flex items-center gap-3">
             <button 
               onClick={handleSave}
               className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium ${
                 saved 
                 ? 'bg-emerald-600 text-white' 
                 : 'bg-blue-600 text-white hover:bg-blue-700'
               }`}
             >
               {saved ? <Check size={18} /> : <Save size={18} />}
               {saved ? 'Saved!' : 'Save Changes'}
             </button>
          </div>
        </div>

        {/* Security Settings (Password) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Key size={18} className="text-blue-600" /> Password Management
          </h3>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/20">
               <ShieldAlert className="text-blue-600 dark:text-blue-400 mt-1 shrink-0" size={18} />
               <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                 Changing your password will update the required credentials for accessing the administrative dashboard from the public website.
               </p>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Current Password</label>
               <input 
                 required
                 type="password" 
                 placeholder="••••••••"
                 className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 value={passwordForm.current}
                 onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
               />
             </div>

             <div className="pt-2">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">New Password</label>
               <input 
                 required
                 type="password" 
                 placeholder="••••••••"
                 className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 value={passwordForm.new}
                 onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Confirm New Password</label>
               <input 
                 required
                 type="password" 
                 placeholder="••••••••"
                 className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 value={passwordForm.confirm}
                 onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
               />
             </div>

             {passwordStatus && (
               <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                 passwordStatus.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
               }`}>
                 {passwordStatus.message}
               </div>
             )}

             <button 
               type="submit"
               className="w-full bg-slate-900 dark:bg-blue-600 text-white py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 font-medium transition-colors"
             >
               Update Admin Password
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;