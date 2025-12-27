/**
 * Haftayı Pazartesi başlatıyoruz (Duolingo gibi)
 * JS getDay(): Sun = 0, Mon = 1, ...
 * Bizim index: Mon = 0, Sun = 6
 */
function normalizeWeekday(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Ay grid’i üretir
 * Çıktı: (number | null)[][]
 * Her iç array = 1 hafta (7 hücre)
 */
export function buildMonthGrid(month: Date): (number | null)[][] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const firstWeekday = normalizeWeekday(firstDayOfMonth.getDay());

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  // Ay başlamadan önceki boş hücreler
  for (let i = 0; i < firstWeekday; i++) {
    currentWeek.push(null);
  }

  // Günleri doldur
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Ay sonu boşlukları
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Ay başlığı formatı
 * "December 2025"
 */
export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}