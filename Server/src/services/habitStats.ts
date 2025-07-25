
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



export function calculateUserStreaks(dates: string[]) {
  const normalizedSet = new Set(dates.map(date => date.split('T')[0]))
  const sorted = [...normalizedSet].sort()
  const parsedDates = sorted.map(d => parseISO(d))

  // Longest streak
  let longest = 0
  let run = 1

  if (parsedDates.length === 1) longest = 1
  else if (parsedDates.length > 1) {
    for (let i = 1; i < parsedDates.length; i++) {
      const diff = differenceInCalendarDays(parsedDates[i], parsedDates[i - 1])
      if (diff === 1) run++
      else if (diff > 1) {
        longest = Math.max(longest, run)
        run = 1
      }
    }
    longest = Math.max(longest, run)
  }

  // Current streak: check today or yesterday
  let current = 0
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd')

  if (normalizedSet.has(todayStr)) {
    let check = today
    while (normalizedSet.has(format(check, 'yyyy-MM-dd'))) {
      current++
      check = subDays(check, 1)
    }
  } else if (normalizedSet.has(yesterdayStr)) {
    let check = subDays(today, 1)
    while (normalizedSet.has(format(check, 'yyyy-MM-dd'))) {
      current++
      check = subDays(check, 1)
    }
  } else {
    current = 0
  }

  return {
    longestStreak: longest,
    currentStreak: current
  }
}

