import { features } from "../data/features"
import BgEclipse from "./BgEclips"

const Features = () => {
    return (
        <section className="text-center">
            <h2 className="bg-linear-to-b from-green-400 to-green-900 bg-clip-text text-transparent mb-4 text-4xl md:text-6xl font-semibold py-1">Let's make everday count</h2>
            <p className="bg-linear-to-b dark:from-zinc-100 from-zinc-700 dark:to-zinc-600 to-zinc-950 font-medium text-transparent bg-clip-text text-2xl">Stay Consistent, compete with friends and <span className="text-(--color-heading-primary) text-semibold  ">Grow</span></p>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 rounded-4xl mt-16">
                <BgEclipse position="inset-1/2 -translate-x-1/2 -translate-y-1/2"/>
                {features.map(feature => (
                    <div key={feature.title} className="rounded-3xl dark:text-neutral-100 text-neutral-800 shadow-xl p-8 dark:bg-[#0b1d0da1] bg-[#b4f7bf] text-left space-y-4  transform transition-transform duration-300 hover:-translate-y-2 ">
                        <div className={`${feature.bgColor} p-2 rounded-xl w-fit text-neutral-100`}>{feature.icon}</div>
                        <h3 className="font-semibold text-2xl">{feature.title}</h3>
                        <p className="">{feature.text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features