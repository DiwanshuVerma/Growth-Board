import { features } from "../data/features"
import BgEclipse from "./BgEclips"

const Features = () => {
    return (
        <section className="text-center">
            <h2 className="text-(--color-heading-primary) mb-4 text-4xl md:text-6xl font-semibold">Let's make everday count</h2>
            <p className="text-white text-2xl">Stay Consistent, compete with friends and <span className="text-(--color-heading-primary) text-semibold  ">Grow</span></p>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-4xl mt-16 text-white">
                <BgEclipse position="inset-1/2 -translate-x-1/2 -translate-y-1/2"/>
                {features.map(feature => (
                    <div key={feature.title} className="rounded-3xl shadow-xl p-8 bg-[#0b1d0da1] text-left space-y-4  transform transition-transform duration-300 hover:-translate-y-2 ">
                        <div className={`${feature.bgColor} p-2 rounded-xl w-fit`}>{feature.icon}</div>
                        <h3 className="font-semibold text-2xl">{feature.title}</h3>
                        <p>{feature.text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features