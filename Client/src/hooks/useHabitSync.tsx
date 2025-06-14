import { fetchDbHabits } from "@/app/auth";
import { useAppSelector } from "@/app/hooks";
import { loginAsGuest, loginAsUser } from "@/features/auth/authSlice";
import { setAllHabits } from "@/features/habits/habitSlice";
import type { Habit } from "@/features/habits/types";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

// Helper functions for habit completion
function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(
    ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
  );
  return `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

function checkIfWeeklyHabitCompleted(habit: Habit): boolean {
  const weeksMap = new Map<string, number>();
  
  habit.completedDates.forEach(dateStr => {
    const date = new Date(dateStr);
    const weekKey = getWeekKey(date);
    weeksMap.set(weekKey, (weeksMap.get(weekKey) || 0) + 1);
  });

  return [...weeksMap.values()].some(count => count >= habit.targetStreak);
}

function isHabitCompleted(habit: Habit): boolean {
  if (habit.goalType === 'Daily') {
    return new Set(habit.completedDates).size >= habit.targetStreak;
  } else {
    return checkIfWeeklyHabitCompleted(habit);
  }
}

export const useHabitSync = () => {
  const dispatch = useDispatch();
  const isGuest = useAppSelector(state => state.auth.isGuest);
  const token = useAppSelector(state => state.auth.token);
  const activeHabits = useAppSelector(state => state.habit.activeHabits);
  const completedHabits = useAppSelector(state => state.habit.completedHabits);

  console.log("[useHabitSync] Mounting...");

  // 1. Handle initial authentication and cleanup
  useEffect(() => {
    console.log("[useHabitSync] Running auth initialization");
    const userData = localStorage.getItem("user");
    const guestHabits = localStorage.getItem("guestHabits");
    
    if (userData) {
      try {
        console.log("[useHabitSync] Found user data in localStorage");
        const { user, token } = JSON.parse(userData);
        localStorage.removeItem("guest");
        localStorage.removeItem("guestHabits");
        dispatch(loginAsUser({ token, user }));
      } catch (e) {
        console.error("[useHabitSync] Failed to parse user data", e);
        localStorage.removeItem("user");
      }
    } else if (guestHabits) {
      console.log("[useHabitSync] Found guest data in localStorage");
      localStorage.removeItem("user");
      dispatch(loginAsGuest());
    } else {
      console.log("[useHabitSync] No auth data in localStorage");
    }
  }, [dispatch]);

  // 2. Load habits when auth state changes
  useEffect(() => {
      console.log("[useHabitSync] Running habit loader");
      const loadHabits = async () => {
        if (isGuest) {
          try {
            const storedData = JSON.parse(localStorage.getItem('guestHabits') || "null");
            console.log("[useHabitSync] Stored guest habits data:", storedData);
            
            const guestData = storedData || { activeHabits: [], completedHabits: [] };

            const active = Array.isArray(guestData.activeHabits) 
              ? guestData.activeHabits 
              : [];
            const completed = Array.isArray(guestData.completedHabits) 
              ? guestData.completedHabits 
              : [];

            console.log("[useHabitSync] Dispatching guest habits", { active, completed });
            dispatch(setAllHabits({ active, completed }));
          } catch (error) {
            console.error('[useHabitSync] Failed to load guest habits', error);
          }
        } else if (token) {
          try {
            console.log("[useHabitSync] Loading user habits from API");
            const allHabits = await fetchDbHabits();
            const active: Habit[] = [];
            const completed: Habit[] = [];

            allHabits.forEach((habit: Habit) => {
              if (isHabitCompleted(habit)) {
                completed.push(habit);
              } else {
                active.push(habit);
              }
            });

            console.log("[useHabitSync] Dispatching user habits", { active, completed });
            dispatch(setAllHabits({ active, completed }));
          } catch (err) {
            console.log('[useHabitSync] Failed to fetch habits from API', err);
          }
        } else {
          console.log("[useHabitSync] No auth: dispatching empty habits");
          dispatch(setAllHabits({ active: [], completed: [] }));
        }
        
      };

      loadHabits();
    
  }, [isGuest, token, dispatch]);

  // 3. Save habits to localStorage when they change
  useEffect(() => {
    if (isGuest) {
      console.log("[useHabitSync] Saving habits to localStorage", { activeHabits, completedHabits });
      localStorage.setItem("guestHabits", JSON.stringify({ activeHabits, completedHabits }));
    }
  }, [activeHabits, completedHabits, isGuest]);

  // 4. Cleanup when switching from guest to user
  useEffect(() => {
    if (!isGuest && token) {
      console.log("[useHabitSync] Cleaning up guest data");
      localStorage.removeItem("guest");
      localStorage.removeItem("guestHabits");
    }
  }, [isGuest, token]);
};