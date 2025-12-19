import { getTodayIST } from "../config/timezone.js";

export function getCurrentWeekRange() {
  const { date } = getTodayIST(); // YYYY-MM-DD
  const d = new Date(date);

  const day = d.getDay(); // 0 = Sun, 1 = Mon
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);

  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (x) => x.toISOString().slice(0, 10);

  return {
    start: fmt(monday),
    end: fmt(sunday)
  };
}
