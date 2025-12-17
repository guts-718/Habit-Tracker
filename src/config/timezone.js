export function getTodayIST() {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(new Date());

  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return {
    date: `${map.year}-${map.month}-${map.day}`, // YYYY-MM-DD
    day: map.weekday                           // Mon, Tue, etc.
  };
}
