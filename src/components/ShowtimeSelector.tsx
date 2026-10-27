import React, { useState } from 'react';
import { useCinema } from '../context/CinemaContext';
import { Showtime } from '../types';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { getRelativeDate } from '../data/mockData';

export const ShowtimeSelector: React.FC = () => {
  const { selectedMovie, selectedShowtime, selectShowtime } = useCinema();

  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDate(0));
  const [selectedTheater, setSelectedTheater] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  if (!selectedMovie) return null;

  // Generate 7-day schedule range
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const rawDate = getRelativeDate(i);
    const d = new Date(rawDate);
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const label = i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : dayNames[d.getDay()];
    const dayNum = d.getDate();
    const monthNum = d.getMonth() + 1;
    return {
      dateString: rawDate,
      label,
      dateFormatted: `${dayNum}/${monthNum}`,
    };
  });

  // Unique theaters for this movie
  const availableTheaters = Array.from(
    new Set(selectedMovie.showtimes.map((st) => st.theater))
  );

  // Filtered showtimes
  const filteredShowtimes = selectedMovie.showtimes.filter((st) => {
    const matchDate = st.date === selectedDate;
    const matchTheater = selectedTheater === 'all' || st.theater === selectedTheater;
    const matchFormat = selectedFormat === 'all' || st.format.includes(selectedFormat);
    return matchDate && matchTheater && matchFormat;
  });

  return (
    <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Chọn Ngày & Suất Chiếu
          </h3>
        </div>
        <div className="text-xs text-zinc-400">
          Phim: <span className="font-semibold text-zinc-200">{selectedMovie.title}</span>
        </div>
      </div>

      {/* Date Carousel / Horizontal list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {dateOptions.map((opt) => {
          const isActive = opt.dateString === selectedDate;
          return (
            <button
              key={opt.dateString}
              onClick={() => setSelectedDate(opt.dateString)}
              className={`flex flex-col items-center justify-center min-w-[76px] py-2.5 px-3 rounded-xl text-xs transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-amber-400 text-zinc-950 font-bold border-amber-300 shadow-md shadow-amber-400/20 scale-[1.02]'
                  : 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span className={`text-[11px] ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`}>
                {opt.label}
              </span>
              <span className="text-sm font-extrabold mt-0.5">{opt.dateFormatted}</span>
            </button>
          );
        })}
      </div>

      {/* Theater & Format Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400 mr-1">Rạp:</span>
          <button
            onClick={() => setSelectedTheater('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedTheater === 'all'
                ? 'bg-zinc-700 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tất cả
          </button>
          {availableTheaters.map((th) => (
            <button
              key={th}
              onClick={() => setSelectedTheater(th)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedTheater === th
                  ? 'bg-zinc-700 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {th.replace('CineWave ', '')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 mr-1">Định dạng:</span>
          {['all', 'IMAX', '2D', '3D'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedFormat === fmt
                  ? 'bg-zinc-700 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {fmt === 'all' ? 'Tất cả' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Showtimes Grid */}
      {filteredShowtimes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredShowtimes.map((st: Showtime) => {
            const isCurrent = selectedShowtime?.id === st.id;
            const totalSeats = 10 * 4 + 12 * 4 + 5; // standard + vip + couple
            const remainingSeats = Math.max(0, totalSeats - st.occupiedSeats.length);

            return (
              <button
                key={st.id}
                onClick={() => selectShowtime(st)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isCurrent
                    ? 'bg-amber-400/10 border-amber-400 text-white shadow-lg shadow-amber-400/10 ring-1 ring-amber-400'
                    : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1 font-bold text-base tracking-tight text-white tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{st.time}</span>
                  </div>
                  {st.format.includes('IMAX') && (
                    <span className="text-[10px] font-bold text-sky-400 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      IMAX
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-300 font-medium truncate">{st.theater}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{st.room}</div>

                <div className="mt-2 pt-2 border-t border-zinc-700/40 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">{st.format}</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      remainingSeats < 10 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    Còn {remainingSeats} chỗ
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center text-zinc-500 text-xs bg-zinc-950/40 rounded-xl border border-dashed border-zinc-800">
          Không có suất chiếu nào phù hợp với bộ lọc trong ngày đã chọn. Vui lòng chọn ngày khác!
        </div>
      )}
    </div>
  );
};
