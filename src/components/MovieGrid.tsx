import React, { useState, useMemo } from 'react';
import { useCinema } from '../context/CinemaContext';
import { Movie } from '../types';
import { Search, Star, Clock, Ticket, Info, Film } from 'lucide-react';
import { MovieDetailModal } from './MovieDetailModal';

export const MovieGrid: React.FC = () => {
  const { movies, startBookingForMovie } = useCinema();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'now_showing' | 'coming_soon'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);

  // Extract all unique genres
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => m.genre.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [movies]);

  // Filter movies
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (movie.originalTitle && movie.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || movie.status === statusFilter;
      const matchGenre = selectedGenre === 'all' || movie.genre.includes(selectedGenre);

      return matchSearch && matchStatus && matchGenre;
    });
  }, [movies, searchQuery, statusFilter, selectedGenre]);

  return (
    <div className="w-full">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Status Tabs (Functional Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl shrink-0 self-start">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tất Cả ({movies.length})
          </button>
          <button
            onClick={() => setStatusFilter('now_showing')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'now_showing'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Đang Chiếu ({movies.filter((m) => m.status === 'now_showing').length})
          </button>
          <button
            onClick={() => setStatusFilter('coming_soon')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'coming_soon'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sắp Chiếu ({movies.filter((m) => m.status === 'coming_soon').length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm phim, đạo diễn, diễn viên..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400/80 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedGenre('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
            selectedGenre === 'all'
              ? 'bg-zinc-800 text-amber-300 border border-amber-400/40'
              : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
          }`}
        >
          Tất cả thể loại
        </button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedGenre === genre
                ? 'bg-zinc-800 text-amber-300 border border-amber-400/40'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-zinc-900/60 border border-zinc-800/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all duration-200 hover:-translate-y-1 shadow-lg"
            >
              {/* Poster 70% height with fallback container */}
              <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.5';
                  }}
                />

                {/* Top Age Classification Tag */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-[10px] font-bold text-amber-400">
                  {movie.ageRating}
                </div>

                {/* Rating badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-[10px] font-bold text-zinc-100 flex items-center gap-1 tabular-nums">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{movie.rating}</span>
                </div>

                {/* Quick overlay preview trigger */}
                <button
                  onClick={() => setModalMovie(movie)}
                  className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-semibold text-white backdrop-blur-[2px]"
                >
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Xem Chi Tiết</span>
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
                    <span>{movie.genre[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{movie.duration}p</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-zinc-300 font-medium">{movie.formats[0]?.split(' ')[0]}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {movie.title}
                  </h3>

                  {movie.originalTitle && (
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {movie.originalTitle}
                    </p>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center gap-2">
                  <button
                    onClick={() => startBookingForMovie(movie)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-400/90 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Đặt Vé</span>
                  </button>

                  <button
                    onClick={() => setModalMovie(movie)}
                    className="p-2 rounded-xl border border-zinc-800 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Thông tin chi tiết"
                    aria-label={`Thông tin chi tiết phim ${movie.title}`}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-zinc-800 rounded-2xl bg-zinc-900/40">
          <Film className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-zinc-300">Không tìm thấy phim phù hợp</h4>
          <p className="text-xs text-zinc-500 mt-1">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc bỏ lọc thể loại.
          </p>
        </div>
      )}

      {/* Modal Detail */}
      <MovieDetailModal movie={modalMovie} onClose={() => setModalMovie(null)} />
    </div>
  );
};
