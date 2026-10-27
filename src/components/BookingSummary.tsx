import React, { useState } from 'react';
import { useCinema } from '../context/CinemaContext';
import { formatCurrency } from '../utils/seatGenerator';
import {
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Film,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const BookingSummary: React.FC = () => {
  const {
    selectedMovie,
    selectedShowtime,
    selectedSeats,
    selectedConcessions,
    currentUser,
    confirmBooking,
    resetBookingFlow,
  } = useCinema();

  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if current user changes
  React.useEffect(() => {
    setCustomerName(currentUser.name);
    setCustomerEmail(currentUser.email);
    setCustomerPhone(currentUser.phone);
  }, [currentUser]);

  if (!selectedMovie || !selectedShowtime) return null;

  const standardSeats = selectedSeats.filter((s) => s.type === 'standard');
  const vipSeats = selectedSeats.filter((s) => s.type === 'vip');
  const coupleSeats = selectedSeats.filter((s) => s.type === 'couple');

  const seatTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const concessionTotal = selectedConcessions.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const totalAmount = seatTotal + concessionTotal;

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      confirmBooking({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      });
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Tóm Tắt Đặt Vé & Giỏ Hàng
            </h3>
          </div>
          {selectedSeats.length > 0 && (
            <button
              onClick={resetBookingFlow}
              className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Đặt lại ghế đã chọn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bỏ chọn</span>
            </button>
          )}
        </div>

        {/* Movie Overview Thumbnail Card */}
        <div className="flex gap-3.5 my-4 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
          <div className="w-16 h-22 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/60 shadow-md">
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              <Film className="w-3 h-3" />
              <span>{selectedShowtime.format}</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate mt-0.5">
              {selectedMovie.title}
            </h4>
            <div className="text-xs text-zinc-400 truncate mt-0.5">
              {selectedMovie.genre.join(', ')} · {selectedMovie.duration} phút
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-2">
              <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
              <span className="truncate">{selectedShowtime.theater}</span>
            </div>
          </div>
        </div>

        {/* Showtime & Room Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <div>
              <div className="text-[10px] text-zinc-500">Ngày chiếu</div>
              <div className="font-semibold text-zinc-200">{selectedShowtime.date}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <div className="text-[10px] text-zinc-500">Suất chiếu · Phòng</div>
              <div className="font-semibold text-zinc-200">
                {selectedShowtime.time} · {selectedShowtime.room}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Seats Itemized Breakdown */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Ghế đã chọn ({selectedSeats.length})
          </div>

          {selectedSeats.length > 0 ? (
            <div className="space-y-2">
              {standardSeats.length > 0 && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-zinc-800/40 border border-zinc-800">
                  <div>
                    <span className="font-medium text-zinc-300">Tiêu chuẩn: </span>
                    <span className="font-bold text-white">
                      {standardSeats.map((s) => s.id).join(', ')}
                    </span>
                    <span className="text-zinc-500 text-[11px] ml-1">
                      ({standardSeats.length} x {formatCurrency(standardSeats[0]?.price || 0)})
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-200 tabular-nums">
                    {formatCurrency(standardSeats.reduce((s, x) => s + x.price, 0))}
                  </span>
                </div>
              )}

              {vipSeats.length > 0 && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30">
                  <div>
                    <span className="font-medium text-amber-300">VIP Prime: </span>
                    <span className="font-bold text-white">
                      {vipSeats.map((s) => s.id).join(', ')}
                    </span>
                    <span className="text-amber-500/80 text-[11px] ml-1">
                      ({vipSeats.length} x {formatCurrency(vipSeats[0]?.price || 0)})
                    </span>
                  </div>
                  <span className="font-semibold text-amber-300 tabular-nums">
                    {formatCurrency(vipSeats.reduce((s, x) => s + x.price, 0))}
                  </span>
                </div>
              )}

              {coupleSeats.length > 0 && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30">
                  <div>
                    <span className="font-medium text-rose-300">Ghế đôi Sweetbox: </span>
                    <span className="font-bold text-white">
                      {coupleSeats.map((s) => s.id).join(', ')}
                    </span>
                    <span className="text-rose-400/80 text-[11px] ml-1">
                      ({coupleSeats.length} cặp)
                    </span>
                  </div>
                  <span className="font-semibold text-rose-300 tabular-nums">
                    {formatCurrency(coupleSeats.reduce((s, x) => s + x.price, 0))}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-3 px-3 rounded-lg border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
              Chưa chọn chỗ ngồi. Vui lòng bấm chọn ghế trên sơ đồ.
            </div>
          )}
        </div>

        {/* Concessions in Cart */}
        {selectedConcessions.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Bắp nước & Combo ({selectedConcessions.length})
            </div>
            <div className="space-y-1.5">
              {selectedConcessions.map((c) => (
                <div
                  key={c.item.id}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-zinc-800/40 border border-zinc-800"
                >
                  <div className="truncate mr-2">
                    <span className="font-medium text-zinc-200">{c.item.name}</span>
                    <span className="text-zinc-500 text-[11px] ml-1 tabular-nums">x{c.quantity}</span>
                  </div>
                  <span className="font-semibold text-zinc-300 tabular-nums shrink-0">
                    {formatCurrency(c.item.price * c.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Information (Editable) */}
        <div className="mb-5 pt-3 border-t border-zinc-800">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Thông tin người đặt vé</span>
            <span className="text-[10px] text-zinc-500 lowercase">nhận mã vé điện tử</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="relative">
              <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Họ và tên người nhận vé"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Số điện thoại"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Total & Confirmation Button */}
      <div className="pt-4 border-t border-zinc-800">
        <div className="space-y-1.5 text-xs text-zinc-400 mb-3">
          <div className="flex justify-between">
            <span>Tiền vé ({selectedSeats.length} ghế):</span>
            <span className="text-zinc-200 tabular-nums">{formatCurrency(seatTotal)}</span>
          </div>
          {concessionTotal > 0 && (
            <div className="flex justify-between">
              <span>Bắp nước combo:</span>
              <span className="text-zinc-200 tabular-nums">{formatCurrency(concessionTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-zinc-800">
            <span>Tổng chi phí ước tính:</span>
            <span className="text-amber-400 text-base tabular-nums">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0 || isSubmitting}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
            selectedSeats.length > 0 && !isSubmitting
              ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-400/20 active:scale-[0.98]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? (
            <span>Đang xuất vé...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận Đặt Chỗ ({selectedSeats.length} Ghế)</span>
            </>
          )}
        </button>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Đặt chỗ nhanh không cần thanh toán trước · Nhận vé tức thì</span>
        </div>
      </div>
    </div>
  );
};
