import React from 'react';
import { Movie } from '../types';
import { X, Star, Clock, User, Calendar, Film, Ticket } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose }) => {
  const { startBookingForMovie } = useCinema();

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-950/70 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-zinc-950">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
        </div>

        <div className="p-6 -mt-16 relative z-10 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-24 h-36 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border-2 border-zinc-700 shadow-xl">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 pt-6">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                {movie.formats.join(' · ')}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {movie.title}
              </h2>
              {movie.originalTitle && (
                <div className="text-xs text-zinc-400">{movie.originalTitle}</div>
              )}

              <div className="flex items-center gap-3 text-xs text-zinc-300 mt-2">
                <div className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{movie.rating}/10</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{movie.duration} phút</span>
                </div>
                <span>·</span>
                <span className="text-amber-300 font-semibold">{movie.ageRating}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Nội dung phim
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800">
            <div>
              <span className="text-zinc-500 block text-[11px]">Đạo diễn</span>
              <span className="font-semibold text-zinc-200">{movie.director}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Khởi chiếu</span>
              <span className="font-semibold text-zinc-200">{movie.releaseDate}</span>
            </div>
            <div className="col-span-2">
              <span className="text-zinc-500 block text-[11px]">Diễn viên chính</span>
              <span className="font-semibold text-zinc-200">{movie.cast.join(', ')}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                startBookingForMovie(movie);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-amber-400/20"
            >
              <Ticket className="w-4 h-4" />
              <span>Chọn Ghế Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
