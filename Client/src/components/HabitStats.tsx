import { useMemo } from 'react'
import { format, parseISO, differenceInCalendarDays, startOfWeek, endOfWeek, subDays } from 'date-fns'

// import { type Habit } from '@/features/habits/habitSlice'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { useAppSelector } from '@/app/hooks'
import type { Habit } from '@/features/habits/types';

export default function HabitStats() {
  const allActiveHabits = useAppSelector(state => state.habit.activeHabits || [])
  const allCompletedHabits = useAppSelector(state => state.habit.completedHabits || [])

  const isValidHabit = (habit: any): habit is Habit =>
    habit && typeof habit === 'object' && '_id' in habit && 'goalType' in habit && Array.isArray(habit.completedDates)

  const activeHabits = useMemo(() => allActiveHabits.filter(isValidHabit), [allActiveHabits])
  const completedHabits = useMemo(() => allCompletedHabits.filter(isValidHabit), [allCompletedHabits])
  const allHabits = useMemo(() => [...activeHabits, ...completedHabits], [activeHabits, completedHabits])

  const todayISO = format(new Date(), 'yyyy-MM-dd')

  const allCheckedDates = useMemo(() => {
    const globalDates = new Set<string>()
    allHabits.forEach(habit =>
      habit.completedDates.forEach(date => typeof date === 'string' && globalDates.add(date))
    )
    return Array.from(globalDates).sort()
  }, [allHabits])

  const totalActive = activeHabits.length
  const totalCompleted = completedHabits.length
  const totalCreated = allHabits.length

  const {
    longestDailyStreak,
    currentDailyStreak,
    totalDailyHabits,
    totalDailyCheckedToday
  } = useMemo(() => {
    const dailyHabits = allHabits.filter(h => h.goalType === 'Daily')
    const checkedDatesSet = new Set<string>()
    dailyHabits.forEach(h => h.completedDates.forEach(date => checkedDatesSet.add(date)))

    // Longest Daily Streak from all habit dates
    let longestStreak = 0
    let currentRun = 1

    if (allCheckedDates.length > 0) {
      // Handle single date case
      if (allCheckedDates.length === 1) {
        longestStreak = 1
      } else {
        // Calculate streak for multiple dates
        for (let i = 1; i < allCheckedDates.length; i++) {
          const prev = parseISO(allCheckedDates[i - 1])
          const curr = parseISO(allCheckedDates[i])
          const diff = differenceInCalendarDays(curr, prev)
          if (diff === 1) {
            currentRun++
            longestStreak = Math.max(longestStreak, currentRun)
          } else if (diff > 1) {
            currentRun = 1
          }
        }
        // Don't forget to check the last run
        longestStreak = Math.max(longestStreak, currentRun)
      }
    }

    // Current Daily Streak (based on today)
    let currentStreak = 0
    let checkDate = checkedDatesSet.has(todayISO) ? new Date() : subDays(new Date(), 1)
    while (checkedDatesSet.has(format(checkDate, 'yyyy-MM-dd'))) {
      currentStreak++
      checkDate = subDays(checkDate, 1)
    }

    const checkedToday = dailyHabits.reduce(
      (count, h) => (h.completedDates.includes(todayISO) ? count + 1 : count),
      0
    )

    return {
      longestDailyStreak: longestStreak,
      currentDailyStreak: currentStreak,
      totalDailyHabits: dailyHabits.length,
      totalDailyCheckedToday: checkedToday
    }
  }, [allHabits, allCheckedDates, todayISO])

  const { weeklySuccessCount, totalWeeklyHabits } = useMemo(() => {
    const weeklyHabits = allHabits.filter(h => h.goalType === 'Weekly')

    if (weeklyHabits.length === 0) return { weeklySuccessCount: 0, totalWeeklyHabits: 0 }

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 })

    const weekDates = new Set<string>()
    for (let d = weekStart; d <= weekEnd; d = subDays(new Date(d.getTime() + 86400000), -1)) {
      weekDates.add(format(d, 'yyyy-MM-dd'))
    }

    let successCount = 0
    weeklyHabits.forEach(habit => {
      const completedInWeek = habit.completedDates.filter(d => weekDates.has(d)).length
      if (completedInWeek >= (habit.targetStreak || 1)) {
        successCount++
      }
    })

    return { weeklySuccessCount: successCount, totalWeeklyHabits: weeklyHabits.length }
  }, [allHabits])

  const overallCompletionRate = useMemo(() => {
    const dailyRate =
      totalDailyHabits === 0 ? 0 : (totalDailyCheckedToday / totalDailyHabits) * 100
    const weeklyRate =
      totalWeeklyHabits === 0 ? 0 : (weeklySuccessCount / totalWeeklyHabits) * 100

    return totalDailyHabits + totalWeeklyHabits === 0
      ? 0
      : Math.round((dailyRate + weeklyRate) / 2)
  }, [totalDailyHabits, totalDailyCheckedToday, totalWeeklyHabits, weeklySuccessCount])

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-3 gap-4">
      <StatCard title="Total Habits" desc="Active + Completed" value={totalCreated} />
      <StatCard
        title="Active / Completed"
        desc="Current Status"
        customContent={
          <>
            <p><span className="font-medium text-sm">Active:</span> {totalActive}</p>
            <p><span className="font-medium text-sm">Completed:</span> {totalCompleted}</p>
          </>
        }
      />
      <StatCard title="Longest Daily Streak" desc="Your best streak" value={`${longestDailyStreak}d`} />
      <StatCard title="Current Daily Streak" desc="Consecutive days with habits" value={`${currentDailyStreak}d`} />
      <StatCard
        title="Daily Completion"
        desc={
          totalDailyHabits === 0
            ? '—'
            : `${Math.round((totalDailyCheckedToday / totalDailyHabits) * 100)}% checked today`
        }
        value={
          totalDailyHabits === 0
            ? 'N/A'
            : `${Math.round((totalDailyCheckedToday / totalDailyHabits) * 100)}%`
        }
      />
      <StatCard
        title="Weekly Completion"
        desc={
          totalWeeklyHabits === 0
            ? '—'
            : `${Math.round((weeklySuccessCount / totalWeeklyHabits) * 100)}% on track`
        }
        value={
          totalWeeklyHabits === 0
            ? 'N/A'
            : `${Math.round((weeklySuccessCount / totalWeeklyHabits) * 100)}%`
        }
      />
      <StatCard title="Overall Completion" desc="Average daily & weekly" value={`${overallCompletionRate}%`} />
    </div>
  )
}

// === Reusable Card ===
function StatCard({ title, desc, value, customContent }: { title: string, desc: string, value?: string | number, customContent?: React.ReactNode }) {
  return (
    <Card className="bg-[#0d1f16e8] w-full h-36 -space-y-2 text-white border-none shadow">
      <CardHeader>
        <CardTitle className='text-sm'>{title}</CardTitle>
        <CardDescription className='text-[12px] text-green-400'>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        {customContent || <p className="text-xl font-semibold">{value}</p>}
      </CardContent>
    </Card>
  )
}