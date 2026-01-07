import { Booking, Customer, Vehicle, VehicleStatus, Payment, Inquiry } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  { 
    id: 'v1', 
    make: 'Mitsubishi', 
    model: 'Xpander (7 Seater)', 
    plate: 'KWA 202 GP', 
    status: VehicleStatus.Available, 
    dailyRate: 850, 
    // Using a reliable public URL. 
    // To use your local image:
    // 1. Move your image file to the 'public' folder of your project (e.g., public/xpander.jpg)
    // 2. Change this line to: image: '/xpander.jpg'
    image: 'https://images.unsplash.com/photo-1629896564947-2b72186780c1?q=80&w=800&auto=format&fit=crop' 
  },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Thabo Mbeki', email: 'thabo@example.com', phone: '082 123 4567', totalRentals: 5 },
  { id: 'c2', name: 'Sarah Connor', email: 'sarah@example.com', phone: '071 987 6543', totalRentals: 2 },
  { id: 'c3', name: 'John Doe', email: 'john@example.com', phone: '063 555 1234', totalRentals: 12 },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const MOCK_BOOKINGS: Booking[] = [
  { 
    id: 'b1', customerId: 'c1', vehicleId: 'v1', customerName: 'Thabo Mbeki', vehicleName: 'Mitsubishi Xpander', 
    pickupDate: yesterday, returnDate: today, status: 'Completed', totalAmount: 850 
  },
  { 
    id: 'b2', customerId: 'c2', vehicleId: 'v1', customerName: 'Sarah Connor', vehicleName: 'Mitsubishi Xpander', 
    pickupDate: tomorrow, returnDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], status: 'Pending', totalAmount: 1700 
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', bookingId: 'b1', customerName: 'Thabo Mbeki', amount: 850, date: yesterday, method: 'Credit Card', status: 'Completed' },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  { id: 1, name: 'Alice Walker', subject: 'Long term rental quote', message: 'Looking for a 7 seater for 3 months.', date: '2023-10-25', status: 'New' },
  { id: 2, name: 'Bob Smith', subject: 'Availability', message: 'Is the Xpander available next weekend?', date: '2023-10-24', status: 'Read' },
];

export const CHART_DATA = [
  { name: 'Mon', revenue: 0 },
  { name: 'Tue', revenue: 850 },
  { name: 'Wed', revenue: 0 },
  { name: 'Thu', revenue: 0 },
  { name: 'Fri', revenue: 0 },
  { name: 'Sat', revenue: 1700 },
  { name: 'Sun', revenue: 850 },
];