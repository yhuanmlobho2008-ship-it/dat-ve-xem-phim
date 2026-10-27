import React, { useMemo } from 'react';
import { useCinema } from '../context/CinemaContext';
import { generateSeatsForShowtime, formatCurrency } from '../utils/seatGenerator';
import { Seat } from '../types';
import { Armchair, Heart, Sparkles, Check, Info } from 'lucide-react';

export const SeatMap: React.FC = () => {
  const { selectedMovie, selectedShowtime, selectedSeats, toggleSeat } = useCinema();

  const seats = useMemo(() => {
    if (!selectedMovie || !selectedShowtime) return [];
    return generateSeatsForShowtime(
      selectedMovie,
      selectedShowtime,
      selectedSeats.map((s) => s.id)
    );
  }, [selectedMovie, selectedShowtime, selectedSeats]);

  if (!selectedMovie || !selectedShowtime) {
    return (
      <div className="p-8 text-center border border-zinc-800 rounded-2xl bg-zinc-900/40">
        <p className="text-zinc-400">Vui lòng chọn một suất chiếu để hiển thị sơ đồ chỗ ngồi.</p>
      </div>
    );
  }

  // Group seats by row
  const rowA = seats.filter((s) => s.row === 'A');
  const rowB = seats.filter((s) => s.row === 'B');
  const rowC = seats.filter((s) => s.row === 'C');
  const rowD = seats.filter((s) => s.row === 'D');
  const rowE = seats.filter((s) => s.row === 'E');
  const rowF = seats.filter((s) => s.row === 'F');
  const rowG = seats.filter((s) => s.row === 'G');
  const rowH = seats.filter((s) => s.row === 'H');
  const rowJ = seats.filter((s) => s.row === 'J');

  const standardPrice = rowA[0]?.price || selectedMovie.basePrice;
  const vipPrice = rowE[0]?.price || Math.round(selectedMovie.basePrice * 1.3);
  const couplePrice = rowJ[0]?.price || Math.round(selectedMovie.basePrice * 2.4);

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col items-center select-none shadow-2xl relative overflow-hidden">
      {/* Background radial screen beam glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-44 cinema-screen-glow pointer-events-none -z-0" />

      {/* Screen Graphic */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center relative z-10">
        <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-sky-400/20 via-sky-400 to-sky-400/20 screen-arc" />
        <div className="mt-2 text-xs font-bold tracking-widest text-sky-400/80 uppercase">
          Màn Hình Chiếu · {selectedShowtime.room}
        </div>
        <div className="text-[11px] text-zinc-500 mt-0.5">
          {selectedShowtime.format} · Âm thanh Dolby Atmos
        </div>
      </div>

      {/* Seats Container */}
      <div className="w-full max-w-3xl overflow-x-auto pb-4 relative z-10 flex flex-col items-center">
        <div className="min-w-[620px] flex flex-col gap-3">
          {/* Standard Rows A-D */}
          <div className="space-y-2 mb-2">
            {[rowA, rowB, rowC, rowD].map((rowSeats, idx) => {
              const rowLabel = ['A', 'B', 'C', 'D'][idx];
              return (
                <div key={rowLabel} className="flex items-center justify-center gap-2">
                  <span className="w-5 text-xs font-semibold text-zinc-500 text-right mr-1">{rowLabel}</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const isOccupied = seat.status === 'occupied';

                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={isOccupied}
                          aria-label={`Ghế tiêu chuẩn ${seat.id}, giá ${formatCurrency(seat.price)}`}
                          title={`Ghế ${seat.id} (Tiêu chuẩn): ${formatCurrency(seat.price)}`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] font-medium flex items-center justify-center transition-all duration-150 relative ${
                            isOccupied
                              ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                              : isSelected
                              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/60'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.number}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-5 text-xs font-semibold text-zinc-500 text-left ml-1">{rowLabel}</span>
                </div>
              );
            })}
          </div>

          {/* Section Divider - VIP Zone */}
          <div className="flex items-center justify-center gap-2 my-1">
            <div className="h-px bg-amber-500/20 w-16" />
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Khu Vực Ghế VIP Trung Tâm</span>
            </div>
            <div className="h-px bg-amber-500/20 w-16" />
          </div>

          {/* VIP Rows E-H */}
          <div className="space-y-2 mb-3">
            {[rowE, rowF, rowG, rowH].map((rowSeats, idx) => {
              const rowLabel = ['E', 'F', 'G', 'H'][idx];
              return (
                <div key={rowLabel} className="flex items-center justify-center gap-2">
                  <span className="w-5 text-xs font-semibold text-amber-500/80 text-right mr-1">{rowLabel}</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      const isOccupied = seat.status === 'occupied';

                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={isOccupied}
                          aria-label={`Ghế VIP ${seat.id}, giá ${formatCurrency(seat.price)}`}
                          title={`Ghế ${seat.id} (VIP Prime): ${formatCurrency(seat.price)}`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] font-medium flex items-center justify-center transition-all duration-150 relative ${
                            isOccupied
                              ? 'bg-zinc-800/40 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                              : isSelected
                              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300'
                              : 'bg-amber-950/40 text-amber-200 border border-amber-600/50 hover:bg-amber-900/60 hover:border-amber-400'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : seat.number}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-5 text-xs font-semibold text-amber-500/80 text-left ml-1">{rowLabel}</span>
                </div>
              );
            })}
          </div>

          {/* Section Divider - Couple Sweetbox */}
          <div className="flex items-center justify-center gap-2 my-1">
            <div className="h-px bg-rose-500/20 w-16" />
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 tracking-wider uppercase">
              <Heart className="w-3 h-3 fill-rose-500/30" />
              <span>Hàng Ghế Đôi Sweetbox (Dành cho 2 người)</span>
            </div>
            <div className="h-px bg-rose-500/20 w-16" />
          </div>

          {/* Couple Row J */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-5 text-xs font-semibold text-rose-400/80 text-right mr-1">J</span>
            <div className="flex items-center gap-3">
              {rowJ.map((seat) => {
                const isSelected = selectedSeats.some((s) => s.id === seat.id);
                const isOccupied = seat.status === 'occupied';

                return (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeat(seat)}
                    disabled={isOccupied}
                    aria-label={`Ghế đôi ${seat.id}, giá ${formatCurrency(seat.price)}`}
                    title={`Ghế đôi ${seat.id} (Sofa Sweetbox 2 người): ${formatCurrency(seat.price)}`}
                    className={`h-8 sm:h-9 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 ${
                      isOccupied
                        ? 'bg-zinc-800/40 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-60'
                        : isSelected
                        ? 'bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300'
                        : 'bg-rose-950/40 text-rose-200 border border-rose-600/50 hover:bg-rose-900/60 hover:border-rose-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-zinc-950' : 'fill-rose-400/40'}`} />
                    <span>{seat.id}</span>
                  </button>
                );
              })}
            </div>
            <span className="w-5 text-xs font-semibold text-rose-400/80 text-left ml-1">J</span>
          </div>
        </div>
      </div>

      {/* Legend & Seat Info Bar */}
      <div className="w-full mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-zinc-800 border border-zinc-700/60" />
          <span className="text-zinc-300">
            Tiêu chuẩn ({formatCurrency(standardPrice)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-950/40 border border-amber-600/50" />
          <span className="text-amber-200 font-medium">
            VIP Prime ({formatCurrency(vipPrice)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-4 rounded bg-rose-950/40 border border-rose-600/50 flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 fill-rose-400/40 text-rose-400" />
          </div>
          <span className="text-rose-200 font-medium">
            Ghế Đôi ({formatCurrency(couplePrice)}/cặp)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-zinc-950">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="text-emerald-400 font-medium">Đang chọn</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-zinc-800/40 border border-zinc-800 text-zinc-600 text-[10px] flex items-center justify-center">
            ✕
          </div>
          <span className="text-zinc-500">Đã bán</span>
        </div>
      </div>

      {/* Real-time selection pill-less banner */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 px-4 py-2.5 bg-zinc-800/60 border border-zinc-700/60 rounded-xl flex items-center gap-3 text-xs w-full max-w-xl justify-between">
          <div className="flex items-center gap-2">
            <Armchair className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-300">Ghế đã chọn:</span>
            <span className="font-bold text-white tracking-wide">
              {selectedSeats.map((s) => s.id).join(', ')}
            </span>
          </div>
          <div className="text-emerald-400 font-semibold tabular-nums text-sm">
            {formatCurrency(selectedSeats.reduce((sum, s) => sum + s.price, 0))}
          </div>
        </div>
      )}

      {selectedSeats.length === 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-zinc-500 text-xs">
          <Info className="w-3.5 h-3.5" />
          <span>Nhấn vào ghế trống trên sơ đồ để chọn vị trí mong muốn.</span>
        </div>
      )}
    </div>
  );
};
