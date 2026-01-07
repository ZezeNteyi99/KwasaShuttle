import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, CreditCard } from 'lucide-react';
import { Payment, Booking } from '../types';
import Modal from './Modal';

interface PaymentsViewProps {
  payments: Payment[];
  bookings: Booking[];
  onAddPayment: (payment: Payment) => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (id: string) => void;
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ payments, bookings, onAddPayment, onEditPayment, onDeletePayment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    bookingId: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: 'Credit Card',
    status: 'Completed'
  });

  const filteredPayments = payments.filter(p => 
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (payment?: Payment) => {
    if (payment) {
      setEditingId(payment.id);
      setFormData({
        bookingId: payment.bookingId,
        amount: payment.amount,
        date: payment.date,
        method: payment.method,
        status: payment.status
      });
    } else {
      setEditingId(null);
      setFormData({ 
        bookingId: '', 
        amount: 0, 
        date: new Date().toISOString().split('T')[0], 
        method: 'Credit Card', 
        status: 'Completed' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const booking = bookings.find(b => b.id === formData.bookingId);
    
    if (booking) {
      if (editingId) {
        onEditPayment({
          id: editingId,
          ...formData,
          customerName: booking.customerName,
          method: formData.method as any,
          status: formData.status as any
        });
      } else {
        onAddPayment({
          id: `p${Date.now()}`,
          ...formData,
          customerName: booking.customerName,
          method: formData.method as any,
          status: formData.status as any
        });
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Payments</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search payments..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Payment ID</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Customer</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Method</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Amount</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-slate-500 text-sm">#{payment.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {payment.customerName}
                  <div className="text-xs text-slate-400">Ref: Booking #{payment.bookingId}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{payment.date}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <CreditCard size={14} /> {payment.method}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                    ${payment.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      payment.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                      'bg-red-50 text-red-700 border-red-200'
                    }
                  `}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-right">R{payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(payment)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => onDeletePayment(payment.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Payment" : "Record Payment"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Related Booking</label>
            <select 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.bookingId}
              onChange={(e) => {
                 const b = bookings.find(bk => bk.id === e.target.value);
                 setFormData({...formData, bookingId: e.target.value, amount: b ? b.totalAmount : formData.amount});
              }}
            >
              <option value="">Select Booking</option>
              {bookings.map(b => <option key={b.id} value={b.id}>#{b.id} - {b.customerName} ({b.vehicleName})</option>)}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
             <input 
               type="date" required
               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={formData.date}
               onChange={(e) => setFormData({...formData, date: e.target.value})}
             />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount (R)</label>
            <input 
              type="number" required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
               <select 
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={formData.method}
                 onChange={(e) => setFormData({...formData, method: e.target.value})}
               >
                 <option>Credit Card</option>
                 <option>EFT</option>
                 <option>Cash</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
               <select 
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={formData.status}
                 onChange={(e) => setFormData({...formData, status: e.target.value})}
               >
                 <option>Completed</option>
                 <option>Pending</option>
                 <option>Failed</option>
               </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors">
            {editingId ? "Update Payment" : "Record Payment"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsView;