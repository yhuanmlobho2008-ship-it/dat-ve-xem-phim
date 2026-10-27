import React, { useState } from 'react';
import { useCinema } from '../context/CinemaContext';
import { Movie, Showtime, UserAccount, Booking } from '../types';
import { formatCurrency } from '../utils/seatGenerator';
import { THEATERS, getRelativeDate } from '../data/mockData';
import {
  Film,
  Users,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Search,
  CheckCircle,
  X,
  Sparkles,
  Ticket,
  DollarSign,
  UserCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    movies,
    users,
    bookings,
    addMovie,
    updateMovie,
    deleteMovie,
    addShowtimeToMovie,
    deleteShowtimeFromMovie,
    switchActiveUser,
    addUser,
    showToast,
  } = useCinema();

  // Search states
  const [movieSearch, setMovieSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Modals state
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [targetMovieForShowtime, setTargetMovieForShowtime] = useState<Movie | null>(null);

  const [inspectUser, setInspectUser] = useState<UserAccount | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Form states for Movie
  const [formTitle, setFormTitle] = useState('');
  const [formVnTitle, setFormVnTitle] = useState('');
  const [formGenres, setFormGenres] = useState('Hành động, Phiêu lưu');
  const [formDuration, setFormDuration] = useState(120);
  const [formAge, setFormAge] = useState<'P' | 'T13' | 'T16' | 'T18'>('T16');
  const [formDirector, setFormDirector] = useState('');
  const [formCast, setFormCast] = useState('');
  const [formRating, setFormRating] = useState(8.5);
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formPoster, setFormPoster] = useState('/src/assets/images/movie_poster_action_1793119302194.jpg');
  const [formStatus, setFormStatus] = useState<'now_showing' | 'coming_soon'>('now_showing');
  const [formPrice, setFormPrice] = useState(85000);

  // Form states for Showtime
  const [stDate, setStDate] = useState(getRelativeDate(0));
  const [stTime, setStTime] = useState('18:30');
  const [stTheater, setStTheater] = useState(THEATERS[0].name);
  const [stRoom, setStRoom] = useState('Phòng 01 (Dolby Atmos)');
  const [stFormat, setStFormat] = useState<'2D Phụ Đề' | '2D Lồng Tiếng' | '3D Phụ Đề' | 'IMAX Laser 2D'>('2D Phụ Đề');
  const [stMultiplier, setStMultiplier] = useState(1.0);

  // Form states for User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserTier, setNewUserTier] = useState<'Thành viên' | 'VIP Silver' | 'VIP Diamond'>('Thành viên');

  // Open Edit Movie
  const handleOpenEditMovie = (mv: Movie) => {
    setEditingMovie(mv);
    setFormTitle(mv.title);
    setFormVnTitle(mv.vietnameseTitle);
    setFormGenres(mv.genre.join(', '));
    setFormDuration(mv.duration);
    setFormAge(mv.ageRating);
    setFormDirector(mv.director);
    setFormCast(mv.cast.join(', '));
    setFormRating(mv.rating);
    setFormSynopsis(mv.synopsis);
    setFormPoster(mv.posterUrl);
    setFormStatus(mv.status);
    setFormPrice(mv.basePrice);
    setIsMovieModalOpen(true);
  };

  const handleOpenAddMovie = () => {
    setEditingMovie(null);
    setFormTitle('');
    setFormVnTitle('');
    setFormGenres('Hành động, Hồi hộp');
    setFormDuration(125);
    setFormAge('T16');
    setFormDirector('Nguyễn Văn Đạo');
    setFormCast('Trần Đăng, Hoàng My');
    setFormRating(8.7);
    setFormSynopsis('Nội dung phim hấp dẫn lôi cuốn với những khúc quanh bất ngờ.');
    setFormPoster('/src/assets/images/movie_poster_action_1793119302194.jpg');
    setFormStatus('now_showing');
    setFormPrice(85000);
    setIsMovieModalOpen(true);
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Vui lòng nhập tên phim!', 'warning');
      return;
    }

    const genreList = formGenres.split(',').map((g) => g.trim()).filter(Boolean);
    const castList = formCast.split(',').map((c) => c.trim()).filter(Boolean);

    if (editingMovie) {
      updateMovie({
        ...editingMovie,
        title: formTitle,
        vietnameseTitle: formVnTitle || formTitle,
        genre: genreList,
        duration: Number(formDuration),
        ageRating: formAge,
        director: formDirector,
        cast: castList,
        rating: Number(formRating),
        synopsis: formSynopsis,
        posterUrl: formPoster,
        status: formStatus,
        basePrice: Number(formPrice),
      });
    } else {
      addMovie({
        title: formTitle,
        vietnameseTitle: formVnTitle || formTitle,
        originalTitle: formTitle,
        genre: genreList,
        duration: Number(formDuration),
        ageRating: formAge,
        director: formDirector,
        cast: castList,
        releaseDate: new Date().toISOString().split('T')[0],
        rating: Number(formRating),
        synopsis: formSynopsis,
        posterUrl: formPoster,
        bannerUrl: '/src/assets/images/cinema_hero_banner_1793119301081.jpg',
        formats: ['2D Phụ Đề', 'IMAX Laser 2D'],
        status: formStatus,
        basePrice: Number(formPrice),
        showtimes: [
          {
            id: `st-${Date.now()}`,
            movieId: '',
            date: getRelativeDate(0),
            time: '19:00',
            theater: THEATERS[0].name,
            room: 'Phòng 01 (Atmos)',
            format: '2D Phụ Đề',
            priceMultiplier: 1.0,
            occupiedSeats: [],
          },
        ],
      });
    }
    setIsMovieModalOpen(false);
  };

  const handleOpenShowtimeModal = (mv: Movie) => {
    setTargetMovieForShowtime(mv);
    setIsShowtimeModalOpen(true);
  };

  const handleAddShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMovieForShowtime) return;

    addShowtimeToMovie(targetMovieForShowtime.id, {
      date: stDate,
      time: stTime,
      theater: stTheater,
      room: stRoom,
      format: stFormat,
      priceMultiplier: Number(stMultiplier),
    });

    // Update local modal view target
    const updated = movies.find((m) => m.id === targetMovieForShowtime.id);
    if (updated) setTargetMovieForShowtime(updated);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      showToast('Vui lòng điền họ tên và email người dùng!', 'warning');
      return;
    }
    addUser({
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone || '0901234567',
      membershipTier: newUserTier,
      avatarColor: 'bg-purple-600',
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setIsAddUserModalOpen(false);
  };

  // Filtered movies
  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
      m.director.toLowerCase().includes(movieSearch.toLowerCase()) ||
      m.genre.some((g) => g.toLowerCase().includes(movieSearch.toLowerCase()))
  );

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch)
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Bảng Điều Khiển Quản Trị Hệ Thống
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Quản lý kho phim 20+ tác phẩm, lên lịch suất chiếu rạp và theo dõi lịch sử đặt chỗ khách hàng.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setAdminTab('movies')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              adminTab === 'movies'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Quản Lý Phim ({movies.length})</span>
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              adminTab === 'users'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quản Lý Người Dùng ({users.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MOVIE MANAGEMENT */}
      {adminTab === 'movies' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400">Tổng Số Phim</div>
              <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">{movies.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400">Phim Đang Chiếu</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tabular-nums">
                {movies.filter((m) => m.status === 'now_showing').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400">Phim Sắp Chiếu</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1 tabular-nums">
                {movies.filter((m) => m.status === 'coming_soon').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400">Tổng Suất Chiếu</div>
              <div className="text-2xl font-extrabold text-sky-400 mt-1 tabular-nums">
                {movies.reduce((sum, m) => sum + m.showtimes.length, 0)}
              </div>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={movieSearch}
                onChange={(e) => setMovieSearch(e.target.value)}
                placeholder="Tìm phim theo tên, thể loại, đạo diễn..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleOpenAddMovie}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-md shadow-amber-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Phim Mới</span>
            </button>
          </div>

          {/* Movies Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Áp Phích & Tên Phim</th>
                  <th className="py-3 px-4">Thể Loại</th>
                  <th className="py-3 px-4">Thời Lượng</th>
                  <th className="py-3 px-4">Đánh Giá</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Số Suất Chiếu</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-13 rounded overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/60">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white line-clamp-1">{movie.title}</div>
                          <div className="text-[11px] text-zinc-400 line-clamp-1">{movie.director}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-300">
                      {movie.genre.slice(0, 2).join(', ')}
                    </td>

                    <td className="py-3 px-4 tabular-nums">
                      {movie.duration} phút
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-amber-400 tabular-nums">★ {movie.rating}</span>
                    </td>

                    <td className="py-3 px-4">
                      {movie.status === 'now_showing' ? (
                        <span className="text-emerald-400 font-semibold">Đang chiếu</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Sắp chiếu</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenShowtimeModal(movie)}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sky-400 font-medium text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Clock className="w-3 h-3" />
                        <span className="tabular-nums">{movie.showtimes.length} suất</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenShowtimeModal(movie)}
                          title="Lên lịch suất chiếu"
                          className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-400/10 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditMovie(movie)}
                          title="Sửa thông tin phim"
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa phim "${movie.title}" không?`)) {
                              deleteMovie(movie.id);
                            }
                          }}
                          title="Xóa phim"
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT & BOOKING HISTORY */}
      {adminTab === 'users' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400">Tổng Số Khách Hàng</div>
              <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">{users.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400">Tổng Số Vé Đã Xuất</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 tabular-nums">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-xs text-zinc-400">Doanh Thu Ước Tính Hệ Thống</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1 tabular-nums">
                {formatCurrency(
                  bookings
                    .filter((b) => b.status === 'confirmed')
                    .reduce((sum, b) => sum + b.totalAmount, 0)
                )}
              </div>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm người dùng theo tên, email, số điện thoại..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-md shadow-amber-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tài Khoản Mới</span>
            </button>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Khách Hàng</th>
                  <th className="py-3 px-4">Liên Hệ</th>
                  <th className="py-3 px-4">Hạng Hội Viên</th>
                  <th className="py-3 px-4">Ngày Tham Gia</th>
                  <th className="py-3 px-4">Số Lượt Đặt</th>
                  <th className="py-3 px-4">Tổng Chi Tiêu</th>
                  <th className="py-3 px-4 text-right">Lịch Sử & Trải Nghiệm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
                {filteredUsers.map((user) => {
                  const userBookings = bookings.filter((b) => b.userId === user.id);

                  return (
                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${user.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white">{user.name}</div>
                            <div className="text-[11px] text-zinc-400">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-zinc-200">{user.email}</div>
                        <div className="text-[11px] text-zinc-400 tabular-nums">{user.phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.membershipTier === 'VIP Diamond'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : user.membershipTier === 'VIP Silver'
                            ? 'bg-slate-700/50 text-slate-200 border border-slate-600'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {user.membershipTier}
                        </span>
                      </td>

                      <td className="py-3 px-4 tabular-nums text-zinc-400">
                        {user.joinedDate}
                      </td>

                      <td className="py-3 px-4 tabular-nums font-semibold">
                        {userBookings.length} đơn
                      </td>

                      <td className="py-3 px-4 tabular-nums font-bold text-amber-400">
                        {formatCurrency(user.totalSpent)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectUser(user)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
                            title="Xem lịch sử đặt chỗ chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Lịch Sử ({userBookings.length})</span>
                          </button>

                          <button
                            onClick={() => switchActiveUser(user.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-400/10 hover:bg-amber-400/20 text-xs font-semibold text-amber-300 flex items-center gap-1 transition-colors"
                            title="Chuyển quyền đang dùng sang tài khoản này"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Đăng nhập</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT MOVIE */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingMovie ? 'Chỉnh Sửa Thông Tin Phim' : 'Thêm Phim Mới Vào Rạp'}
              </h3>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Tên Phim (Tiếng Việt)</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Ví dụ: Chiến Binh Vũ Trụ"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Thể Loại (cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    value={formGenres}
                    onChange={(e) => setFormGenres(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Thời Lượng (Phút)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Phân Loại Tuổi</label>
                  <select
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="P">P (Phổ biến)</option>
                    <option value="T13">T13 (Trên 13)</option>
                    <option value="T16">T16 (Trên 16)</option>
                    <option value="T18">T18 (Trên 18)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Đánh Giá (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Trạng Thái</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="now_showing">Đang chiếu</option>
                    <option value="coming_soon">Sắp chiếu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Đạo Diễn</label>
                  <input
                    type="text"
                    value={formDirector}
                    onChange={(e) => setFormDirector(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Giá Vé Cơ Bản (VND)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Diễn Viên (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={formCast}
                  onChange={(e) => setFormCast(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Tóm Tắt Nội Dung Phim</label>
                <textarea
                  rows={3}
                  value={formSynopsis}
                  onChange={(e) => setFormSynopsis(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300"
                >
                  Lưu Thông Tin Phim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE SHOWTIMES */}
      {isShowtimeModalOpen && targetMovieForShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Quản Lý Suất Chiếu & Lịch Trình</h3>
                <p className="text-xs text-amber-400 font-medium">{targetMovieForShowtime.title}</p>
              </div>
              <button
                onClick={() => setIsShowtimeModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Showtimes List */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Danh sách suất chiếu hiện có ({targetMovieForShowtime.showtimes.length})
              </h4>
              {targetMovieForShowtime.showtimes.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {targetMovieForShowtime.showtimes.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-bold text-white">
                            {st.time} · {st.date}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {st.theater} · {st.room} · {st.format}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-zinc-500 tabular-nums">
                          Đã đặt: {st.occupiedSeats.length} chỗ
                        </span>
                        <button
                          onClick={() => deleteShowtimeFromMovie(targetMovieForShowtime.id, st.id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                          title="Xóa suất chiếu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-zinc-500 bg-zinc-950/50 rounded-xl">
                  Chưa có suất chiếu nào được tạo cho phim này.
                </div>
              )}
            </div>

            {/* Add New Showtime Form */}
            <form onSubmit={handleAddShowtime} className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Thêm Suất Chiếu Mới</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Ngày Chiếu</label>
                  <input
                    type="date"
                    required
                    value={stDate}
                    onChange={(e) => setStDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Giờ Chiếu</label>
                  <input
                    type="time"
                    required
                    value={stTime}
                    onChange={(e) => setStTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Cụm Rạp</label>
                  <select
                    value={stTheater}
                    onChange={(e) => setStTheater(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  >
                    {THEATERS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Phòng Chiếu</label>
                  <input
                    type="text"
                    value={stRoom}
                    onChange={(e) => setStRoom(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="Phòng 01 (Atmos)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Định Dạng</label>
                  <select
                    value={stFormat}
                    onChange={(e) => setStFormat(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="2D Phụ Đề">2D Phụ Đề</option>
                    <option value="2D Lồng Tiếng">2D Lồng Tiếng</option>
                    <option value="3D Phụ Đề">3D Phụ Đề</option>
                    <option value="IMAX Laser 2D">IMAX Laser 2D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Hệ Số Giá (Multiplier)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.8"
                    max="2.5"
                    value={stMultiplier}
                    onChange={(e) => setStMultiplier(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors mt-2"
              >
                Thêm Suất Chiếu Này
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INSPECT USER BOOKINGS HISTORY */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${inspectUser.avatarColor} text-white flex items-center justify-center font-bold text-sm`}>
                  {inspectUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{inspectUser.name}</h3>
                  <p className="text-xs text-zinc-400">
                    {inspectUser.email} · {inspectUser.phone} · {inspectUser.membershipTier}
                  </p>
                </div>
              </div>
              <button onClick={() => setInspectUser(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Lịch sử đặt chỗ của khách hàng ({bookings.filter((b) => b.userId === inspectUser.id).length})
              </h4>

              {bookings.filter((b) => b.userId === inspectUser.id).length > 0 ? (
                bookings
                  .filter((b) => b.userId === inspectUser.id)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            {b.bookingCode}
                          </span>
                          <span className="font-bold text-white">{b.movieTitle}</span>
                        </div>
                        <span
                          className={`font-semibold ${
                            b.status === 'confirmed' ? 'text-emerald-400' : 'text-zinc-500 line-through'
                          }`}
                        >
                          {b.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400">
                        {b.showtimeTime} · {b.showtimeDate} · {b.theater} · {b.room}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px]">
                        <div>
                          <span className="text-zinc-500">Ghế: </span>
                          <span className="font-bold text-amber-300">
                            {b.seats.map((s) => s.id).join(', ')}
                          </span>
                        </div>
                        <div className="font-bold text-white tabular-nums">
                          {formatCurrency(b.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-950/40 rounded-xl">
                  Khách hàng này chưa có giao dịch đặt vé nào.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD NEW CUSTOMER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white">Thêm Tài Khoản Người Dùng Mới</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Họ và Tên</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Ví dụ: Đặng Hoàng Yến"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  placeholder="hoangyen.dang@gmail.com"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Số Điện Thoại</label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                  placeholder="0988112233"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Hạng Thành Viên</label>
                <select
                  value={newUserTier}
                  onChange={(e) => setNewUserTier(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Thành viên">Thành viên</option>
                  <option value="VIP Silver">VIP Silver</option>
                  <option value="VIP Diamond">VIP Diamond</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300"
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
