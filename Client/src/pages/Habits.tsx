import BgEclipse from "@/components/BgEclips"
import CreateHabits from "@/components/CreateHabits"
import HabitsList from "@/components/HabitsList"
import HabitStats from "@/components/HabitStats"
import { HabitStatsChart } from "@/components/HabitStatsChart"

const Habits = () => {
    return (
        <section className="mt-24 my-12  relative space-y-12">
            <BgEclipse position="top-72 hidden sm:flex sm:-right-10" />
            <div className="flex flex-col sm:flex-row gap-4">
                <CreateHabits />
                <HabitsList />

            </div>
            <div className="flex flex-col-reverse xl:flex-row w-full gap-8 xl:gap-4">
                <div className="w-full xl:w-1/2">
                    <HabitStats />
                </div>

                <div className="relative w-full xl:w-1/2">
                    <HabitStatsChart />
                </div>
            </div>
        </section>
    )
}

export default Habits