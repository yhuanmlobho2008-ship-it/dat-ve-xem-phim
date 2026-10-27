import React from 'react';
import { useCinema } from '../context/CinemaContext';
import { Movie } from '../types';
import { Ticket, Star, Clock, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { movies, startBookingForMovie } = useCinema();

  // Pick top featured movie (mv-1 or first)
  const featuredMovie: Movie = movies[0];

  if (!featuredMovie) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 mb-10 shadow-2xl">
      {/* Background Cinematic Banner */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px]">
        <img
          src={featuredMovie.bannerUrl || featuredMovie.posterUrl}
          alt={featuredMovie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Scrim gradient overlay for 4.5:1 text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent max-w-3xl" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-end max-w-2xl">
        {/* Unboxed metadata line with typographic separators */}
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2 tracking-wide uppercase">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            BOM TẤN THÁNG NÀY
          </span>
          <span aria-hidden="true">·</span>
          <span>{featuredMovie.formats.join(' / ')}</span>
          <span aria-hidden="true">·</span>
          <span className="text-zinc-400">{featuredMovie.ageRating}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
          {featuredMovie.title}
        </h1>

        {featuredMovie.originalTitle && (
          <p className="text-sm sm:text-base font-medium text-zinc-300 mt-1">
            {featuredMovie.originalTitle}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 my-3">
          <div className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{featuredMovie.rating}/10</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{featuredMovie.duration} phút</span>
          </div>
          <span aria-hidden="true">·</span>
          <span>{featuredMovie.genre.join(', ')}</span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300/90 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-6">
          {featuredMovie.synopsis}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => startBookingForMovie(featuredMovie)}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span>Đặt Vé Ngay</span>
          </button>

          <span className="text-xs text-zinc-400 hidden sm:inline">
            Đạo diễn: <strong className="text-zinc-200">{featuredMovie.director}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
