export type SeatType = 'standard' | 'vip' | 'couple';
export type SeatStatus = 'available' | 'selected' | 'occupied';

export interface Seat {
  id: string; // e.g. "A1", "F6", "J1-J2"
  row: string; // e.g. "A", "F", "J"
  number: number; // 1, 2, ...
  type: SeatType;
  price: number;
  status: SeatStatus;
  pairId?: string; // For couple seats that come in pairs
  isPairSecond?: boolean;
}

export type AgeRating = 'P' | 'T13' | 'T16' | 'T18';

export interface Showtime {
  id: string;
  movieId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  theater: string;
  room: string;
  format: '2D Phụ Đề' | '2D Lồng Tiếng' | '3D Phụ Đề' | 'IMAX Laser 2D' | 'IMAX 3D';
  priceMultiplier: number;
  occupiedSeats: string[]; // List of seat IDs already taken
}

export interface Movie {
  id: string;
  title: string;
  vietnameseTitle: string;
  originalTitle?: string;
  genre: string[];
  duration: number; // minutes
  ageRating: AgeRating;
  director: string;
  cast: string[];
  releaseDate: string;
  rating: number; // 0 to 10
  synopsis: string;
  posterUrl: string;
  bannerUrl?: string;
  formats: string[];
  status: 'now_showing' | 'coming_soon';
  showtimes: Showtime[];
  basePrice: number;
}

export interface ConcessionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'popcorn' | 'drink' | 'combo';
  icon: string;
}

export interface SelectedConcession {
  item: ConcessionItem;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  showtimeId: string;
  showtimeDate: string;
  showtimeTime: string;
  theater: string;
  room: string;
  format: string;
  seats: {
    id: string;
    row: string;
    number: number;
    type: SeatType;
    price: number;
  }[];
  concessions: {
    name: string;
    quantity: number;
    price: number;
  }[];
  seatTotal: number;
  concessionTotal: number;
  totalAmount: number;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipTier: 'Thành viên' | 'VIP Silver' | 'VIP Diamond';
  avatarColor: string;
  joinedDate: string;
  totalSpent: number;
  totalBookings: number;
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}
