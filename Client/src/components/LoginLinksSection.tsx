import { ChartSpline } from "lucide-react"
import Login from "./button/login"
import BgEclipse from "./BgEclips"

const LoginLinksSection = () => {
    return (
        <section className="relative mb-12">
            <div className="h-[40vh] p-4 rounded-4xl  border dark:border-green-950 border-green-300 shadow-lg dark:bg-[#061107] bg-[#b1f7bd]  flex flex-col gap-4 sm:gap-6 items-center justify-center">

                <BgEclipse position=" right-0 top-40" />

                <div className="rounded-full flex items-center gap-2 border dark:text-white text-neutral-900 border-neutral-700 px-4 py-1 w-fit h-fit ">
                    <ChartSpline  size={20}/>
                    <span>Ready to ace your Life?</span>
                </div>

                <h3 className="text-xl text-center sm:text-4xl lg:text-6xl bg-linear-to-b dark:from-zinc-50 from-zinc-600 dark:to-zinc-300 to-zinc-950 text-transparent bg-clip-text py-1">Start Tracking Your Habits Today</h3>

                <div className="flex gap-4 sm:flex-row flex-col ">
                    <Login label="Continue with Email" type="filled" handle="Email" />
                    <Login label="Continue with Twitter" type="transparent" handle='Twitter' />
                </div>

            </div>
        </section>
    )
}

export default LoginLinksSection