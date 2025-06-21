
import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns";


export function getCurrentStreak(completedDates: string[], upToDate: string): number {
  const sorted = [...completedDates].sort().reverse() // latest first
  const targetDate = new Date(upToDate)
  let streak = 0

  for (const iso of sorted) {
    const date = new Date(iso)

    const diff = Math.floor(
      (targetDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diff === streak) {
      streak++
    } else if (diff > streak) {
      break
    }
  }

  return streak
}

export function getUserStreaks(allCompletedDates: string[]) {
  const checkedDatesSet = new Set<string>();
  allCompletedDates.forEach(date => checkedDatesSet.add(date));

  // Sort and prepare for longest streak calc
  const sorted = [...checkedDatesSet].sort(); // ascending

  let longestStreak = 0;
  let currentRun = 1;

  if (sorted.length === 1) {
    longestStreak = 1;
  } else if (sorted.length > 1) {
    for (let i = 1; i < sorted.length; i++) {
      const prev = parseISO(sorted[i - 1]);
      const curr = parseISO(sorted[i]);
      const diff = differenceInCalendarDays(curr, prev);

      if (diff === 1) {
        currentRun++;
        longestStreak = Math.max(longestStreak, currentRun);
      } else if (diff > 1) {
        currentRun = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentRun);
  }

  // ✅ Current streak based on today or yesterday
  let currentStreak = 0;
  const today = format(new Date(), "yyyy-MM-dd");
  let checkDate = checkedDatesSet.has(today)
    ? new Date()
    : subDays(new Date(), 1);

  while (checkedDatesSet.has(format(checkDate, "yyyy-MM-dd"))) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  return {
    longestStreak,
    currentStreak,
  };
}

