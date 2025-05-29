import Contact from "./button/Contact"
import { IoIosStar } from "react-icons/io";

const Footer = () => {
    return (
        <section className="text-white space-y-4 border-t py-8 border-neutral-800 px-12 bg-[#080f0956]">
            <img src="logo.png" alt="footer logo" className="w-48 " />

            <div className="flex justify-between">
                <p className="text-neutral-200 text-[16px] leading-7">Growth Board is your daily campanion <br /> for Building long term, <br /> Life changing Habits. <br /> Simple, Motivating and designed to help you grow.</p>

                <div>
                    <p>Have any query? Drop us at:</p>
                    <div className="flex gap-2 mt-2 mb-5 items-center">
                        <Contact label="Gmail" />
                        Or
                        <Contact label="Twitter" />
                    </div>

                    <div className="flex items-center gap-3">Give us a <IoIosStar size={23} color="yellow" /> <Contact label="GitHub" /></div>
                </div>
            </div>
        </section>
    )
}

export default Footer