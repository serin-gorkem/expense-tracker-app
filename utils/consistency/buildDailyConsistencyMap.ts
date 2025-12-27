import { Expense } from "@/models/expense.model";

export type DayKey = string;

export type CalendarDayStatus =
  | "gold"    // active streak
  | "green"   // completed but not active streak
  | "break"   // missed (X)
  | "empty";  // future / no data

export type DayInfo = {
  total: number;
  limit: number;
  hasEntry: boolean;
  pass: boolean;
  status: CalendarDayStatus;
};

/* ---------- Date helpers ---------- */

export function toDayKeyLocal(d: Date): DayKey {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function fromDayKeyLocal(key: DayKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function getTodayKeyLocal(): DayKey {
  const now = new Date();
  return toDayKeyLocal(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0)
  );
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/* ---------- Core ---------- */

export function buildConsistencyDayMap({
  expenses = [],
  dailyLimit,
  month,
}: {
  expenses?: Expense[];
  dailyLimit: number;
  month: Date;
}): Record<DayKey, DayInfo> {
  const todayKey = getTodayKeyLocal();
  const todayDate = fromDayKeyLocal(todayKey);

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  const map: Record<DayKey, DayInfo> = {};

  /* 1️⃣ Init all days */
  for (let d = 1; d <= daysInMonth; d++) {
    const key = toDayKeyLocal(
      new Date(month.getFullYear(), month.getMonth(), d, 12)
    );
    map[key] = {
      total: 0,
      limit: dailyLimit,
      hasEntry: false,
      pass: false,
      status: "empty",
    };
  }

  /* 2️⃣ Aggregate expenses */
  for (const e of expenses) {
    if (e.kind !== "behavioral") continue;
    const date = new Date(e.date);
    if (
      date.getFullYear() !== month.getFullYear() ||
      date.getMonth() !== month.getMonth()
    )
      continue;

    const key = toDayKeyLocal(date);
    map[key].total += e.amount;
    map[key].hasEntry = true;
  }

  /* 3️⃣ Pass calculation */
  Object.values(map).forEach((d) => {
    d.pass = d.hasEntry && d.total <= dailyLimit;
  });

  /* 4️⃣ Active streak (today → backwards) */
  const activeStreak = new Set<DayKey>();
  let cursor = todayDate;

  while (true) {
    const key = toDayKeyLocal(cursor);
    if (!map[key]?.pass) break;
    activeStreak.add(key);
    cursor = addDays(cursor, -1);
  }

  /* 5️⃣ Status assignment */
  for (const [key, info] of Object.entries(map)) {
    const date = fromDayKeyLocal(key);

    if (activeStreak.has(key) && activeStreak.size >= 2) {
      info.status = "gold";
      continue;
    }

    if (info.pass) {
      info.status = "green";
      continue;
    }

    const prevKey = toDayKeyLocal(addDays(date, -1));
    const isPast = date < todayDate;

    if (isPast && map[prevKey]?.pass) {
      info.status = "break";
      continue;
    }

    info.status = "empty";
  }

  return map;
}