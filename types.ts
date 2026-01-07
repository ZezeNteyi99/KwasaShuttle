export enum VehicleStatus {
  Available = 'Available',
  Rented = 'Rented',
  Maintenance = 'Maintenance',
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  plate: string;
  status: VehicleStatus;
  dailyRate: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalRentals: number;
}

export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string;
  customerName: string;
  vehicleName: string;
  pickupDate: string; // ISO Date string
  returnDate: string; // ISO Date string
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
  totalAmount: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'EFT' | 'Cash';
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Inquiry {
  id: number;
  name: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Replied' | 'Resolved';
}

export interface DashboardStats {
  availableVehicles: number;
  activeRentals: number;
  totalCustomers: number;
  revenue: number;
}

export enum View {
  Dashboard = 'Dashboard',
  Bookings = 'Bookings',
  Inquiries = 'Inquiries',
  Customers = 'Customers',
  Fleet = 'Fleet',
  Payments = 'Payments',
  Reports = 'Reports',
  Settings = 'Settings',
  CustomerPortal = 'CustomerPortal',
}