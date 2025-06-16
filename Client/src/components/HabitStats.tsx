import { useMemo } from 'react'
import { format, parseISO, differenceInCalendarDays, startOfWeek, endOfWeek } from 'date-fns'

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
  // Pull active and completed arrays from Redux with proper validation
  const allActiveHabits = useAppSelector(state => state.habit.activeHabits || [])
const activeHabits = useMemo(
  () => allActiveHabits.filter(h => h && typeof h === 'object'),
  [allActiveHabits]
)

const allCompletedHabits = useAppSelector(state => state.habit.completedHabits || [])
const completedHabits = useMemo(
  () => allCompletedHabits.filter(h => h && typeof h === 'object'),
  [allCompletedHabits]
)

  // Helper function to validate habit objects
  function isValidHabit(habit: any): habit is Habit {
    return habit &&
      typeof habit === 'object' &&
      '_id' in habit &&
      'goalType' in habit &&
      'completedDates' in habit;
  }

  // Merge for "ever-seen" calculations
  const allHabits = useMemo(() => {
    // Filter out invalid habits first
    const validActive = activeHabits.filter(isValidHabit);
    const validCompleted = completedHabits.filter(isValidHabit);
    return [...validActive, ...validCompleted];
  }, [activeHabits, completedHabits]);

  // === 1) TOTAL COUNTS ===
  const totalActive = activeHabits.filter(isValidHabit).length;
  const totalCompleted = completedHabits.filter(isValidHabit).length;
  const totalCreated = allHabits.length;

  // === 2) DAILY-HABIT STREAKS ===
  const {
    longestDailyStreak,
    currentDailyStreak,
    totalDailyActive,
    totalDailyCheckedToday,
  } = useMemo(() => {
    // Filter only valid daily habits
    const dailyAll = allHabits.filter(h => isValidHabit(h) && h.goalType === 'Daily');
    const dailyActive = activeHabits.filter(h => isValidHabit(h) && h.goalType === 'Daily');

    let globalLongest = 0;
    let globalCurrent = 0;
    const todayISO = format(new Date(), 'yyyy-MM-dd');
    let checkedTodayCount = 0;

    dailyAll.forEach((h) => {
      // Ensure completedDates is an array
      const completedDates = Array.isArray(h.completedDates) ? h.completedDates : [];

      // Dedupe & sort each habit's dates
      const uniqueDates = Array.from(new Set(completedDates)).sort();

      // 2a) Longest ever consecutive run:
      let localMax = uniqueDates.length > 0 ? 1 : 0;
      let runCount = localMax;

      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = parseISO(uniqueDates[i - 1]);
        const curr = parseISO(uniqueDates[i]);
        if (differenceInCalendarDays(curr, prev) === 1) {
          runCount += 1;
          localMax = Math.max(localMax, runCount);
        } else {
          runCount = 1;
        }
      }
      globalLongest = Math.max(globalLongest, localMax);

      // 2b) Current streak up to today:
      let currStreak = 0;
      let cursor = parseISO(todayISO);
      while (completedDates.includes(format(cursor, 'yyyy-MM-dd'))) {
        currStreak += 1;
        cursor = new Date(cursor.getTime() - 1000 * 60 * 60 * 24);
      }
      globalCurrent = Math.max(globalCurrent, currStreak);

      // 2c) Count how many active daily habits are checked today
      if (dailyActive.some(dh => dh._id === h._id) && completedDates.includes(todayISO)) {
        checkedTodayCount += 1;
      }
    });

    return {
      longestDailyStreak: globalLongest,
      currentDailyStreak: globalCurrent,
      totalDailyActive: dailyActive.length,
      totalDailyCheckedToday: checkedTodayCount,
    };
  }, [allHabits, activeHabits]);

  // === 3) WEEKLY-HABIT COMPLETION RATE ===
  const { weeklySuccessCount, totalWeeklyActive } = useMemo(() => {
    const weeklyActive = activeHabits.filter(h =>
      isValidHabit(h) && h.goalType === 'Weekly'
    );

    if (weeklyActive.length === 0) {
      return { weeklySuccessCount: 0, totalWeeklyActive: 0 };
    }

    // Build a set of ISO dates for the current week (Sunday → Saturday)
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const weekISOset = new Set<string>();

    for (
      let dt = weekStart.getTime();
      dt <= weekEnd.getTime();
      dt += 1000 * 60 * 60 * 24
    ) {
      weekISOset.add(format(new Date(dt), 'yyyy-MM-dd'));
    }

    let successCount = 0;
    weeklyActive.forEach((h) => {
      // Ensure completedDates is an array
      const completedDates = Array.isArray(h.completedDates) ? h.completedDates : [];

      const inWeekCount = completedDates.filter(d => weekISOset.has(d)).length;
      if (inWeekCount >= (h.targetStreak || 1)) {  // Add fallback for targetStreak
        successCount += 1;
      }
    });

    return {
      weeklySuccessCount: successCount,
      totalWeeklyActive: weeklyActive.length,
    };
  }, [activeHabits]);

  // === 4) OVERALL COMPLETION RATE ===
  const overallCompletionRate = useMemo(() => {
    const dailyRate = totalDailyActive === 0
      ? 0
      : (totalDailyCheckedToday / totalDailyActive) * 100;

    const weeklyRate = totalWeeklyActive === 0
      ? 0
      : (weeklySuccessCount / totalWeeklyActive) * 100;

    if (totalDailyActive + totalWeeklyActive === 0) {
      return 0;
    }
    return Math.round((dailyRate + weeklyRate) / 2);
  }, [totalDailyActive, totalDailyCheckedToday, totalWeeklyActive, weeklySuccessCount]);

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-3 gap-4">
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Total Habits</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>Active + Completed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{totalCreated}</p>
        </CardContent>
      </Card>

      {/* Active / Completed */}
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Active / Completed</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>Current Status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            <span className="font-medium text-sm">Active:</span> {totalActive}
          </p>
          <p>
            <span className="font-medium text-sm">Completed:</span> {totalCompleted}
          </p>
        </CardContent>
      </Card>

      {/* Longest Daily Streak */}
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Longest Daily Streak</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>Across all Daily habits</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{longestDailyStreak}d</p>
        </CardContent>
      </Card>

      {/* Current Daily Streak */}
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Current Daily Streak</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>Best active streak today</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{currentDailyStreak}d</p>
        </CardContent>
      </Card>

      {/* Daily Completion Rate */}
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Daily Completion</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>
            {totalDailyActive === 0
              ? '—'
              : `${Math.round((totalDailyCheckedToday / totalDailyActive) * 100)}% checked today`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">
            {totalDailyActive === 0
              ? 'N/A'
              : `${Math.round((totalDailyCheckedToday / totalDailyActive) * 100)}%`}
          </p>
        </CardContent>
      </Card>

      {/* Weekly Completion Rate */}
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Weekly Completion</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>
            {totalWeeklyActive === 0
              ? '—'
              : `${Math.round((weeklySuccessCount / totalWeeklyActive) * 100)}% on track`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">
            {totalWeeklyActive === 0
              ? 'N/A'
              : `${Math.round((weeklySuccessCount / totalWeeklyActive) * 100)}%`}
          </p>
        </CardContent>
      </Card>

      {/* Overall Completion Rate */}
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Overall Completion</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>Average daily &amp; weekly</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{overallCompletionRate}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
