import { ChartSpline } from "lucide-react"
import Login from "./button/login"
import BgEclipse from "./BgEclips"

const LoginLinksSection = () => {
    return (
        <section className="relative mb-12">
            <div className="h-[40vh] rounded-4xl  border border-neutral-800 bg-[#061107]  flex flex-col gap-6 items-center justify-center text-white">

                <BgEclipse position=" right-0 top-32" />

                <div className="rounded-full flex items-center gap-2 border border-neutral-700 px-4 py-1 w-fit h-fit ">
                    <ChartSpline  size={20}/>
                    <span>Ready to ace your Life?</span>
                </div>

                <h3 className="text-6xl">Start Tracking Your Habits Today</h3>

                <div className="flex gap-2">
                    <Login label="Continue with Github" type="filled"/>
                    <Login label="Continue with X" type="transparent" />
                </div>

            </div>
        </section>
    )
}

export default LoginLinksSection