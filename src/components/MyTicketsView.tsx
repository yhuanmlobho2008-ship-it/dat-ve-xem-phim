import React, { useState } from 'react';
import { useCinema } from '../context/CinemaContext';
import { formatCurrency } from '../utils/seatGenerator';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Trash2,
  CheckCircle,
  AlertCircle,
  Film,
  ArrowRight,
} from 'lucide-react';

export const MyTicketsView: React.FC = () => {
  const { bookings, currentUser, cancelBooking, setActiveTab, setConfirmedBooking } = useCinema();

  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all');

  // Filter bookings for active user
  const userBookings = bookings.filter((b) => {
    const isUser = b.userId === currentUser.id;
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return isUser && matchStatus;
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Lịch Sử Đặt Vé Của Tôi
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Tài khoản: <strong className="text-zinc-200">{currentUser.name}</strong> ·{' '}
            {currentUser.membershipTier} · {currentUser.phone}
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-amber-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'confirmed'
                ? 'bg-amber-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Đã Xác Nhận
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'cancelled'
                ? 'bg-amber-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Đã Hủy
          </button>
        </div>
      </div>

      {userBookings.length > 0 ? (
        <div className="space-y-4">
          {userBookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';

            return (
              <div
                key={b.id}
                className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                  isConfirmed
                    ? 'bg-zinc-900/80 border-zinc-800 shadow-xl'
                    : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/60">
                      <img
                        src={b.moviePoster}
                        alt={b.movieTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          {b.bookingCode}
                        </span>
                        <span
                          className={`text-[11px] font-semibold flex items-center gap-1 ${
                            isConfirmed ? 'text-emerald-400' : 'text-zinc-500 line-through'
                          }`}
                        >
                          {isConfirmed ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Đã Xác Nhận
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" />
                              Đã Hủy
                            </>
                          )}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{b.movieTitle}</h3>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {b.format} · {b.theater}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-zinc-500">Tổng chi phí ước tính</div>
                    <div className="text-base font-extrabold text-amber-400 tabular-nums">
                      {formatCurrency(b.totalAmount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">Ngày chiếu</div>
                      <div className="font-semibold text-zinc-200">{b.showtimeDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">Suất chiếu · Phòng</div>
                      <div className="font-semibold text-zinc-200">
                        {b.showtimeTime} · {b.room}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="text-[10px] text-zinc-500">Chỗ ngồi ({b.seats.length} ghế)</div>
                      <div className="font-bold text-amber-300">
                        {b.seats.map((s) => s.id).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {b.concessions.length > 0 && (
                  <div className="text-xs text-zinc-400 mb-4 px-3 py-2 bg-zinc-950/30 rounded-xl border border-zinc-800/40">
                    <span className="text-zinc-500 font-medium">Bắp nước kèm theo: </span>
                    <span>
                      {b.concessions.map((c) => `${c.name} (x${c.quantity})`).join(', ')}
                    </span>
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-500">
                    Đặt lúc: {new Date(b.createdAt).toLocaleString('vi-VN')}
                  </span>

                  <div className="flex items-center gap-2">
                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => setConfirmedBooking(b)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mở Mã Vé QR</span>
                        </button>

                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Hủy Vé</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center border border-zinc-800 rounded-2xl bg-zinc-900/40">
          <Film className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Chưa có lịch sử đặt vé nào</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Bạn chưa đặt vé nào cho tài khoản này. Hãy chọn phim yêu thích và trải nghiệm chọn ghế rạp chiếu ngay!
          </p>
          <button
            onClick={() => setActiveTab('movies')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-md shadow-amber-400/20"
          >
            <span>Khám Phá Phim Chiếu Rạp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
