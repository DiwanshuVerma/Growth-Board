
import { useMemo } from "react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { parseISO, format } from "date-fns"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { useAppSelector } from "@/app/hooks"
import { FaLock } from "react-icons/fa6"
import type { Habit } from "@/features/habits/types"

const COLORS = ["#4f46e5", "#16a34a", "#fb923c", "#8b5cf6", "#e11d48"]

export function HabitStatsChart() {
  // Helper function to validate habit objects
  function isValidHabit(habit: any): habit is Habit {
    return habit &&
      typeof habit === 'object' &&
      '_id' in habit &&
      'title' in habit &&
      'completedDates' in habit;
  }

  // Pull habits with validation
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

  // Merge for chart data with validation
  const allHabits = useMemo(
    () => [...activeHabits, ...completedHabits].filter(isValidHabit),
    [activeHabits, completedHabits]
  );

  // Completion per day with validation
  const completionPerDay: Record<string, number> = {};
  allHabits.forEach((h: Habit) => {
    if (Array.isArray(h.completedDates)) {
      h.completedDates.forEach((isoDate) => {
        if (typeof isoDate === 'string') {
          completionPerDay[isoDate] = (completionPerDay[isoDate] || 0) + 1;
        }
      });
    }
  });

  // Pie chart data with validation
  const pieData = allHabits
    .map((h: Habit) => ({
      name: h.title || 'Untitled Habit',
      value: Array.isArray(h.completedDates) ? h.completedDates.length : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 habits

  // Weekly count data
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  const weeklyCount: Record<string, number> = {};

  // Initialize weeklyCount with 0 for each day
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const iso = format(d, "yyyy-MM-dd");
    weeklyCount[iso] = 0;
  }

  // Populate weeklyCount with valid data
  allHabits.forEach((h: Habit) => {
    if (Array.isArray(h.completedDates)) {
      h.completedDates.forEach((isoDate) => {
        if (typeof isoDate === 'string' && isoDate in weeklyCount) {
          weeklyCount[isoDate] += 1;
        }
      });
    }
  });

  // Prepare weekly data for chart
  const weeklyData = Object.keys(weeklyCount)
    .sort((a, b) => +new Date(a) - +new Date(b))
    .map((isoDate) => ({
      label: format(parseISO(isoDate), "EEE"), // "Mon", "Tue"
      count: weeklyCount[isoDate],
    }));

  return (
    <div className={`grid gap-6 grid-cols-1 ${allHabits.length === 0 ? 'h-72' : 'auto'}`}>
      {allHabits.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[url('blur.png')] bg-no-repeat bg-center bg-cover blur-md -z-10" />
          <FaLock className="text-2xl mb-2 text-white" />
          <h1 className="text-white bg-green-900/70 p-3 rounded-lg text-center text-sm sm:text-base font-semibold">
            Complete your first habit to view graph statistics
          </h1>
        </div>
      ) : (
        <>
          <Card className="bg-[#0d1f1644] dark:text-white border-green-700/50">
            <CardHeader>
              <CardTitle>Last 7-Day Completions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={weeklyData} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value) => [`${value} completions`, 'Count']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Bar dataKey="count" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#0d1f1644] dark:text-white border-green-700/50">
            <CardHeader>
              <CardTitle>Top Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name.slice(0, 12)}${name.length > 12 ? '...' : ''} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name, props) => [`${value} completions`, props.payload.name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs">
                        {value.length > 10 ? `${value.slice(0, 10)}...` : value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
