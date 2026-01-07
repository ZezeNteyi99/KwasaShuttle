
import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  MessageSquare, 
  Users, 
  Car, 
  CreditCard, 
  FileText,
  Settings,
  X,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose, darkMode, onToggleDarkMode }) => {
  const menuItems = [
    { id: View.Dashboard, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.Bookings, label: 'Bookings', icon: CalendarDays },
    { id: View.Inquiries, label: 'Inquiries', icon: MessageSquare },
    { id: View.Customers, label: 'Customers', icon: Users },
    { id: View.Fleet, label: 'Fleet', icon: Car },
    { id: View.Payments, label: 'Payments', icon: CreditCard },
    { id: View.Reports, label: 'Reports', icon: FileText },
    { id: View.Settings, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-950 text-white transform transition-transform duration-200 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                K
              </div>
              <span className="font-bold text-lg tracking-wide">KwasaShuttle</span>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                  ${currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                `}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer Area */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <button
              onClick={onToggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <button
              onClick={() => {
                onNavigate(View.CustomerPortal);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-all text-sm font-bold border border-blue-500/50 shadow-lg shadow-blue-950"
            >
              <Globe size={18} />
              Visit Public Website
            </button>

            <div className="flex items-center gap-3 px-2 pt-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@kwasa.co.za</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
