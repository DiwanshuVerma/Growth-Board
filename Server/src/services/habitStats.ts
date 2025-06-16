
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
