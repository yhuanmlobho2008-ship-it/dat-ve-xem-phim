import React from 'react';
import { useCinema } from '../context/CinemaContext';
import { formatCurrency } from '../utils/seatGenerator';
import {
  CheckCircle,
  X,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Printer,
  Sparkles,
  QrCode,
  ArrowRight,
} from 'lucide-react';

export const TicketConfirmationModal: React.FC = () => {
  const { confirmedBooking, setConfirmedBooking, setActiveTab, showToast } = useCinema();

  if (!confirmedBooking) return null;

  const handlePrint = () => {
    showToast('Đang tạo bản in vé điện tử...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleGoToMyTickets = () => {
    setConfirmedBooking(null);
    setActiveTab('my-tickets');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-zinc-100 flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/60 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Đặt Chỗ Thành Công!</h3>
              <p className="text-xs text-emerald-400/90 font-medium">Vé đã được lưu vào lịch sử của bạn</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmedBooking(null)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Đóng popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* E-Ticket Card Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Ticket Header Stub */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  VÉ ĐIỆN TỬ CINEWAVE
                </span>
                <h4 className="text-lg font-extrabold text-white mt-0.5">
                  {confirmedBooking.movieTitle}
                </h4>
                <div className="text-xs text-zinc-400 mt-1">
                  {confirmedBooking.format} · {confirmedBooking.theater}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-zinc-500 block uppercase">Mã Đặt Chỗ</span>
                <span className="text-base font-mono font-bold text-amber-400 tracking-wider">
                  {confirmedBooking.bookingCode}
                </span>
              </div>
            </div>

            {/* Simulated QR Code / Barcode */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shadow-inner">
                  {/* Clean SVG visual QR Code pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-950 fill-current">
                    <rect x="0" y="0" width="30" height="30" rx="3" />
                    <rect x="6" y="6" width="18" height="18" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />

                    <rect x="70" y="0" width="30" height="30" rx="3" />
                    <rect x="76" y="6" width="18" height="18" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />

                    <rect x="0" y="70" width="30" height="30" rx="3" />
                    <rect x="6" y="76" width="18" height="18" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />

                    <rect x="40" y="10" width="12" height="12" />
                    <rect x="55" y="25" width="8" height="15" />
                    <rect x="40" y="45" width="20" height="20" />
                    <rect x="70" y="55" width="15" height="15" />
                    <rect x="55" y="80" width="12" height="12" />
                    <rect x="75" y="80" width="18" height="8" />
                  </svg>
                </div>

                <div className="text-xs">
                  <div className="font-semibold text-zinc-200">Quét mã tại cổng vào rạp</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Xuất trình trước giờ chiếu 10 phút</div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-medium">Trạng thái: Đã xác nhận chỗ</div>
                </div>
              </div>

              {/* Barcode graphic lines */}
              <div className="hidden sm:flex flex-col items-end opacity-75">
                <div className="flex gap-0.5 h-8 items-end">
                  {[2, 1, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 1, 3].map((w, i) => (
                    <div key={i} className={`bg-zinc-300 h-full`} style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <div className="text-[9px] font-mono text-zinc-500 mt-1">{confirmedBooking.bookingCode}</div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <div>
                <span className="text-zinc-500 block text-[10px]">Thời Gian & Phòng Chiếu</span>
                <span className="font-semibold text-white">
                  {confirmedBooking.showtimeTime} · {confirmedBooking.showtimeDate}
                </span>
                <span className="block text-zinc-400 text-[11px] mt-0.5">{confirmedBooking.room}</span>
              </div>

              <div>
                <span className="text-zinc-500 block text-[10px]">Vị Trí Chỗ Ngồi ({confirmedBooking.seats.length} ghế)</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  {confirmedBooking.seats.map((s) => s.id).join(', ')}
                </span>
                <span className="block text-zinc-400 text-[11px] mt-0.5">
                  {confirmedBooking.seats.map((s) => (s.type === 'vip' ? 'VIP' : s.type === 'couple' ? 'Đôi' : 'TC')).join(' · ')}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Khách hàng:</span>
                <span className="font-medium text-zinc-200">{confirmedBooking.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Số điện thoại:</span>
                <span className="font-medium text-zinc-200">{confirmedBooking.userPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Email:</span>
                <span className="font-medium text-zinc-200">{confirmedBooking.userEmail}</span>
              </div>
            </div>

            {/* Concessions list if any */}
            {confirmedBooking.concessions.length > 0 && (
              <div className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] mb-1">Combo bắp nước đi kèm</span>
                {confirmedBooking.concessions.map((c, i) => (
                  <div key={i} className="flex justify-between text-zinc-300">
                    <span>{c.name} x{c.quantity}</span>
                    <span className="tabular-nums">{formatCurrency(c.price * c.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total Paid */}
            <div className="flex justify-between items-center p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm">
              <span className="font-semibold text-amber-200">Tổng thanh toán dự kiến:</span>
              <span className="font-extrabold text-amber-400 text-base tabular-nums">
                {formatCurrency(confirmedBooking.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 font-semibold text-xs text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-zinc-300" />
            <span>In / Lưu Vé PDF</span>
          </button>

          <button
            onClick={handleGoToMyTickets}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-zinc-950 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20"
          >
            <span>Xem Trong Vé Của Tôi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
