import BgEclipse from "./BgEclips"
import GetStarted from "./button/GetStarted"

const HeroSection = () => {
    return (
        <section className="min-h-screen w-full flex justify-between items-center">
            <BgEclipse position="top-12 left-76" />
            <div className=" flex-1 ">
                <h1 className="mb-8 text-white text-5xl md:text-7xl font-semibold">Build Better Habits <br /> <span className="text-(--color-heading-primary)"> One Day At a Time</span></h1>
                <GetStarted />
            </div>

            <div className="flex-1 justify-self-center-safe flex justify-end items-end mt-14">
                <img src="heroImage.png" alt="statics image"  className="w-[550px]"/>
            </div>
        </section>
    )
}

export default HeroSection