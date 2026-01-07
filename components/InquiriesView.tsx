import React from 'react';
import { Mail, Phone, MessageSquare, Check, X } from 'lucide-react';
import { Inquiry } from '../types';

interface InquiriesViewProps {
  inquiries: Inquiry[];
  onResolve: (id: number) => void;
  onDelete: (id: number) => void;
}

const InquiriesView: React.FC<InquiriesViewProps> = ({ inquiries, onResolve, onDelete }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Inquiries</h2>
      <div className="grid gap-4">
        {inquiries.length > 0 ? inquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <h3 className="font-semibold text-slate-900">{inquiry.name}</h3>
                 <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                   inquiry.status === 'New' ? 'bg-blue-100 text-blue-700' :
                   inquiry.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                 }`}>
                   {inquiry.status}
                 </span>
              </div>
              <span className="text-sm text-slate-500">{inquiry.date}</span>
            </div>
            <h4 className="text-sm font-medium text-slate-700 mb-1">{inquiry.subject}</h4>
            <p className="text-slate-600 text-sm mb-4">{inquiry.message}</p>
            
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
               <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
                 <Mail size={16} /> Reply
               </button>
               <button className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 text-sm font-medium transition-colors">
                 <Phone size={16} /> Call
               </button>
               <div className="flex-1"></div>
               {inquiry.status !== 'Resolved' && (
                 <button 
                  onClick={() => onResolve(inquiry.id)}
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors" 
                  title="Mark Resolved"
                 >
                   <Check size={18} />
                 </button>
               )}
               <button 
                onClick={() => onDelete(inquiry.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" 
                title="Delete"
               >
                 <X size={18} />
               </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-100">
            <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
            <p>No inquiries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesView;