import React, { useState } from 'react';
import { useCinema } from '../context/CinemaContext';
import { Film, Ticket, ShieldCheck, UserCheck, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedSeats,
    currentUser,
    users,
    switchActiveUser,
    bookings,
  } = useCinema();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Filter bookings for current user
  const userBookingsCount = bookings.filter(
    (b) => b.userId === currentUser.id && b.status === 'confirmed'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('movies')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold tracking-wide text-xl bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            CineWave
          </span>
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('movies')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'movies' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
            }`}
          >
            Danh Sách Phim
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'booking' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
            }`}
          >
            <span>Chọn Ghế & Đặt Vé</span>
            {selectedSeats.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 text-xs font-bold flex items-center justify-center tabular-nums">
                {selectedSeats.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'my-tickets' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Vé Của Tôi</span>
            {userBookingsCount > 0 && (
              <span className="text-xs text-zinc-400 tabular-nums">({userBookingsCount})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'admin' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400/80" />
            <span>Quản Trị Viên</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action / User account profile selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800/80 transition-colors text-left"
              title="Đổi tài khoản khách hàng để trải nghiệm"
            >
              <div className={`w-7 h-7 rounded-full ${currentUser.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-xs text-left">
                <div className="font-medium text-zinc-200 truncate max-w-[110px]">{currentUser.name}</div>
                <div className="text-[10px] text-zinc-400">{currentUser.membershipTier}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Dropdown to switch customer persona */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                  <div className="text-xs font-medium text-zinc-400">Chọn tài khoản người dùng:</div>
                </div>
                <div className="space-y-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchActiveUser(u.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-amber-500/10 text-amber-300 font-medium'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-left">
                        <div className={`w-6 h-6 rounded-full ${u.avatarColor} text-white flex items-center justify-center text-[10px] font-bold`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="truncate max-w-[130px]">{u.name}</div>
                          <div className="text-[10px] text-zinc-500">{u.membershipTier}</div>
                        </div>
                      </div>
                      {u.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('booking')}
            className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-400/20 active:scale-95"
          >
            Đặt Vé Nhanh
          </button>
        </div>
      </div>
    </header>
  );
};
