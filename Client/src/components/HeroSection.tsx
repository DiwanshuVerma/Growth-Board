import { BsArrowUp } from "react-icons/bs"
import BgEclipse from "./BgEclips"
import GetStarted from "./button/GetStarted"
import { LiaTrophySolid } from "react-icons/lia"
import { useAppDispatch } from "@/app/hooks";
import { toggleLoginForm } from "@/features/ui/uiSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

    const dispatch = useAppDispatch();
    const user = JSON.parse(localStorage.getItem('user') || "null")
    const guest = JSON.parse(localStorage.getItem('guest') || "null")

    const navigate = useNavigate()

    const onClick = () => {
        if (user || guest) navigate('/habits')
        else dispatch(toggleLoginForm())
    }

    return (
        <section className=" relative min-h-screen w-full flex flex-col md:flex-row pt-40 md:pt-0 justify-between items-center gap-4">
            <BgEclipse position="top-12 left-0 sm:left-72" />
            <BgEclipse position="right-12 bottom-0" />

            <div className="w-full md:w-1/2 space-y-6">
                <h1 className="leading-14 lg:leading-20 bg-linear-to-b dark:from-zinc-100 from-zinc-600 dark:to-zinc-900 to-zinc-950 text-transparent bg-clip-text text-5xl md:text-6xl lg:text-7xl font-semibold">Be 1% Better <br /><span className="bg-linear-to-b dark:from-green-500 from-green-950 dark:to-green-900 to-green-950 text-transparent bg-clip-text py-1">Every Day.</span></h1>

                <p className="max-w-2/3 text-lg text-zinc-400  font-normal py-1">Visualize progress. Stay accountable. Rise on the Leaderboard and Build habits that stick.</p>
                <GetStarted label="Get Started" onClick={onClick} />
            </div>

            <div className=" w-full  md:w-1/2 mt-24">
                <RightPart />
            </div>
        </section>
    )
}

const RightPart = () => {
    return (
        <div className="">

            <div className="bg-[#108a4715] relative rounded-xl border border-neutral-900 shadow-xl w-fit  transform transition-transform duration-200 hover:-translate-y-1 flex flex-col justify-center ms:justify-self-end">

                <div className="absolute -bottom-16 sm:-bottom-10 left-2 sm:-left-10 border shadow-xl border-neutral-900 dark:bg-[#163b29]/30 bg-[#91e49fc2] rounded-xl h-26 w-28 flex items- justify-center text-neutral-900 dark:text-white text-center flex-col transform transition-transform duration-200 hover:-translate-y-1">
                    <div className="flex items-center justify-center gap-1"> <LiaTrophySolid size={25} color="gold" />Rank</div>
                    <h4 className="text-[#ff8163] text-2xl"># 2</h4>
                    <div className="flex items-center gap-1 text-green-600 justify-center"><BsArrowUp /> +12</div>
                </div>

                <div className="absolute -top-18 sm:-top-18 right-2 sm:-right-6 border shadow-xl border-neutral-900 dark:bg-[#163b29]/30 bg-[#91e49fc2] rounded-xl h-26 w-28 flex items- justify-center text-neutral-900 dark:text-white text-center flex-col transform transition-transform duration-200 hover:-translate-y-1">
                    <div className="flex items- justify-center gap-1">Today's Goals</div>
                    <h4 className="text-[#ff8163] text-xl">2/3 <span className="dark:text-neutral-200 text-neutral-800 text-sm">completed</span></h4>
                    <div className="w-1/2 border-1 border-[#ff8163] mt-2 ml-2"></div>
                </div>

                <div className="flex py-3 px-8 gap-2 border-b bg-[#13613615] border-neutral-800 mb-6">
                    <span className="h-3 w-3 bg-red-600 rounded-full"></span>
                    <span className="h-3 w-3 bg-yellow-600 rounded-full"></span>
                    <span className="h-3 w-3 bg-green-600 rounded-full"></span>
                </div>
                <img src="heroImage.png" alt="statics image" className="w-[500px]" />
            </div>
        </div>
    )
}

export default HeroSection