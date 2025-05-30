import { ChartSpline } from "lucide-react"
import Login from "./button/login"
import BgEclipse from "./BgEclips"

const LoginLinksSection = () => {
    return (
        <section className="relative mb-12">
            <div className="h-[40vh] p-4 rounded-4xl  border border-green-950 bg-[#061107]  flex flex-col gap-4 sm:gap-6 items-center justify-center text-white">

                <BgEclipse position=" right-0 top-40" />

                <div className="rounded-full flex items-center gap-2 border border-neutral-700 px-4 py-1 w-fit h-fit ">
                    <ChartSpline  size={20}/>
                    <span>Ready to ace your Life?</span>
                </div>

                <h3 className="text-xl text-center sm:text-4xl lg:text-6xl bg-linear-to-b from-zinc-50 to-zinc-300 text-transparent bg-clip-text py-1">Start Tracking Your Habits Today</h3>

                <div className="flex gap-4 sm:flex-row flex-col ">
                    <Login label="Continue with GitHub" type="filled"/>
                    <Login label="Continue with Twitter" type="transparent" />
                </div>

            </div>
        </section>
    )
}

export default LoginLinksSection