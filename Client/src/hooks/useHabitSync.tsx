// this hook is for synchronization
// it fetch habits based on source --> source: 'local' | 'backend'

import { fetchDbHabits } from "@/app/auth"
import { useAppSelector } from "@/app/hooks"
import { setAllHabits, setHabitSource } from "@/features/habits/habitSlice"
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
                    const storedData = localStorage.getItem('guestHabits');
                    let guestData = { activeHabits: [], completedHabits: [] };

                    if (storedData) {
                        try {
                            guestData = JSON.parse(storedData);
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
                    const habits = await fetchDbHabits()
                    dispatch(setAllHabits(habits))
                } catch (err) {
                    console.log(err)
                }
            }
        }

        loadHabits();
    }, [habitSource, dispatch]);

}