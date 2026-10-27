import { Seat, Showtime, Movie, SeatType } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateSeatsForShowtime = (
  movie: Movie,
  showtime: Showtime,
  selectedSeatIds: string[] = []
): Seat[] => {
  const seats: Seat[] = [];
  const occupiedSet = new Set(showtime.occupiedSeats);
  const selectedSet = new Set(selectedSeatIds);

  const multiplier = showtime.priceMultiplier || 1.0;
  const baseStandard = Math.round(movie.basePrice * multiplier);
  const baseVip = Math.round((movie.basePrice + 25000) * multiplier);
  const baseCouple = Math.round((movie.basePrice * 2 + 40000) * multiplier);

  // Standard Rows: A, B, C, D (10 seats per row)
  const standardRows = ['A', 'B', 'C', 'D'];
  standardRows.forEach((row) => {
    for (let num = 1; num <= 10; num++) {
      const id = `${row}${num}`;
      let status: 'available' | 'selected' | 'occupied' = 'available';
      if (occupiedSet.has(id)) {
        status = 'occupied';
      } else if (selectedSet.has(id)) {
        status = 'selected';
      }

      seats.push({
        id,
        row,
        number: num,
        type: 'standard',
        price: baseStandard,
        status,
      });
    }
  });

  // VIP Rows: E, F, G, H (12 seats per row)
  const vipRows = ['E', 'F', 'G', 'H'];
  vipRows.forEach((row) => {
    for (let num = 1; num <= 12; num++) {
      const id = `${row}${num}`;
      let status: 'available' | 'selected' | 'occupied' = 'available';
      if (occupiedSet.has(id)) {
        status = 'occupied';
      } else if (selectedSet.has(id)) {
        status = 'selected';
      }

      seats.push({
        id,
        row,
        number: num,
        type: 'vip',
        price: baseVip,
        status,
      });
    }
  });

  // Couple / Sweetbox Row: J (5 double seats: J1-J2, J3-J4, J5-J6, J7-J8, J9-J10)
  const couplePairs = [
    { id: 'J1-J2', num: 1, label: 'J1-J2' },
    { id: 'J3-J4', num: 3, label: 'J3-J4' },
    { id: 'J5-J6', num: 5, label: 'J5-J6' },
    { id: 'J7-J8', num: 7, label: 'J7-J8' },
    { id: 'J9-J10', num: 9, label: 'J9-J10' },
  ];

  couplePairs.forEach((pair) => {
    let status: 'available' | 'selected' | 'occupied' = 'available';
    if (occupiedSet.has(pair.id) || occupiedSet.has(`J${pair.num}`) || occupiedSet.has(`J${pair.num + 1}`)) {
      status = 'occupied';
    } else if (selectedSet.has(pair.id)) {
      status = 'selected';
    }

    seats.push({
      id: pair.id,
      row: 'J',
      number: pair.num,
      type: 'couple',
      price: baseCouple,
      status,
      pairId: pair.id,
    });
  });

  return seats;
};

export const getSeatTypeLabel = (type: SeatType): { label: string; desc: string; badgeColor: string } => {
  switch (type) {
    case 'standard':
      return {
        label: 'Ghế Tiêu Chuẩn',
        desc: 'Hàng A - D · Tầm nhìn bao quát sân khấu',
        badgeColor: 'border-slate-600 text-slate-300',
      };
    case 'vip':
      return {
        label: 'Ghế VIP Trung Tâm',
        desc: 'Hàng E - H · Góc nhìn hoàng kim & âm thanh vòm đỉnh cao',
        badgeColor: 'border-amber-500/50 text-amber-300',
      };
    case 'couple':
      return {
        label: 'Ghế Đôi Sweetbox',
        desc: 'Hàng J · Ghế sofa đôi êm ái riêng tư cuối phòng',
        badgeColor: 'border-rose-500/50 text-rose-300',
      };
  }
};
