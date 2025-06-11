// this hook is for synchronization
// it fetch habits based on source --> source: 'local' | 'backend'

import { fetchDbHabits } from "@/app/auth"
import { useAppSelector } from "@/app/hooks"
import { setAllHabits, setHabitSource } from "@/features/habits/habitSlice"
import type { Habit } from "@/features/habits/types"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export const useHabitSync = () => {
    const isGuest = useAppSelector(state => state.auth.isGuest)
    const habitSource = useAppSelector(state => state.habit.source)
    const dispatch = useDispatch()

    useEffect(() => {
        const source = isGuest ? 'local' : 'backend'
        dispatch(setHabitSource(source))
    }, [isGuest, dispatch])

    // load habits based on source
    useEffect(() => {
        const loadHabits = async () => {
            if (habitSource === 'local') {
                try {
                    // Parse localStorage data
                    const storedData = JSON.parse(localStorage.getItem('guestHabits') || "null")
                    console.log(storedData)

                    let guestData = { activeHabits: [], completedHabits: [] };

                    if (storedData) {
                        try {
                            guestData = storedData
                        } catch (e) {
                            console.error('Failed to parse guest habits', e);
                        }
                    }

                    const active = Array.isArray(guestData.activeHabits)
                        ? guestData.activeHabits
                        : [];

                    const completed = Array.isArray(guestData.completedHabits)
                        ? guestData.completedHabits
                        : [];

                    dispatch(setAllHabits({ active, completed }));
                } catch (error) {
                    console.error('Failed to load guest habits', error);
                }
            } else {
        try {
          const allHabits = await fetchDbHabits();
          
          // Split into active and completed based on completion status
          const active: Habit[] = [];
          const completed: Habit[] = [];
          
          allHabits.forEach((habit: Habit) => {
            if (isHabitCompleted(habit)) {
              completed.push(habit);
            } else {
              active.push(habit);
            }
          });
          
          dispatch(setAllHabits({ active, completed }));
        } catch (err) {
          console.log('Failed to fetch habits from API', err);
        }
      }
        }

        loadHabits();
    }, [habitSource, dispatch])

    // Helper function to determine if habit is completed
function isHabitCompleted(habit: Habit): boolean {
  if (habit.goalType === 'Daily') {
    const uniqueDates = new Set(habit.completedDates).size;
    return uniqueDates >= habit.targetStreak;
  } else {
    return checkIfWeeklyHabitCompleted(habit);
  }
}

}


function checkIfWeeklyHabitCompleted(habit: Habit): boolean {
  // Group completed dates by week
  const weeksMap = new Map<string, number>();
  
  habit.completedDates.forEach(dateStr => {
    const date = new Date(dateStr);
    // Get week identifier (year + week number)
    const weekKey = getWeekKey(date);
    
    if (weeksMap.has(weekKey)) {
      weeksMap.set(weekKey, weeksMap.get(weekKey)! + 1);
    } else {
      weeksMap.set(weekKey, 1);
    }
  });
  
  // Check if any week met the target
  for (const count of weeksMap.values()) {
    if (count >= habit.targetStreak) {
      return true;
    }
  }
  
  return false;
}

// Helper to get week identifier (e.g., "2023-W35")
function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  // January 4 is always in week 1
  const week1 = new Date(d.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  
  return `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}