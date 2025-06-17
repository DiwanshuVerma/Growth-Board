import { Info, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Habit, Habit as ReduxHabit } from '../features/habits/types'

import {
  updateHabit,
  deleteHabitAction,
  completeHabit,
  setActiveHabits
} from '../features/habits/habitSlice'

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toast } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Card } from './ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Checkbox } from './ui/checkbox';
import { deleteDbHabit, updateDbHabit } from '@/app/auth';
import { IoIosTimer } from 'react-icons/io';

export default function HabitsList() {
  const dispatch = useAppDispatch()
  const [editingHabit, setEditingHabit] = useState<ReduxHabit | null>(null)

  const activeHabits = useAppSelector((state) =>
    Array.isArray(state.habit.activeHabits)
      ? state.habit.activeHabits.filter(h => h !== undefined)
      : []
  )

  const completedHabits = useAppSelector((state) =>
    Array.isArray(state.habit.completedHabits)
      ? state.habit.completedHabits.filter(h => h !== undefined)
      : []
  )

  const isGuest = useAppSelector(state => state.auth.isGuest)

  // Change pendingRemovals to store timeoutId only
  const [pendingRemovals, setPendingRemovals] = useState<
    Record<string, { timeoutId: NodeJS.Timeout }>
  >({})

  const [filter, setFilter] = useState<
    'all' | 'daily' | 'weekly' | 'completed'
  >('all')

  // refs to track the latest state
  const activeHabitsRef = useRef(activeHabits);
  const completedHabitsRef = useRef(completedHabits);

  useEffect(() => {
    activeHabitsRef.current = activeHabits;
    completedHabitsRef.current = completedHabits;
  }, [activeHabits, completedHabits]);

  function formatDateYYYYMMDD(d: Date): string {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  function getCurrentWeekDates(): { date: Date; iso: string; label: string }[] {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const sunday = new Date(today)
    sunday.setDate(today.getDate() - dayOfWeek)

    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weekArr: { date: Date; iso: string; label: string }[] = []

    for (let i = 0; i < 7; i++) {
      const dt = new Date(sunday)
      dt.setDate(sunday.getDate() + i)
      weekArr.push({
        date: dt,
        iso: formatDateYYYYMMDD(dt),
        label: labels[i],
      })
    }
    return weekArr
  }

function finalizeRemoval(habitId: string) {
  const habitToComplete = activeHabits.find(h => h._id === habitId);
  if (!habitToComplete) return;

  // Create updated habit with completed status
  const completedHabit = {
    ...habitToComplete,
    status: 'completed' as const
  };

  // Update Redux state
  dispatch(completeHabit(completedHabit));

  setPendingRemovals((prev) => {
    const copy = { ...prev };
    delete copy[habitId];
    return copy;
  });

  // Persist changes
  if (!isGuest) {
    updateDbHabit(completedHabit._id, completedHabit, dispatch)
      .catch(e => console.error('Failed to update habit status', e));
  } else {
    const storedState = localStorage.getItem('guestHabits');
    const currentState = storedState ? 
      JSON.parse(storedState) : 
      { activeHabits: [], completedHabits: [] };

    const updatedState = {
      activeHabits: currentState.activeHabits.filter((h: Habit) => h._id !== habitId),
      completedHabits: [...currentState.completedHabits, completedHabit]
    };

    localStorage.setItem('guestHabits', JSON.stringify(updatedState));
  }
}

  function toggleDate(habitId: string, iso: string) {
    const today = new Date()
    const todayISO = formatDateYYYYMMDD(today)

    if (iso < todayISO) {
      toast("Cannot check previous days", {
        description: "You can only check habits for today or future dates.",
      })
      return
    }

    const targetHabit = activeHabits.find((h) => h._id === habitId)
    if (!targetHabit) return

    const target = targetHabit.targetStreak;
    const alreadyChecked = targetHabit.completedDates.includes(iso);
    const updatedDates = alreadyChecked
      ? targetHabit.completedDates.filter((d) => d !== iso)
      : [...targetHabit.completedDates, iso];

    let completedCount = 0
    if (targetHabit.goalType === 'Daily') {
      completedCount = new Set(updatedDates).size
    } else {
      const weekArr = getCurrentWeekDates()
      completedCount = weekArr.filter((d) => updatedDates.includes(d.iso)).length
    }

    // First update the habit with the new date
    const updatedHabit = {
      ...targetHabit,
      completedDates: updatedDates,
    };

    // Update Redux state immediately
    dispatch(setActiveHabits(
      activeHabits
        .filter(h => h !== undefined)
        .map(h => h._id === habitId ? updatedHabit : h)
    ));

    // If this check would complete the habit, show toast and set up removal
    if (!alreadyChecked && completedCount >= target) {
      // Clear any existing pending removal for this habit
      if (pendingRemovals[habitId]) {
        clearTimeout(pendingRemovals[habitId].timeoutId);
        setPendingRemovals(prev => {
          const copy = { ...prev };
          delete copy[habitId];
          return copy;
        });
      }

      // Show completion toast
      toast(`🎉 Habit Completed!`, {
        description: `You've reached your ${targetHabit.goalType.toLowerCase()} target for "${targetHabit.title}."`,
      });

      // Set up the removal timeout - move to completed after 3 seconds
      const timeoutId = setTimeout(() => {
        finalizeRemoval(habitId);
      }, 3000);

      // Store the pending removal
      setPendingRemovals(prev => ({
        ...prev,
        [habitId]: {
          timeoutId
        }
      }));
    } else {
      // For non-completing changes, just persist the update
      if (!isGuest) {
        updateDbHabit(updatedHabit._id, updatedHabit, dispatch)
          .catch(e => {
            console.error('Failed to update habit on server', e);
            toast.error('Failed to save habit changes');
          });
      } else {
        const state = {
          activeHabits: activeHabits.map(h =>
            h._id === habitId ? updatedHabit : h
          ),
          completedHabits: completedHabitsRef.current
        };
        localStorage.setItem('guestHabits', JSON.stringify(state));
      }
    }
  }

  const deleteHabitById = async (habitId: string) => {
    if (!isGuest) {
      try {
        await deleteDbHabit(habitId, dispatch)
      } catch (e) {
        toast.error('Failed to delete habit from server')
        return
      }
    }
    dispatch(deleteHabitAction(habitId))
  }

  // Update habit handler
  const handleUpdateHabit = async (updatedHabit: Habit) => {
    if (!isGuest) {
      try {
        await updateDbHabit(updatedHabit._id, updatedHabit, dispatch)
      } catch (e) {
        toast.error('Failed to update habit on server')
        return
      }
    }
    dispatch(updateHabit(updatedHabit))
    setEditingHabit(null)
  }

  const activeFiltered = activeHabits.filter((h) => {
    if (!h || typeof h !== 'object') return false;
    if (filter === 'daily') return h.goalType === 'Daily'
    if (filter === 'weekly') return h.goalType === 'Weekly'
    return true
  }).filter(Boolean)

  return (
    <TooltipProvider>
      <Card className="p-6 h-[510px] w-full sm:w-1/2 overflow-y-auto bg-[#0d1f16] shadow-lg text-white border border-gray-500/40">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-nowrap">Your Habits</h2>
          <Select
            value={filter}
            onValueChange={(val) => setFilter(val as any)}
          >
            <SelectTrigger className="w-56 bg-[#0d1f16] text-white border border-[#474747] rounded focus:outline-none focus:ring-2 focus:ring-[#058d37]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-[#293a30ee] border border-[#1a2a20]">
              <SelectGroup>
                <SelectItem value="all">All Active</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {filter !== 'completed' && activeFiltered.length === 0 && (
          <p className="text-sm text-gray-300">
            No active habits in this category.
          </p>
        )}
        {filter === 'completed' && completedHabits.length === 0 && (
          <p className="text-sm text-gray-300">No completed habits yet.</p>
        )}

        <ul className="space-y-6">
          {filter === 'completed'
            ? completedHabits.map((habit) => {
              const target = habit.targetStreak
              const totalChecked = new Set(habit.completedDates).size

              return (
                <li
                  key={habit._id}
                  className="border-b border-green-800 pb-4 flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{habit.title}</h3>
                    {habit.description && (
                      <p className="text-sm text-gray-300">
                        {habit.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Completed ({habit.goalType}) — Target was {target}{' '}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="inline-block h-4 w-4 text-gray-400 ml-1 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 text-white text-sm rounded px-2 py-1 max-w-[200px]">
                          You completed all {target} required check
                          {target === 1 ? '' : 's'}.
                        </TooltipContent>
                      </Tooltip>
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Checked {totalChecked} time
                      {totalChecked === 1 ? '' : 's'} in total.
                    </p>
                  </div>
                  <button
                    onClick={() => deleteHabitById(habit._id)}
                    className="text-red-400 hover:text-red-200"
                    aria-label="Delete completed habit"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              )
            })
            : activeFiltered.map((habit) => {
              const target = habit?.targetStreak
              const todayISO = formatDateYYYYMMDD(new Date())

              if (habit.goalType === 'Daily') {
                const totalChecked = new Set(habit.completedDates).size
                const isTodayChecked = habit.completedDates.includes(todayISO)
                const daysLeft = Math.max(target - totalChecked, 0)
                const percent = Math.min(
                  Math.round((totalChecked / target) * 100),
                  100
                )
                return (
                  <li
                    key={habit._id}
                    className="border-b border-green-800 pb-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{habit.title}</h3>
                        {habit.description && (
                          <p className="text-sm text-gray-300">
                            {habit.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Goal: Daily — Target: {target}{' '}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="inline-block h-4 w-4 text-gray-400 ml-1 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-zinc-900 text-white text-sm rounded px-2 py-1 max-w-[200px]">
                              Check once per day. You need {target} total days
                              to complete.
                            </TooltipContent>
                          </Tooltip>
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col items-center">
                          <Checkbox
                            checked={isTodayChecked}
                            onCheckedChange={() =>
                              toggleDate(habit._id, todayISO)
                            }
                            className="h-5 w-5 text-green-500 border-gray-600 bg-[#0d1f16] focus:ring-2 focus:ring-[#058d37]"
                          />
                          <span className="text-xs text-gray-300 mt-1">
                            Today
                          </span>
                        </div>

                        {/* ADDED: Edit button */}
                        <button
                          onClick={() => setEditingHabit(habit)}
                          className="text-gray-400 hover:text-gray-200"
                          aria-label="Edit habit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteHabitById(habit._id)}
                          className="text-red-400 hover:text-red-200"
                          aria-label="Delete habit"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 w-full">
                      <div className="w-full h-2 bg-[#1a2a20] rounded">
                        <div
                          className="h-full bg-[#058d37] rounded"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        Checked: {totalChecked} / {target} &nbsp;—&nbsp;{' '}
                        {daysLeft} day{daysLeft === 1 ? '' : 's'} left
                      </p>
                    </div>

                    {/* "Come back tomorrow" */}
                    {isTodayChecked && totalChecked <= target ? (
                      <p className="mt-2 text-sm text-green-300 font-medium">
                        ✅ Good job today! Come back tomorrow.
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-red-300 font-medium flex items-center gap-1">
                        <IoIosTimer size={15} />
                        Today's check is remaining.
                      </p>
                    )}
                  </li>
                )
              }

              // WEEKLY HABITS
              if (habit.goalType === 'Weekly') {
                const weekArr = getCurrentWeekDates()
                const todayISO = formatDateYYYYMMDD(new Date())
                const checkedThisWeek = weekArr.filter((d) =>
                  habit.completedDates.includes(d.iso)
                ).length
                const target = habit.targetStreak
                const daysLeft = Math.max(target - checkedThisWeek, 0)
                const percent = Math.min(
                  Math.round((checkedThisWeek / target) * 100),
                  100
                )

                return (
                  <li
                    key={habit._id}
                    className="border-b border-green-800 pb-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{habit.title}</h3>
                        {habit.description && (
                          <p className="text-sm text-gray-300">
                            {habit.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Goal: Weekly — Target: {target}{' '}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="inline-block h-4 w-4 text-gray-400 ml-1 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-zinc-900 text-white text-sm rounded px-2 py-1 max-w-[200px]">
                              Check once per day. You can only check today's box.
                            </TooltipContent>
                          </Tooltip>
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                          {weekArr.map((dayObj) => {
                            const isChecked = habit.completedDates.includes(dayObj.iso)

                            return (
                              <div
                                key={dayObj.iso}
                                className="flex flex-col items-center"
                              >
                                <span className="text-xs text-gray-300">
                                  {dayObj.label}
                                </span>
                                <Checkbox
                                  checked={isChecked}
                                  disabled={dayObj.iso !== todayISO || dayObj.iso < todayISO}
                                  onCheckedChange={() => {
                                    if (dayObj.iso === todayISO && dayObj.iso >= todayISO) {
                                      toggleDate(habit._id, dayObj.iso)
                                    }
                                  }}
                                  className="h-5 w-5 text-green-500 border-gray-600 bg-[#0d1f16] focus:ring-2 focus:ring-[#058d37]"
                                />
                              </div>
                            )
                          })}
                        </div>

                        {/* Edit button */}
                        <button
                          onClick={() => setEditingHabit(habit)}
                          className="text-gray-400 hover:text-gray-200"
                          aria-label="Edit habit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteHabitById(habit._id)}
                          className="text-red-400 hover:text-red-200"
                          aria-label="Delete habit"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 w-full">
                      <div className="w-full h-2 bg-[#1a2a20] rounded">
                        <div
                          className="h-full bg-[#058d37] rounded"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        Checked this week: {checkedThisWeek} / {target}{' '}
                        &nbsp;—&nbsp; {daysLeft} day
                        {daysLeft === 1 ? '' : 's'} left
                      </p>
                    </div>

                    {/* "Come back next week" */}
                    {checkedThisWeek > 0 && checkedThisWeek < target ? (
                      <p className="mt-2 text-sm text-green-300 font-medium">
                        ✅ Good work this week! Come back next week.
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-red-300 font-medium flex items-center gap-1">
                        <IoIosTimer size={15} />
                        This week check is remaining.
                      </p>
                    )}
                  </li>
                )
              }

              return null
            })}
        </ul>
      </Card>

      {/* Edit Habit Dialog */}
      {editingHabit && (
        <Dialog open={true} onOpenChange={() => setEditingHabit(null)}>
          <DialogContent className="bg-[#0d1f16] border border-[#474747] text-white">
            <DialogHeader>
              <DialogTitle>Edit Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className='mb-2'>Habit Title</Label>
                <Input
                  id="title"
                  value={editingHabit.title}
                  onChange={(e) => setEditingHabit({
                    ...editingHabit,
                    title: e.target.value
                  })}
                  className="bg-[#0d1f16] border border-[#474747] text-white"
                />
              </div>
              <div>
                <Label htmlFor="description" className='mb-2'>Description (Optional)</Label>
                <Input
                  id="description"
                  value={editingHabit.description || ''}
                  onChange={(e) => setEditingHabit({
                    ...editingHabit,
                    description: e.target.value
                  })}
                  className="bg-[#0d1f16] border border-[#474747] text-white"
                />
              </div>
              <div>
                <Label className='mb-2'>Goal Type</Label>
                <Select
                  value={editingHabit.goalType}
                  onValueChange={(val) => setEditingHabit({
                    ...editingHabit,
                    goalType: val as 'Daily' | 'Weekly'
                  })}
                >
                  <SelectTrigger className="bg-[#0d1f16] border border-[#474747] text-white">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#293a30ee] border border-[#1a2a20]">
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target" className='mb-2'>Target Streak</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={editingHabit.targetStreak}
                  onChange={(e) => setEditingHabit({
                    ...editingHabit,
                    targetStreak: Number(e.target.value)
                  })}
                  className="bg-[#0d1f16] border border-[#474747] text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => handleUpdateHabit(editingHabit)}
                className="bg-[#058d37] hover:bg-[#046a27] text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  )
}