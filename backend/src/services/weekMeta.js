import { getCurrentWeekRange } from "./weekUtils.js";

export function getWeekMeta() {
  const { start, end } = getCurrentWeekRange();

  const d = new Date(start);
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week =
    Math.ceil(
      (((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7
    );

  return {
    week,
    start,
    end
  };
}
