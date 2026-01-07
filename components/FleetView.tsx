import React, { useState } from 'react';
import { Plus, Settings, Fuel, Pencil, Trash2 } from 'lucide-react';
import { Vehicle, VehicleStatus } from '../types';
import Modal from './Modal';

interface FleetViewProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
}

const FleetView: React.FC<FleetViewProps> = ({ vehicles, onAddVehicle, onEditVehicle, onDeleteVehicle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    plate: '',
    dailyRate: 0,
    status: VehicleStatus.Available
  });

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        plate: vehicle.plate,
        dailyRate: vehicle.dailyRate,
        status: vehicle.status
      });
    } else {
      setEditingId(null);
      setFormData({ make: '', model: '', plate: '', dailyRate: 0, status: VehicleStatus.Available });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updatedVehicle: Vehicle = {
        id: editingId,
        make: formData.make,
        model: formData.model,
        plate: formData.plate,
        dailyRate: Number(formData.dailyRate),
        status: formData.status as VehicleStatus,
        image: vehicles.find(v => v.id === editingId)?.image || 'https://picsum.photos/200/120'
      };
      onEditVehicle(updatedVehicle);
    } else {
      const newVehicle: Vehicle = {
        id: `v${Date.now()}`,
        make: formData.make,
        model: formData.model,
        plate: formData.plate,
        dailyRate: Number(formData.dailyRate),
        status: formData.status as VehicleStatus,
        image: `https://picsum.photos/200/120?random=${Date.now()}`
      };
      onAddVehicle(newVehicle);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Fleet Management</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-48 bg-slate-200">
              <img 
                src={vehicle.image} 
                alt={vehicle.model} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2022_Mitsubishi_Xpander_Ultimate_%28NC1W%29.jpg/640px-2022_Mitsubishi_Xpander_Ultimate_%28NC1W%29.jpg';
                }}
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm border
                  ${vehicle.status === 'Available' ? 'bg-white text-emerald-600 border-emerald-100' : 
                    vehicle.status === 'Rented' ? 'bg-white text-blue-600 border-blue-100' : 
                    'bg-white text-orange-600 border-orange-100'
                  }
                `}>
                  {vehicle.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-sm text-slate-500">{vehicle.plate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">R{vehicle.dailyRate}</p>
                  <p className="text-xs text-slate-400">/day</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-slate-500 text-sm">
                <div className="flex gap-4">
                   <div className="flex items-center gap-1">
                     <Fuel size={16} />
                     <span>Petrol</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <Settings size={16} />
                     <span>Auto</span>
                   </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(vehicle)} className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded">
                     <Pencil size={18} />
                  </button>
                  <button onClick={() => onDeleteVehicle(vehicle.id)} className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded">
                     <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Vehicle" : "Add New Vehicle"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
              <input 
                type="text" required placeholder="e.g Toyota"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
              <input 
                type="text" required placeholder="e.g Corolla"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">License Plate</label>
            <input 
              type="text" required placeholder="ABC 123 GP"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.plate}
              onChange={(e) => setFormData({...formData, plate: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Daily Rate (R)</label>
              <input 
                type="number" required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.dailyRate}
                onChange={(e) => setFormData({...formData, dailyRate: Number(e.target.value)})}
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
               <select 
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={formData.status}
                 onChange={(e) => setFormData({...formData, status: e.target.value as VehicleStatus})}
               >
                 {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors">
            {editingId ? "Update Vehicle" : "Add Vehicle"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FleetView;