
import { useMemo } from "react"
import { type Habit } from "@/features/habits/habitSlice"

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

const COLORS = ["#4f46e5", "#16a34a", "#fb923c", "#8b5cf6", "#e11d48"]

export function HabitStatsChart() {
  const activeHabits = useAppSelector((state) => 
    Array.isArray(state.habit.activeHabits) ? state.habit.activeHabits : []
  )
  
  const completedHabits = useAppSelector((state) => 
    Array.isArray(state.habit.completedHabits) ? state.habit.completedHabits : []
  )

  const allHabits = useMemo(
    () => [...activeHabits, ...completedHabits],
    [activeHabits, completedHabits]
  )


  const completionPerDay: Record<string, number> = {}
  allHabits.forEach((h: Habit) => {
    h.completedDates.forEach((isoDate) => {
      completionPerDay[isoDate] = (completionPerDay[isoDate] || 0) + 1
    })
  })
  const pieData = allHabits
    .map((h: Habit) => ({
      name: h.title,
      value: h.completedDates.length,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // top 5 habits

  const today = new Date()
  const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000) // inclusive of today
  const weeklyCount: Record<string, number> = {}

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
    const iso = format(d, "yyyy-MM-dd")
    weeklyCount[iso] = 0
  }

  allHabits.forEach((h: Habit) => {
    h.completedDates.forEach((isoDate) => {
      // If isoDate is within our last 7-day window, increment it
      if (isoDate in weeklyCount) {
        weeklyCount[isoDate] += 1
      }
    })
  })

  const weeklyData = Object.keys(weeklyCount)
    .sort((a, b) => +new Date(a) - +new Date(b))
    .map((isoDate) => ({
      label: format(parseISO(isoDate), "EEE"), // "Mon", "Tue"
      count: weeklyCount[isoDate],
    }))

  return (
    <div className={`grid gap-6 grid-cols-1 ${allHabits.length === 0 ? 'h-72' : 'auto'}`}>

      {/* // If no habits at all, render nothing */}
      {allHabits.length === 0 && (
        <div className="w-1/2 text-center">
          <div className="text-center absolute bg-[url('blur.png')] w-full h-full -z-10 bg-no-repeat bg-center bg-cover blur-md" />
          <h1 className="absolute flex gap-1 w-fit eft-5 sm:left-16 m-auto top-1/2 text-white bg-green-900/70 p-1 rounded text-xl font-semibold">
            <FaLock /> Complete your first habit to view graph statistics here.
          </h1>
        </div>
      )}

      {allHabits.length > 0 && (
        <>
          <Card className="bg-[#0d1f1644]   dark:text-white border-green-700/50">
            <CardHeader>
              <CardTitle>Last 7-Day Completions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={weeklyData} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <RechartsTooltip />
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
                      `${name} ${(percent! * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
