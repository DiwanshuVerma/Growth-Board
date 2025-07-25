import { useState } from 'react'

import { addHabit } from '@/features/habits/habitSlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
} from '@radix-ui/react-select'
import { Info } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { storeHabitsInDB } from '@/app/auth'
import { toast } from 'sonner'
import type { Habit } from '@/features/habits/types'

type GoalType = 'Daily' | 'Weekly'

export default function CreateHabits() {
    const dispatch = useAppDispatch()
    const isGuest = useAppSelector(state => state.auth.isGuest)
    const [habitCreateLoader, setHabitCreateLoader] = useState(false)

    const [form, setForm] = useState<{
        title: string
        description: string
        goalType: GoalType
        targetStreak: number
    }>({
        title: '',
        description: '',
        goalType: 'Daily',
        targetStreak: 0, // start at 0 so placeholder shows
    })

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]:
                name === 'targetStreak'
                    ? Number(value)
                    : (value as string),
        }))
    }

    const handleSelectChange = (newValue: GoalType) => {
        setForm((prev) => ({
            ...prev,
            goalType: newValue,
        }))
    }

    const handleCreateHabit = async () => {
        if (!form.title.trim() || form.targetStreak <= 0) return;

        // Create base habit with status field
        const baseHabit: Habit = {
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            goalType: form.goalType,
            targetStreak: form.targetStreak,
            completedDates: [],
            createdAt: new Date().toISOString(),
            status: 'active', // Explicitly set status
            _id: '' // Temporary ID, will be replaced
        };

        if (isGuest) {
            const guestHabit: Habit = {
                ...baseHabit,
                _id: `guest-${crypto.randomUUID()}`,
            };

            const existing = JSON.parse(
                localStorage.getItem('guestHabits') || 'null'
            ) || { activeHabits: [], completedHabits: [] };

            existing.activeHabits.push(guestHabit);
            localStorage.setItem('guestHabits', JSON.stringify(existing));

            dispatch(addHabit(guestHabit));
        } else {
            try {
                setHabitCreateLoader(true)

                // Remove temporary ID before sending to server
                const { _id, ...habitToSave } = baseHabit;

                const savedHabit = await storeHabitsInDB(habitToSave, dispatch);
                setHabitCreateLoader(false)
                toast.success(savedHabit.message, {
                    style: {
                        backgroundColor: '#aff8d4',
                    },
                })

                dispatch(addHabit({
                    ...savedHabit.habit,
                    status: 'active'
                }));
            } catch (e) {
                toast.error('Failed to save habit to server');
            }
        }

        // Reset form
        setForm({
            title: '',
            description: '',
            goalType: 'Daily',
            targetStreak: 0,
        });
    };

    return (
        // <div className="">
        <TooltipProvider>
            <Card className="w-full sm:w-1/2 h-full p-6 bg-[#0d1f16] shadow-lg text-white border border-gray-500/40">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                    Create New Habit
                </h2>

                {/* Title */}
                <div className="">
                    <label
                        htmlFor="title"
                        className="block mb-1 text-sm font-medium"
                    >
                        Habit Title
                    </label>
                    <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="Outdoor Workout..."
                        className="bg-[#0d1f16] text-white border border-gray-500/40 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058d37]"
                    />
                </div>

                {/* Description */}
                <div className="">
                    <label
                        htmlFor="description"
                        className="block mb-1 text-sm font-medium"
                    >
                        Description
                    </label>
                    <Textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="Description (optional)"
                        className="bg-[#0d1f16] text-white border border-gray-500/40 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058d37]"
                    />
                </div>

                {/* Frequency */}
                <div className=" w-36">
                    <label
                        htmlFor="goalType"
                        className="flex items-center gap-1 mb-1 text-sm font-medium"
                    >
                        Frequency
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-zinc-900 text-white text-sm rounded px-2 py-1 max-w-[200px] 
               [&>svg]:fill-white dark:[&>svg]:fill-zinc-900"
                                sideOffset={5}
                            >
                                Choose how often this habit should be tracked: Daily or Weekly.
                            </TooltipContent>

                        </Tooltip>
                    </label>
                    <Select
                        value={form.goalType}
                        onValueChange={handleSelectChange}
                    >
                        <SelectTrigger className="w-full cursor-pointer bg-[#0d1f16] text-white border border-gray-500/40 rounded focus:outline-none focus:ring-2 focus:ring-[#058d37]">
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>

                        <SelectContent
                            className="w-[140px] bg-[#25312b] border border-gray-500/40"
                            position="popper"
                            sideOffset={5}
                            align="start"
                        >
                            <SelectGroup>
                                <SelectItem
                                    value="Daily"
                                    className="px-3 py-1 hover:bg-[#058d37] hover:text-white cursor-pointer text-white"
                                >
                                    Daily
                                </SelectItem>
                                <SelectItem
                                    value="Weekly"
                                    className="px-3 py-1 hover:bg-[#058d37] hover:text-white cursor-pointer text-white"
                                >
                                    Weekly
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Target Streak */}
                <div>
                    <label
                        htmlFor="targetStreak"
                        className="mb-1 text-sm font-medium flex items-center gap-1"
                    >
                        Target Streak
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-zinc-900 text-white text-sm rounded px-2 py-1 max-w-[200px] [&>svg]:fill-zinc-900"
                                sideOffset={5}
                            >
                                Set how many times you want to complete this habit in a
                                row to mark it successful (e.g., 21 for 21 days).
                            </TooltipContent>
                        </Tooltip>
                    </label>
                    <Input
                        type="number"
                        id="targetStreak"
                        name="targetStreak"
                        value={form.targetStreak === 0 ? '' : form.targetStreak}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                targetStreak: Number(e.target.value),
                            }))
                        }
                        placeholder="e.g., 21"
                        className="bg-[#0d1f16] text-white border border-gray-500/40 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058d37]"
                    />
                </div>

                {/* Create Button */}
                <Button
                disabled={habitCreateLoader}
                    onClick={handleCreateHabit}
                    className={`text-white font-semibold ${habitCreateLoader ? 'bg-[#025721] cursor-not-allowed' : 'bg-[#058d37] hover:bg-[#067d30]'}`}
                >
                    {habitCreateLoader ? 'Creating...' : 'Create Habit'}
                </Button>
            </Card>
        </TooltipProvider>

        // </div>
    )
}
