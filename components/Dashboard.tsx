
import React from 'react';
import { 
  Car, Users, CreditCard, Key, PlusCircle, MessageCircle, Clock, Globe, ArrowUpRight, Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';
import GeminiInsight from './GeminiInsight';
import { VehicleStatus, Booking, Vehicle, Customer, View } from '../types';
import { CHART_DATA } from '../constants';

interface DashboardProps {
  bookings: Booking[];
  vehicles: Vehicle[];
  customers: Customer[];
  onNavigate: (view: View) => void;
  onReturnVehicle: (bookingId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  bookings, vehicles, customers, onNavigate, onReturnVehicle
}) => {
  const availableVehicles = vehicles.filter(v => v.status === VehicleStatus.Available).length;
  const activeRentals = bookings.filter(b => b.status === 'Active').length;
  const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const today = new Date().toISOString().split('T')[0];
  const todaysPickups = bookings.filter(b => b.pickupDate === today && b.status !== 'Cancelled');
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back to KwasaShuttle control center.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(View.CustomerPortal)}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-semibold"
          >
            <Globe size={18} className="text-blue-500" />
            <span>View Public Site</span>
            <ArrowUpRight size={14} className="text-slate-400" />
          </button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Available Vehicles" value={availableVehicles} icon={Car} color="blue" trend={{ value: 12, isPositive: true }} />
        <StatCard label="Active Rentals" value={activeRentals} icon={Key} color="green" trend={{ value: 5, isPositive: true }} />
        <StatCard label="Total Customers" value={customers.length} icon={Users} color="purple" trend={{ value: 2, isPositive: true }} />
        <StatCard label="Total Revenue" value={`R${totalRevenue.toLocaleString()}`} icon={CreditCard} color="orange" trend={{ value: 8, isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Management shortcuts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'New Booking', icon: PlusCircle, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', action: () => onNavigate(View.Bookings) },
                { label: 'Inquiries', icon: MessageCircle, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400', action: () => onNavigate(View.Inquiries) },
                { label: 'Add Customer', icon: Users, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', action: () => onNavigate(View.Customers) },
                { label: 'Fleet Status', icon: Car, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400', action: () => onNavigate(View.Fleet) },
              ].map((action, i) => (
                <button key={i} onClick={action.action} className="flex flex-col items-center justify-center p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-dashed border-slate-200 dark:border-slate-700 hover:border-solid hover:scale-105">
                  <div className={`p-3 rounded-xl mb-3 ${action.color}`}><action.icon size={26} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-6">Weekly Revenue</h2>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', padding: '12px'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <GeminiInsight bookings={bookings} vehicles={vehicles} />
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
              <Clock size={14} className="text-blue-500" /> Scheduled for today
            </h2>
            <div className="space-y-4">
              {todaysPickups.map(b => (
                 <div key={b.id} className="flex items-center gap-4 p-3 rounded-2xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-default">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">{b.customerName.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{b.customerName}</p>
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{b.vehicleName}</p>
                    </div>
                 </div>
              ))}
              {todaysPickups.length === 0 && (
                <div className="text-center py-8">
                  {/* Fixed: Calendar icon was not imported from lucide-react */}
                  <Calendar className="mx-auto text-slate-200 dark:text-slate-800 mb-2" size={32} />
                  <p className="text-xs text-slate-400 italic">No scheduled pickups for today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
