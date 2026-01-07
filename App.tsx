
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookingsView from './components/BookingsView';
import FleetView from './components/FleetView';
import CustomersView from './components/CustomersView';
import InquiriesView from './components/InquiriesView';
import PaymentsView from './components/PaymentsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import CustomerPortal from './components/CustomerPortal';
import { View, Booking, Vehicle, Customer, VehicleStatus, Payment, Inquiry } from './types';
import { MOCK_BOOKINGS, MOCK_VEHICLES, MOCK_CUSTOMERS, MOCK_PAYMENTS, MOCK_INQUIRIES } from './constants';

const App: React.FC = () => {
  // Appearance State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Navigation State - Default to Public Portal
  const [currentView, setCurrentView] = useState<View>(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'admin') return View.Dashboard;
    return View.CustomerPortal;
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Data State
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  
  // Security State - Persistent in LocalStorage. Default set to '0000' as requested
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('adminPassword') || '0000';
  });

  // Sync theme to document class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleUpdatePassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('adminPassword', newPass);
  };

  const handleResetPassword = () => {
    const defaultPass = '0000';
    setAdminPassword(defaultPass);
    localStorage.setItem('adminPassword', defaultPass);
    alert('Admin password has been reset to "0000"');
  };

  // --- HANDLERS ---
  const handleUpdateBookingStatus = (id: string, status: Booking['status']) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    if (status === 'Completed' || status === 'Cancelled') {
      setVehicles(vehicles.map(v => v.id === booking.vehicleId ? { ...v, status: VehicleStatus.Available } : v));
    } else if (status === 'Active') {
      setVehicles(vehicles.map(v => v.id === booking.vehicleId ? { ...v, status: VehicleStatus.Rented } : v));
    }
  };

  const handlePublicBooking = (data: { customer: { name: string, email: string, phone: string }, booking: any, payment?: any }) => {
    let customerId = '';
    const existingCustomer = customers.find(c => c.email.toLowerCase() === data.customer.email.toLowerCase());
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const newCustomer: Customer = {
        id: `c${Date.now()}`,
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        totalRentals: 0
      };
      setCustomers(prev => [...prev, newCustomer]);
      customerId = newCustomer.id;
    }

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      customerId: customerId,
      vehicleId: data.booking.vehicleId,
      customerName: data.customer.name,
      vehicleName: data.booking.vehicleName,
      pickupDate: data.booking.pickupDate,
      returnDate: data.booking.returnDate,
      status: 'Active',
      totalAmount: data.booking.totalAmount
    };
    setBookings(prev => [newBooking, ...prev]);

    if (data.payment) {
        setPayments(prev => [{
            id: `p${Date.now()}`,
            bookingId: newBooking.id,
            customerName: data.customer.name,
            amount: data.booking.totalAmount,
            date: new Date().toISOString().split('T')[0],
            method: 'Credit Card',
            status: 'Completed'
        }, ...prev]);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard bookings={bookings} vehicles={vehicles} customers={customers} onNavigate={setCurrentView} onReturnVehicle={(id) => handleUpdateBookingStatus(id, 'Completed')} />;
      case View.Bookings:
        return <BookingsView bookings={bookings} vehicles={vehicles} customers={customers} onAddBooking={b => setBookings([b, ...bookings])} onUpdateStatus={handleUpdateBookingStatus} onEditBooking={b => setBookings(bookings.map(book => book.id === b.id ? b : book))} onDeleteBooking={id => setBookings(bookings.filter(b => b.id !== id))} />;
      case View.Fleet:
        return <FleetView vehicles={vehicles} onAddVehicle={v => setVehicles([...vehicles, v])} onEditVehicle={v => setVehicles(vehicles.map(veh => veh.id === v.id ? v : veh))} onDeleteVehicle={id => setVehicles(vehicles.filter(v => v.id !== id))} />;
      case View.Customers:
        return <CustomersView customers={customers} onAddCustomer={c => setCustomers([...customers, c])} onEditCustomer={c => setCustomers(customers.map(cus => cus.id === c.id ? c : cus))} onDeleteCustomer={id => setCustomers(customers.filter(c => c.id !== id))} />;
      case View.Payments:
        return <PaymentsView payments={payments} bookings={bookings} onAddPayment={p => setPayments([p, ...payments])} onEditPayment={p => setPayments(payments.map(pay => pay.id === p.id ? p : pay))} onDeletePayment={id => setPayments(payments.filter(p => p.id !== id))} />;
      case View.Reports:
        return <ReportsView bookings={bookings} payments={payments} />;
      case View.Settings:
        return <SettingsView adminPassword={adminPassword} onPasswordChange={handleUpdatePassword} />;
      case View.Inquiries:
        return <InquiriesView inquiries={inquiries} onResolve={id => setInquiries(inquiries.map(i => i.id === id ? { ...i, status: 'Resolved' } : i))} onDelete={id => setInquiries(inquiries.filter(i => i.id !== id))} />;
      default:
        return <div>View not found</div>;
    }
  };

  if (currentView === View.CustomerPortal) {
    return (
      <CustomerPortal 
        vehicles={vehicles} 
        onBookingRequest={handlePublicBooking}
        onBackToAdmin={() => setCurrentView(View.Dashboard)}
        adminPassword={adminPassword}
        onResetPassword={handleResetPassword}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between z-10 transition-colors">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">K</div>
             <span className="font-bold text-lg text-slate-900 dark:text-white">KwasaShuttle</span>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
             <Menu size={24} />
           </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
