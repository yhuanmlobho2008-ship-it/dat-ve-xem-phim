/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CinemaProvider, useCinema } from './context/CinemaContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieGrid } from './components/MovieGrid';
import { BookingView } from './components/BookingView';
import { MyTicketsView } from './components/MyTicketsView';
import { AdminDashboard } from './components/AdminDashboard';
import { TicketConfirmationModal } from './components/TicketConfirmationModal';
import { ToastContainer } from './components/ToastContainer';
import { Film, ShieldCheck, Ticket, MapPin, Phone, Mail } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useCinema();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-950">
      {/* Universal Top Bar */}
      <Navbar />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'movies' && (
          <div>
            <HeroBanner />
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Film className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Phim Đang & Sắp Chiếu Rạp
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Lựa chọn từ 20 tác phẩm điện ảnh đỉnh cao, hỗ trợ định dạng IMAX Laser, 3D và 2D.
              </p>
            </div>
            <MovieGrid />
          </div>
        )}

        {activeTab === 'booking' && <BookingView />}

        {activeTab === 'my-tickets' && <MyTicketsView />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals & Overlays */}
      <TicketConfirmationModal />
      <ToastContainer />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 mt-16 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center">
                <Film className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold text-base text-white tracking-wide">CineWave</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Trải nghiệm đặt vé trực tuyến hiện đại với sơ đồ ghế tiêu chuẩn, VIP và ghế đôi Sweetbox trực quan.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 mb-3 uppercase tracking-wider text-[11px]">
              Cụm Rạp CineWave
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Vincom Landmark 81, TP.HCM</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Saigon Centre, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Paragon Premier, Quận 7, TP.HCM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 mb-3 uppercase tracking-wider text-[11px]">
              Loại Ghế & Dịch Vụ
            </h4>
            <ul className="space-y-1.5 text-zinc-400 text-xs">
              <li>Ghế Tiêu Chuẩn (Hàng A - D)</li>
              <li>Ghế VIP Prime (Hàng E - H)</li>
              <li>Ghế Đôi Sweetbox (Hàng J)</li>
              <li>Combo Bắp Phô Mai & Nước Ngọt</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-200 mb-3 uppercase tracking-wider text-[11px]">
              Hỗ Trợ Khách Hàng
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Hotline: 1900 6868 (8:00 - 23:00)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@cinewave.vn</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Truy cập Bảng Quản Trị Viên</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 py-4 text-center text-[11px] text-zinc-400">
          © 2026 CineWave Cinema. Hệ thống đặt vé và quản lý rạp chiếu phim trực tuyến.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CinemaProvider>
      <AppContent />
    </CinemaProvider>
  );
}
