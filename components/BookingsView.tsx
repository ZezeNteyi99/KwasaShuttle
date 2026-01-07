import React, { useState } from 'react';
import { Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { Booking, Vehicle, Customer, VehicleStatus } from '../types';
import Modal from './Modal';

interface BookingsViewProps {
  bookings: Booking[];
  vehicles: Vehicle[];
  customers: Customer[];
  onAddBooking: (booking: Booking) => void;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
}

const BookingsView: React.FC<BookingsViewProps> = ({ 
  bookings, 
  vehicles, 
  customers, 
  onAddBooking,
  onUpdateStatus,
  onEditBooking,
  onDeleteBooking
}) => {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    pickupDate: '',
    returnDate: '',
    totalAmount: 0
  });

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'All' || b.status === filter;
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const availableVehicles = vehicles; // Allow selecting any vehicle for edit, or filter for new

  const handleOpenModal = (booking?: Booking) => {
    if (booking) {
      setEditingId(booking.id);
      setFormData({
        customerId: booking.customerId,
        vehicleId: booking.vehicleId,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        totalAmount: booking.totalAmount
      });
    } else {
      setEditingId(null);
      setFormData({ customerId: '', vehicleId: '', pickupDate: '', returnDate: '', totalAmount: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    
    if (customer && vehicle) {
      if (editingId) {
        // Edit existing
        const updatedBooking: Booking = {
           ...bookings.find(b => b.id === editingId)!,
           customerId: customer.id,
           vehicleId: vehicle.id,
           customerName: customer.name,
           vehicleName: `${vehicle.make} ${vehicle.model}`,
           pickupDate: formData.pickupDate,
           returnDate: formData.returnDate,
           totalAmount: Number(formData.totalAmount)
        };
        onEditBooking(updatedBooking);
      } else {
        // Create new
        const newBooking: Booking = {
          id: `b${Date.now()}`,
          customerId: customer.id,
          vehicleId: vehicle.id,
          customerName: customer.name,
          vehicleName: `${vehicle.make} ${vehicle.model}`,
          pickupDate: formData.pickupDate,
          returnDate: formData.returnDate,
          status: 'Active',
          totalAmount: Number(formData.totalAmount)
        };
        onAddBooking(newBooking);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Bookings</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={20} />
          New Booking
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Active', 'Pending', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Booking ID</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Customer</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Vehicle</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Dates</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500 text-sm">#{booking.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{booking.customerName}</td>
                  <td className="px-6 py-4 text-slate-600">{booking.vehicleName}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {booking.pickupDate} <span className="text-slate-400">to</span> {booking.returnDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                      ${booking.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        booking.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        booking.status === 'Completed' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }
                    `}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">R{booking.totalAmount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {/* Quick Actions based on status */}
                       {booking.status === 'Active' && (
                         <button onClick={() => onUpdateStatus(booking.id, 'Completed')} className="text-xs font-medium text-blue-600 hover:underline">Complete</button>
                       )}
                       {booking.status === 'Pending' && (
                         <button onClick={() => onUpdateStatus(booking.id, 'Active')} className="text-xs font-medium text-emerald-600 hover:underline">Approve</button>
                       )}
                       
                       {/* Edit/Delete */}
                       <button onClick={() => handleOpenModal(booking)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                         <Pencil size={16} />
                       </button>
                       <button onClick={() => onDeleteBooking(booking.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No bookings found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Booking" : "Create New Booking"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
            <select 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.customerId}
              onChange={(e) => setFormData({...formData, customerId: e.target.value})}
            >
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
            <select 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.vehicleId}
              onChange={(e) => {
                 const v = vehicles.find(veh => veh.id === e.target.value);
                 setFormData({...formData, vehicleId: e.target.value, totalAmount: v ? v.dailyRate : formData.totalAmount });
              }}
            >
              <option value="">Select Vehicle</option>
              {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.plate}) - R{v.dailyRate}/day</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Date</label>
              <input 
                type="date" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.pickupDate}
                onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
              <input 
                type="date" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.returnDate}
                onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R</span>
              <input 
                type="number" 
                required
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.totalAmount}
                onChange={(e) => setFormData({...formData, totalAmount: Number(e.target.value)})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            {editingId ? "Update Booking" : "Create Booking"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BookingsView;