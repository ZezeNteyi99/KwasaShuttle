import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { CHART_DATA } from '../constants';
import { Booking, Payment } from '../types';

interface ReportsViewProps {
  bookings: Booking[];
  payments: Payment[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ bookings, payments }) => {
  // Simple calculated stats
  const totalRevenue = payments.reduce((acc, curr) => acc + (curr.status === 'Completed' ? curr.amount : 0), 0);
  const pendingRevenue = payments.reduce((acc, curr) => acc + (curr.status === 'Pending' ? curr.amount : 0), 0);
  
  // Mock data distribution for demo
  const methodData = [
    { name: 'Credit Card', value: payments.filter(p => p.method === 'Credit Card').length },
    { name: 'EFT', value: payments.filter(p => p.method === 'EFT').length },
    { name: 'Cash', value: payments.filter(p => p.method === 'Cash').length },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="font-semibold text-slate-900 mb-6">Revenue Trends (Weekly)</h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Payment Status Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-6">Financial Summary</h3>
          <div className="space-y-6">
             <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
               <p className="text-sm text-emerald-600 font-medium">Total Collected Revenue</p>
               <p className="text-3xl font-bold text-emerald-700">R {totalRevenue.toLocaleString()}</p>
             </div>
             <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
               <p className="text-sm text-orange-600 font-medium">Pending Payments</p>
               <p className="text-3xl font-bold text-orange-700">R {pendingRevenue.toLocaleString()}</p>
             </div>
          </div>
        </div>
      </div>

       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="font-semibold text-slate-900 mb-6">Payment Methods Distribution</h3>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={methodData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
       </div>
    </div>
  );
};

export default ReportsView;