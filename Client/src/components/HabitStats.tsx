import { useMemo } from 'react'
import { format, startOfWeek, endOfWeek, subDays } from 'date-fns'

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
import { calculateUserStreaks } from '@/utils/streaks';

export default function HabitStats() {
  const allActiveHabits = useAppSelector(state => state.habit.activeHabits || [])
  const allCompletedHabits = useAppSelector(state => state.habit.completedHabits || [])

  const isValidHabit = (habit: any): habit is Habit =>
    habit && typeof habit === 'object' && '_id' in habit && 'goalType' in habit && Array.isArray(habit.completedDates)

  const activeHabits = useMemo(() => allActiveHabits.filter(isValidHabit), [allActiveHabits])
  const completedHabits = useMemo(() => allCompletedHabits.filter(isValidHabit), [allCompletedHabits])
  const allHabits = useMemo(() => [...activeHabits, ...completedHabits], [activeHabits, completedHabits])


  const totalActive = activeHabits.length
  const totalCompleted = completedHabits.length
  const totalCreated = allHabits.length

const {
  longestDailyStreak,
  currentDailyStreak,
  totalDailyHabits,
  totalDailyCheckedToday,
} = useMemo(() => {

  // collect all completed dates across all habits
  const completedDates: string[] = []
  allHabits.forEach(h => {
    h.completedDates.forEach(d => typeof d === 'string' && completedDates.push(d))
  })

  const { longestStreak, currentStreak } = calculateUserStreaks(completedDates)

  const todayISO = format(new Date(), 'yyyy-MM-dd')
  const totalDailyCheckedToday = allHabits.reduce(
    (count, h) => (h.completedDates.includes(todayISO) ? count + 1 : count),
    0
  )

  return {
    longestDailyStreak: longestStreak,
    currentDailyStreak: currentStreak,
    totalDailyHabits: allHabits.length,
    totalDailyCheckedToday,
  }
}, [allHabits])



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