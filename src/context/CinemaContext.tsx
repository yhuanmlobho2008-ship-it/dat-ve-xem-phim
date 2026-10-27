import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Movie,
  Showtime,
  Seat,
  ConcessionItem,
  SelectedConcession,
  Booking,
  UserAccount,
  ToastNotification,
} from '../types';
import { INITIAL_MOVIES, INITIAL_USERS, INITIAL_BOOKINGS, CONCESSIONS } from '../data/mockData';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface CinemaContextType {
  // Navigation & View
  activeTab: 'movies' | 'booking' | 'my-tickets' | 'admin';
  setActiveTab: (tab: 'movies' | 'booking' | 'my-tickets' | 'admin') => void;
  adminTab: 'movies' | 'users';
  setAdminTab: (tab: 'movies' | 'users') => void;

  // Data
  movies: Movie[];
  users: UserAccount[];
  bookings: Booking[];
  currentUser: UserAccount;
  concessionsList: ConcessionItem[];

  // Booking Flow State
  selectedMovie: Movie | null;
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  selectedConcessions: SelectedConcession[];
  confirmedBooking: Booking | null;
  setConfirmedBooking: (b: Booking | null) => void;

  // Flow Actions
  startBookingForMovie: (movie: Movie, showtime?: Showtime) => void;
  selectMovie: (movie: Movie | null) => void;
  selectShowtime: (showtime: Showtime | null) => void;
  toggleSeat: (seat: Seat) => void;
  updateConcessionQuantity: (item: ConcessionItem, delta: number) => void;
  resetBookingFlow: () => void;
  confirmBooking: (customer: CustomerInfo) => Booking | null;
  cancelBooking: (bookingId: string) => void;

  // Admin Movie Actions
  addMovie: (movie: Omit<Movie, 'id'>) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (movieId: string) => void;
  addShowtimeToMovie: (movieId: string, showtime: Omit<Showtime, 'id' | 'movieId' | 'occupiedSeats'>) => void;
  deleteShowtimeFromMovie: (movieId: string, showtimeId: string) => void;

  // User Actions
  switchActiveUser: (userId: string) => void;
  addUser: (user: Omit<UserAccount, 'id' | 'joinedDate' | 'totalSpent' | 'totalBookings'>) => void;

  // Toast System
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MOVIES: 'cinewave_movies_v4',
  USERS: 'cinewave_users_v2',
  BOOKINGS: 'cinewave_bookings_v2',
  ACTIVE_USER_ID: 'cinewave_active_user_id_v2',
};

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage or Fallback
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOVIES);
      return saved ? JSON.parse(saved) : INITIAL_MOVIES;
    } catch {
      return INITIAL_MOVIES;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
      return saved || (INITIAL_USERS[0]?.id ?? 'usr-1');
    } catch {
      return 'usr-1';
    }
  });

  // UI Navigation
  const [activeTab, setActiveTab] = useState<'movies' | 'booking' | 'my-tickets' | 'admin'>('movies');
  const [adminTab, setAdminTab] = useState<'movies' | 'users'>('movies');

  // Booking In-Progress
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(INITIAL_MOVIES[0]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(INITIAL_MOVIES[0].showtimes[0] || null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedConcessions, setSelectedConcessions] = useState<SelectedConcession[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  // Toast Helpers
  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastNotification = { id, type, message, timestamp: Date.now() };
    setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 at once
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Flow Helpers
  const startBookingForMovie = (movie: Movie, showtime?: Showtime) => {
    setSelectedMovie(movie);
    if (showtime) {
      setSelectedShowtime(showtime);
    } else if (movie.showtimes.length > 0) {
      setSelectedShowtime(movie.showtimes[0]);
    } else {
      setSelectedShowtime(null);
    }
    setSelectedSeats([]);
    setSelectedConcessions([]);
    setActiveTab('booking');
    showToast(`Đang đặt vé xem phim "${movie.title}"`, 'info');
  };

  const selectMovie = (movie: Movie | null) => {
    setSelectedMovie(movie);
    if (movie && movie.showtimes.length > 0) {
      setSelectedShowtime(movie.showtimes[0]);
    } else {
      setSelectedShowtime(null);
    }
    setSelectedSeats([]);
  };

  const selectShowtime = (showtime: Showtime | null) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    if (showtime) {
      showToast(`Đã chọn suất ${showtime.time} · ${showtime.room}`, 'info');
    }
  };

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'occupied') {
      showToast(`Ghế ${seat.id} đã có khán giả đặt trước. Vui lòng chọn ghế khác!`, 'warning');
      return;
    }

    const exists = selectedSeats.some((s) => s.id === seat.id);

    if (exists) {
      // Remove seat
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      showToast(`Đã hủy chọn ghế ${seat.id}`, 'info');
    } else {
      // Max 8 seats limit check
      if (selectedSeats.length >= 8) {
        showToast('Mỗi giao dịch tối đa chọn 8 ghế. Vui lòng hoàn tất đặt vé hoặc bớt ghế!', 'warning');
        return;
      }
      setSelectedSeats((prev) => [...prev, { ...seat, status: 'selected' }]);
      const typeLabel = seat.type === 'vip' ? 'VIP' : seat.type === 'couple' ? 'Sweetbox' : 'Tiêu chuẩn';
      showToast(`Đã chọn ghế ${typeLabel} ${seat.id}`, 'success');
    }
  };

  const updateConcessionQuantity = (item: ConcessionItem, delta: number) => {
    setSelectedConcessions((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (!existing && delta > 0) {
        showToast(`Đã thêm ${item.name}`, 'info');
        return [...prev, { item, quantity: delta }];
      }
      if (existing) {
        const nextQty = existing.quantity + delta;
        if (nextQty <= 0) {
          showToast(`Đã xóa ${item.name} khỏi giỏ`, 'info');
          return prev.filter((c) => c.item.id !== item.id);
        }
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: nextQty } : c));
      }
      return prev;
    });
  };

  const resetBookingFlow = () => {
    setSelectedSeats([]);
    setSelectedConcessions([]);
  };

  const confirmBooking = (customer: CustomerInfo): Booking | null => {
    if (!selectedMovie || !selectedShowtime || selectedSeats.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 chỗ ngồi để tiến hành đặt vé!', 'error');
      return null;
    }

    const bookingCode = `CW-${Math.floor(100000 + Math.random() * 900000)}`;
    const seatTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const concessionTotal = selectedConcessions.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
    const totalAmount = seatTotal + concessionTotal;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode,
      userId: currentUser.id,
      userName: customer.name || currentUser.name,
      userEmail: customer.email || currentUser.email,
      userPhone: customer.phone || currentUser.phone,
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      moviePoster: selectedMovie.posterUrl,
      showtimeId: selectedShowtime.id,
      showtimeDate: selectedShowtime.date,
      showtimeTime: selectedShowtime.time,
      theater: selectedShowtime.theater,
      room: selectedShowtime.room,
      format: selectedShowtime.format,
      seats: selectedSeats.map((s) => ({
        id: s.id,
        row: s.row,
        number: s.number,
        type: s.type,
        price: s.price,
      })),
      concessions: selectedConcessions.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
      })),
      seatTotal,
      concessionTotal,
      totalAmount,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    // 1. Save new booking
    setBookings((prev) => [newBooking, ...prev]);

    // 2. Mark seats as occupied in the selected showtime of that movie
    const bookedSeatIds = selectedSeats.map((s) => s.id);
    setMovies((prevMovies) =>
      prevMovies.map((mv) => {
        if (mv.id !== selectedMovie.id) return mv;
        return {
          ...mv,
          showtimes: mv.showtimes.map((st) => {
            if (st.id !== selectedShowtime.id) return st;
            return {
              ...st,
              occupiedSeats: [...new Set([...st.occupiedSeats, ...bookedSeatIds])],
            };
          }),
        };
      })
    );

    // 3. Update current user stats
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id !== currentUser.id) return u;
        return {
          ...u,
          totalSpent: u.totalSpent + totalAmount,
          totalBookings: u.totalBookings + 1,
        };
      })
    );

    // 4. Update state and show confirmation modal
    setConfirmedBooking(newBooking);
    setSelectedSeats([]);
    setSelectedConcessions([]);
    showToast(`Đặt vé thành công! Mã xác nhận của bạn là ${bookingCode}`, 'success');

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // 1. Release occupied seats
    const seatIdsToFree = booking.seats.map((s) => s.id);
    setMovies((prevMovies) =>
      prevMovies.map((mv) => {
        if (mv.id !== booking.movieId) return mv;
        return {
          ...mv,
          showtimes: mv.showtimes.map((st) => {
            if (st.id !== booking.showtimeId) return st;
            return {
              ...st,
              occupiedSeats: st.occupiedSeats.filter((id) => !seatIdsToFree.includes(id)),
            };
          }),
        };
      })
    );

    // 2. Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    showToast(`Đã hủy vé mã ${booking.bookingCode}. Các ghế đã được giải phóng.`, 'info');
  };

  // Admin Movie Actions
  const addMovie = (movieData: Omit<Movie, 'id'>) => {
    const newMovie: Movie = {
      ...movieData,
      id: `mv-${Date.now()}`,
    };
    setMovies((prev) => [newMovie, ...prev]);
    showToast(`Đã thêm phim mới: "${newMovie.title}"`, 'success');
  };

  const updateMovie = (updatedMovie: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)));
    if (selectedMovie?.id === updatedMovie.id) {
      setSelectedMovie(updatedMovie);
    }
    showToast(`Đã cập nhật thông tin phim: "${updatedMovie.title}"`, 'success');
  };

  const deleteMovie = (movieId: string) => {
    const target = movies.find((m) => m.id === movieId);
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    if (selectedMovie?.id === movieId) {
      setSelectedMovie(movies.find((m) => m.id !== movieId) || null);
    }
    showToast(`Đã xóa phim "${target?.title || movieId}" khỏi hệ thống!`, 'info');
  };

  const addShowtimeToMovie = (
    movieId: string,
    showtimeData: Omit<Showtime, 'id' | 'movieId' | 'occupiedSeats'>
  ) => {
    const newShowtime: Showtime = {
      ...showtimeData,
      id: `st-${Date.now()}`,
      movieId,
      occupiedSeats: [],
    };

    setMovies((prev) =>
      prev.map((m) => {
        if (m.id !== movieId) return m;
        return {
          ...m,
          showtimes: [...m.showtimes, newShowtime],
        };
      })
    );

    if (selectedMovie?.id === movieId) {
      setSelectedMovie((prev) => (prev ? { ...prev, showtimes: [...prev.showtimes, newShowtime] } : null));
    }

    showToast(`Đã thêm suất chiếu mới ${showtimeData.time} ngày ${showtimeData.date}`, 'success');
  };

  const deleteShowtimeFromMovie = (movieId: string, showtimeId: string) => {
    setMovies((prev) =>
      prev.map((m) => {
        if (m.id !== movieId) return m;
        return {
          ...m,
          showtimes: m.showtimes.filter((st) => st.id !== showtimeId),
        };
      })
    );

    if (selectedShowtime?.id === showtimeId) {
      setSelectedShowtime(null);
    }

    showToast('Đã xóa suất chiếu thành công', 'info');
  };

  // User Actions
  const switchActiveUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u.id === userId);
    showToast(`Đã chuyển sang tài khoản: ${target?.name || userId}`, 'info');
  };

  const addUser = (userData: Omit<UserAccount, 'id' | 'joinedDate' | 'totalSpent' | 'totalBookings'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      totalBookings: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Đã tạo tài khoản khách hàng mới: ${newUser.name}`, 'success');
  };

  return (
    <CinemaContext.Provider
      value={{
        activeTab,
        setActiveTab,
        adminTab,
        setAdminTab,
        movies,
        users,
        bookings,
        currentUser,
        concessionsList: CONCESSIONS,
        selectedMovie,
        selectedShowtime,
        selectedSeats,
        selectedConcessions,
        confirmedBooking,
        setConfirmedBooking,
        startBookingForMovie,
        selectMovie,
        selectShowtime,
        toggleSeat,
        updateConcessionQuantity,
        resetBookingFlow,
        confirmBooking,
        cancelBooking,
        addMovie,
        updateMovie,
        deleteMovie,
        addShowtimeToMovie,
        deleteShowtimeFromMovie,
        switchActiveUser,
        addUser,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
};

export const useCinema = (): CinemaContextType => {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error('useCinema must be used within a CinemaProvider');
  }
  return context;
};
