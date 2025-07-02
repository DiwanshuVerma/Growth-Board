import { fetchDbHabits, getCurrentUser } from "@/app/auth";
import { useAppSelector } from "@/app/hooks";
import { loginAsGuest, loginAsUser } from "@/features/auth/authSlice";
import { setAllHabits } from "@/features/habits/habitSlice";
import type { Habit } from "@/features/habits/types";
import { setHabitSkeletonLoader } from "@/features/ui/uiSlice";
import type { User } from "@/features/users/types";
import { useEffect } from "react";
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

  // 1. Handle initial authentication and cleanup
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const guestHabits = localStorage.getItem("guestHabits");

    if (userData) {
      try {
        const { token } = JSON.parse(userData)
        getCurrentUser()
        .then((currentUser: User) => {
          localStorage.removeItem("guest");
          localStorage.removeItem("guestHabits");
          dispatch(loginAsUser({ token, user: currentUser }));
        })
      } catch (e) {
        localStorage.removeItem("user");
      }
    } else if (guestHabits) {
      localStorage.removeItem("user");
      dispatch(loginAsGuest());
    } else {
      console.log("No auth data in localStorage");
    }
  }, [dispatch]);

  // 2. Load habits when auth state changes
  useEffect(() => {
    const loadHabits = async () => {
      if (isGuest) {
        // for habits loading skeleton
        dispatch(setHabitSkeletonLoader(true))

        // Guest: Load from localStorage
        const storedData = JSON.parse(localStorage.getItem('guestHabits') || "null");
        const guestData = storedData || {
          activeHabits: [],
          completedHabits: []
        };

        // Filter by status
        const active = guestData.activeHabits
          .filter((h: Habit) => h.status === 'active')
          .map((habit: Habit) => ({
            ...habit,
            status: habit.status || 'active'
          }));

        const completed = guestData.completedHabits
          .filter((h: Habit) => h.status === 'completed')
          .map((habit: Habit) => ({
            ...habit,
            status: habit.status || 'completed'
          }));

        dispatch(setAllHabits({ active, completed }));
        dispatch(setHabitSkeletonLoader(false))

      } else if (token) {
        // User: Fetch from API
        try {
          dispatch(setHabitSkeletonLoader(true))

          const allHabits = await fetchDbHabits(dispatch);

          // Split by status
          const active: Habit[] = [];
          const completed: Habit[] = [];

          allHabits.forEach((habit: Habit) => {
            // Use status if exists, otherwise determine by completion
            if (habit.status === 'completed') {
              completed.push(habit);
            } else if (habit.status === 'active') {
              active.push(habit);
            } else {
              // Backward compatibility
              if (isHabitCompleted(habit)) {
                completed.push({ ...habit, status: 'completed' });
              } else {
                active.push({ ...habit, status: 'active' });
              }
            }
          });

          dispatch(setAllHabits({ active, completed }));
          dispatch(setHabitSkeletonLoader(false))

        } catch (error) {
          console.error("[useHabitSync] Failed to fetch habits from backend:", error);
          dispatch(setAllHabits({ active: [], completed: [] }));
          dispatch(setHabitSkeletonLoader(false))

        }
      } else {
        // No auth state yet, set empty arrays
        dispatch(setAllHabits({ active: [], completed: [] }));
      }
    }

    loadHabits();

  }, [isGuest, token, dispatch]);

  // 3. Save habits to localStorage when they change
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem("guestHabits", JSON.stringify({ activeHabits, completedHabits }));
    }
  }, [activeHabits, completedHabits, isGuest]);

  // 4. Cleanup when switching from guest to user
  useEffect(() => {
    if (!isGuest && token) {
      localStorage.removeItem("guest");
      localStorage.removeItem("guestHabits");
    }
  }, [isGuest, token]);
};