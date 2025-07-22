import { BsArrowUp } from "react-icons/bs"
import BgEclipse from "./BgEclips"
import GetStarted from "./button/GetStarted"
import { useAppDispatch } from "@/app/hooks";
import { toggleLoginForm } from "@/features/ui/uiSlice";
import { useNavigate } from "react-router-dom";
import { ChartSpline, Trophy } from "lucide-react";
import { useRef } from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const HeroSection = () => {

    const dispatch = useAppDispatch();
    const user = JSON.parse(localStorage.getItem('user') || "null")
    const guest = JSON.parse(localStorage.getItem('guest') || "null")
    const sectionRef = useRef<HTMLDivElement>(null);
    useScrollFadeIn(sectionRef)

    const navigate = useNavigate()

    const onClick = () => {
        if (user || guest) navigate('/habits')
        else dispatch(toggleLoginForm())
    }

    return (
        <section ref={sectionRef} className=" relative min-h-screen w-full flex flex-col md:flex-row pt-32 sm:pt-40 md:pt-0 justify-between items-center gap-4">
            <BgEclipse position="top-12 left-0 sm:left-72" />
            <BgEclipse position="right-12 bottom-0" />

            <div className="w-full md:w-1/2 space-y-6">
                <h1 className="fade-in-up leading-14 lg:leading-20 bg-linear-to-b dark:from-zinc-100 from-zinc-500 dark:to-zinc-900 to-zinc-950 text-transparent bg-clip-text text-5xl md:text-6xl lg:text-7xl font-semibold">Be 1% Better <br /><span className="bg-linear-to-b dark:from-green-500 from-green-400 dark:to-green-900 to-green-950 text-transparent bg-clip-text py-1">Every Day.</span></h1>

                <p className="fade-in-up max-w-2/3 text-lg dark:text-zinc-400 text-zinc-700  font-normal py-1">Visualize progress. Stay accountable. Rise on the Leaderboard and Build habits that stick.</p>
                <GetStarted label="Get Started" onClick={onClick} />
            </div>

            <div className="w-full md:w-1/2 mt-24">
                <RightPart />
            </div>
        </section>
    )
}

const RightPart = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    useScrollFadeIn(sectionRef)
    return (
        <div ref={sectionRef} className="relative">

            <div className="fade-in-up absolute z-10 -bottom-22 sm:-bottom-10 -left-4 sm:-left-10 hover:-translate-y-1!">
                <div className="border shadow-xl border-neutral-400 dark:border-green-950 dark:bg-[#163b29]/30 bg-[#b1fcd5c2] rounded-xl h-26 w-32 flex items-center justify-center text-center text-neutral-900 dark:text-white flex-col">
                    <div className="flex items-center justify-center gap-1 text-sm sm:text-lg"><Trophy className="w-4 h-4 text-amber-500" /> Total Points</div>
                    <h4 className="text-xl text-[#ff8163]">129</h4>
                    <p className="text-xs text-green-600">+8 today</p>
                </div>
            </div>

            <div className="fade-in-up absolute z-10 -top-20 sm:-top-18 -right-4 sm:right-5 hover:-translate-y-1!">
                <div className="border shadow-xl border-neutral-400 dark:border-green-950 dark:bg-[#163b29]/30 bg-[#b1fcd5c2] rounded-xl h-26 w-32 flex  justify-center text-center text-neutral-900 dark:text-white flex-col">
                    <div className="text-sm sm:text-lg">Streak</div>
                    <h4 className="text-base  text-green-600">5 days 🔥</h4>
                    <h4 className="text-[#ff8163] text-base sm:text-xl">5/21 <span className="dark:text-neutral-200 text-neutral-800 text-sm">completed</span></h4>
                    <div className="w-1/2 border-1 border-[#ff8163] mt-2 ml-2"></div>
                </div>
            </div>

            <div className="fade-in-up absolute z-10 -bottom-20 sm:-bottom-14 -right-4 sm:right-5 border shadow-xl border-neutral-400 dark:border-green-950 dark:bg-[#163b29]/30 bg-[#b1fcd5c2] rounded-xl h-26 w-32 flex items- justify-center text-neutral-900 dark:text-white text-center flex-col transform hover:-translate-y-1!">
                <div className="flex items-center justify-center gap-1 text-sm sm:text-lg"> <ChartSpline size={18} className="text-amber-500 " />Rank</div>
                <h4 className="text-[#ff8163] text-xl"># 2</h4>
                <div className="flex items-center gap-1 text-green-600  text-xs justify-center"><BsArrowUp /> +12</div>
            </div>

            <div className="fade-in-up bg-[#108a4715] rounded-xl border border-neutral-400 dark:border-green-950 shadow-xl m-auto w-fit flex flex-col hover:-translate-y-1!">
                {/* Top Browser Buttons */}
                <div className="flex py-3 px-8 gap-2 border-b bg-[#13613615] border-neutral-500 dark:border-green-900 mb-6">
                    <span className="h-3 w-3 bg-red-600 rounded-full"></span>
                    <span className="h-3 w-3 bg-yellow-600 rounded-full"></span>
                    <span className="h-3 w-3 bg-green-600 rounded-full"></span>
                </div>

                {/* Hero Image */}
                <img src="heroImage.png" alt="statics image" className="w-[500px]" />
            </div>
        </div>
    );
};


export default HeroSection