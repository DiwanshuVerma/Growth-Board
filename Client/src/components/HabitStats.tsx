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
  const allActiveHabits = useAppSelector(state => state.habit.activeHabits || []);
  const activeHabits = useMemo(
    () => allActiveHabits.filter(h => h && typeof h === 'object'),
    [allActiveHabits]
  );

  const allCompletedHabits = useAppSelector(state => state.habit.completedHabits || []);
  const completedHabits = useMemo(
    () => allCompletedHabits.filter(h => h && typeof h === 'object'),
    [allCompletedHabits]
  );

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

  // === GLOBAL DATE CALCULATIONS ===
  const { allCheckedDates, todayISO } = useMemo(() => {
    // Collect ALL unique checked dates from ALL habits
    const globalDatesSet = new Set<string>();
    allHabits.forEach(habit => {
      if (isValidHabit(habit)) {
        habit.completedDates.forEach(date => {
          if (date && typeof date === 'string') {
            globalDatesSet.add(date);
          }
        });
      }
    });

    return {
      allCheckedDates: Array.from(globalDatesSet).sort(),
      todayISO: format(new Date(), 'yyyy-MM-dd')
    };
  }, [allHabits]);

  // === 1) TOTAL COUNTS ===
  const totalActive = activeHabits.filter(isValidHabit).length;
  const totalCompleted = completedHabits.filter(isValidHabit).length;
  const totalCreated = allHabits.length;

  // === 2) DAILY STREAKS ===
  const {
    longestDailyStreak,
    currentDailyStreak,
    totalDailyActive,
    totalDailyCheckedToday,
  } = useMemo(() => {
    // Filter only valid daily habits
    const dailyActive = activeHabits.filter(h => 
      isValidHabit(h) && h.goalType === 'Daily'
    );

    // Calculate streaks based on ANY habit check per day
    let longestStreak = 0;
    let currentStreak = 0;
    
    // LONGEST STREAK CALCULATION
    if (allCheckedDates.length > 0) {
      let currentRun = 1;
      longestStreak = 1;
      
      for (let i = 1; i < allCheckedDates.length; i++) {
        const prev = parseISO(allCheckedDates[i - 1]);
        const curr = parseISO(allCheckedDates[i]);
        const diff = differenceInCalendarDays(curr, prev);
        
        if (diff === 1) {
          currentRun++;
          longestStreak = Math.max(longestStreak, currentRun);
        } else if (diff > 1) {
          currentRun = 1; // Reset on gap
        }
      }
    }

    // CURRENT STREAK CALCULATION
    let currentDate = new Date();
    let streakDate = format(currentDate, 'yyyy-MM-dd');
    
    // Count backwards from today
    while (allCheckedDates.includes(streakDate)) {
      currentStreak++;
      
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
      streakDate = format(currentDate, 'yyyy-MM-dd');
    }

    // Count how many active daily habits are checked today
    const checkedTodayCount = dailyActive.reduce((count, habit) => {
      return habit.completedDates.includes(todayISO) ? count + 1 : count;
    }, 0);

    return {
      longestDailyStreak: longestStreak,
      currentDailyStreak: currentStreak,
      totalDailyActive: dailyActive.length,
      totalDailyCheckedToday: checkedTodayCount,
    };
  }, [allHabits, activeHabits, allCheckedDates, todayISO]);

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
      if (inWeekCount >= (h.targetStreak || 1)) {
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
          <CardDescription className='text-[12px] text-green-400'>Across all habits</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{longestDailyStreak}d</p>
        </CardContent>
      </Card>

      {/* Current Daily Streak */}
      <Card className="bg-[#0d1f16e8] w-fll xs:w-46 h-36 -space-y-2 text-white border-none shadow">
        <CardHeader>
          <CardTitle className='text-sm'>Current Daily Streak</CardTitle>
          <CardDescription className='text-[12px] text-green-400'>Consecutive days with any habit</CardDescription>
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
