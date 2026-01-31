import { create } from 'zustand';

// Types
export type Gender = 'men' | 'women';
export type BookingStatus = 'pending' | 'approved' | 'rejected';
export type AvailabilityType = 'daily' | 'weekly' | 'monthly';

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  gender: Gender;
  image?: string;
}

export interface AvailabilityRange {
  id: string;
  type: AvailabilityType;
  startDate: string;
  endDate: string;
  timeSlots: TimeSlot[];
}

export interface Booking {
  id: string;
  fullName: string;
  phone: string;
  serviceId: string;
  gender: Gender;
  date: string;
  timeSlot: string;
  notes?: string;
  paymentSlip?: string;
  status: BookingStatus;
  createdAt: string;
}

// Mock Services Data
export const menServices: Service[] = [
  {
    id: 'men-1',
    name: 'Classic Haircut',
    description: 'Traditional precision cut with styling',
    price: 45,
    duration: 30,
    gender: 'men',
  },
  {
    id: 'men-2',
    name: 'Beard Grooming',
    description: 'Shape, trim, and hot towel treatment',
    price: 35,
    duration: 25,
    gender: 'men',
  },
  {
    id: 'men-3',
    name: 'Executive Facial',
    description: 'Deep cleansing and rejuvenating treatment',
    price: 75,
    duration: 45,
    gender: 'men',
  },
  {
    id: 'men-4',
    name: 'Hair Styling',
    description: 'Premium styling with quality products',
    price: 55,
    duration: 40,
    gender: 'men',
  },
];

export const womenServices: Service[] = [
  {
    id: 'women-1',
    name: 'Signature Haircut',
    description: 'Expert cut tailored to your style',
    price: 65,
    duration: 45,
    gender: 'women',
  },
  {
    id: 'women-2',
    name: 'Color & Highlights',
    description: 'Full color service with premium dyes',
    price: 150,
    duration: 120,
    gender: 'women',
  },
  {
    id: 'women-3',
    name: 'Luxury Spa Treatment',
    description: 'Complete relaxation experience',
    price: 120,
    duration: 90,
    gender: 'women',
  },
  {
    id: 'women-4',
    name: 'Bridal Makeup',
    description: 'Flawless bridal look for your special day',
    price: 200,
    duration: 90,
    gender: 'women',
  },
  {
    id: 'women-5',
    name: 'Blowout & Styling',
    description: 'Professional blowout with styling',
    price: 55,
    duration: 45,
    gender: 'women',
  },
];

// Generate time slots for a day
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 19; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    slots.push({
      id: `slot-${hour}`,
      time,
      isAvailable: Math.random() > 0.3,
    });
  }
  return slots;
};

// Mock Availability Ranges
const mockAvailabilityRanges: AvailabilityRange[] = [
  {
    id: 'avail-1',
    type: 'weekly',
    startDate: '2025-02-01',
    endDate: '2025-02-07',
    timeSlots: generateTimeSlots(),
  },
  {
    id: 'avail-2',
    type: 'weekly',
    startDate: '2025-02-08',
    endDate: '2025-02-14',
    timeSlots: generateTimeSlots(),
  },
  {
    id: 'avail-3',
    type: 'monthly',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    timeSlots: generateTimeSlots(),
  },
];

// Mock Bookings
const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    fullName: 'John Smith',
    phone: '+1 234 567 890',
    serviceId: 'men-1',
    gender: 'men',
    date: '2025-02-03',
    timeSlot: '10:00',
    notes: 'First time customer',
    status: 'pending',
    createdAt: '2025-01-30T10:00:00Z',
  },
  {
    id: 'booking-2',
    fullName: 'Sarah Johnson',
    phone: '+1 234 567 891',
    serviceId: 'women-2',
    gender: 'women',
    date: '2025-02-04',
    timeSlot: '14:00',
    status: 'approved',
    createdAt: '2025-01-30T11:00:00Z',
  },
  {
    id: 'booking-3',
    fullName: 'Emily Davis',
    phone: '+1 234 567 892',
    serviceId: 'women-4',
    gender: 'women',
    date: '2025-02-05',
    timeSlot: '11:00',
    notes: 'Wedding on Feb 10',
    status: 'pending',
    createdAt: '2025-01-30T12:00:00Z',
  },
];

// Store Interface
interface SalonStore {
  // Services
  menServices: Service[];
  womenServices: Service[];
  getServiceById: (id: string) => Service | undefined;
  
  // Availability
  availabilityRanges: AvailabilityRange[];
  addAvailabilityRange: (range: Omit<AvailabilityRange, 'id'>) => void;
  removeAvailabilityRange: (id: string) => void;
  updateAvailabilityRange: (id: string, range: Partial<AvailabilityRange>) => void;
  
  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  
  // Current booking flow state
  currentBooking: Partial<Booking>;
  setCurrentBooking: (booking: Partial<Booking>) => void;
  resetCurrentBooking: () => void;
}

export const useSalonStore = create<SalonStore>((set, get) => ({
  // Services
  menServices,
  womenServices,
  getServiceById: (id: string) => {
    return [...menServices, ...womenServices].find(s => s.id === id);
  },
  
  // Availability
  availabilityRanges: mockAvailabilityRanges,
  addAvailabilityRange: (range) => {
    const newRange: AvailabilityRange = {
      ...range,
      id: `avail-${Date.now()}`,
    };
    set((state) => ({
      availabilityRanges: [...state.availabilityRanges, newRange],
    }));
  },
  removeAvailabilityRange: (id) => {
    set((state) => ({
      availabilityRanges: state.availabilityRanges.filter((r) => r.id !== id),
    }));
  },
  updateAvailabilityRange: (id, range) => {
    set((state) => ({
      availabilityRanges: state.availabilityRanges.map((r) =>
        r.id === id ? { ...r, ...range } : r
      ),
    }));
  },
  
  // Bookings
  bookings: mockBookings,
  addBooking: (booking) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      bookings: [...state.bookings, newBooking],
    }));
  },
  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    }));
  },
  
  // Current booking flow
  currentBooking: {},
  setCurrentBooking: (booking) => {
    set((state) => ({
      currentBooking: { ...state.currentBooking, ...booking },
    }));
  },
  resetCurrentBooking: () => {
    set({ currentBooking: {} });
  },
}));
