import React from 'react';
import { useCinema } from '../context/CinemaContext';
import { ShowtimeSelector } from './ShowtimeSelector';
import { SeatMap } from './SeatMap';
import { ConcessionsSelector } from './ConcessionsSelector';
import { BookingSummary } from './BookingSummary';
import { Film, ChevronRight } from 'lucide-react';

export const BookingView: React.FC = () => {
  const { movies, selectedMovie, selectMovie, setActiveTab } = useCinema();

  if (!selectedMovie) {
    return (
      <div className="p-12 text-center border border-zinc-800 rounded-2xl bg-zinc-900/40">
        <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Chưa Chọn Phim</h3>
        <p className="text-xs text-zinc-400 mt-1">
          Vui lòng chọn một bộ phim từ danh mục để bắt đầu trải nghiệm chọn ghế.
        </p>
        <button
          onClick={() => setActiveTab('movies')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider"
        >
          Xem Danh Sách Phim
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Breadcrumb & Movie Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <button
            onClick={() => setActiveTab('movies')}
            className="hover:text-amber-400 transition-colors"
          >
            Phim Chiếu Rạp
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="font-bold text-white">{selectedMovie.title}</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-amber-400 font-semibold">Chọn Ghế & Suất Chiếu</span>
        </div>

        {/* Quick movie switcher select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 hidden sm:inline">Đổi phim:</span>
          <select
            value={selectedMovie.id}
            onChange={(e) => {
              const target = movies.find((m) => m.id === e.target.value);
              if (target) selectMovie(target);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Showtime Selector */}
      <ShowtimeSelector />

      {/* Main 2-Column Split Layout for Booking & Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Seat Map & Concessions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <SeatMap />
          <ConcessionsSelector />
        </div>

        {/* Right Column: Sticky Contiguous Purchase Module (Cart & Summary) */}
        <div className="lg:col-span-4 sticky top-20">
          <BookingSummary />
        </div>
      </div>
    </div>
  );
};
