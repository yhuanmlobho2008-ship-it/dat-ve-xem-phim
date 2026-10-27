import React from 'react';
import { useCinema } from '../context/CinemaContext';
import { formatCurrency } from '../utils/seatGenerator';
import { Popcorn, Plus, Minus, Flame, Heart, Sparkles, CupSoda } from 'lucide-react';
import { ConcessionItem } from '../types';

export const ConcessionsSelector: React.FC = () => {
  const { concessionsList, selectedConcessions, updateConcessionQuantity } = useCinema();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'popcorn':
        return <Popcorn className="w-5 h-5 text-amber-400" />;
      case 'heart':
        return <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />;
      case 'crown':
        return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'cup-soda':
        return <CupSoda className="w-5 h-5 text-sky-400" />;
      default:
        return <Popcorn className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mt-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Popcorn className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Bắp Nước & Combo Ưu Đãi (Tùy chọn)
          </h3>
        </div>
        <span className="text-xs text-zinc-400">Nhận tại quầy rạp khi đến xem</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {concessionsList.map((item: ConcessionItem) => {
          const selected = selectedConcessions.find((c) => c.item.id === item.id);
          const qty = selected ? selected.quantity : 0;

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                qty > 0
                  ? 'bg-amber-500/10 border-amber-400/60'
                  : 'bg-zinc-800/40 border-zinc-700/50 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50">
                  {getIcon(item.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-100 truncate">{item.name}</h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 tabular-nums">
                  {formatCurrency(item.price)}
                </span>

                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-lg p-0.5">
                  <button
                    onClick={() => updateConcessionQuantity(item, -1)}
                    disabled={qty === 0}
                    className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                    aria-label={`Giảm số lượng ${item.name}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="w-5 text-center text-xs font-bold text-white tabular-nums">
                    {qty}
                  </span>

                  <button
                    onClick={() => updateConcessionQuantity(item, 1)}
                    className="w-6 h-6 rounded bg-amber-500 text-zinc-950 font-bold flex items-center justify-center hover:bg-amber-400 transition-colors"
                    aria-label={`Thêm số lượng ${item.name}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
