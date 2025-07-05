import { FaRegCopy } from "react-icons/fa6";
import Contact from "./button/Contact"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
    const navigate = useNavigate()

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('diwanshu63019@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Hide after 3 sec
    };

    return (
        <section className="dark:text-white w-full border-t py-6 sm:py-8 dark:border-green-950 border-green-300 text-black px-6 sm:px-12 dark:bg-[#080f0956] bg-[#b1f7bd]">

            <div className="flex justify-between flex-col sm:flex-row sm:gap-0 gap-8">
                <div>
                    <img src="logo.png" alt="footer logo" className="w-42 sm:w-48 mb-4" />

                    <p className="dark:text-neutral-200 text-sm sm:text-[16px] leading-7">Growth Board is your daily campanion <br /> for Building long term, <br /> Life changing Habits. <br /> Simple, Motivating and designed to help you grow.</p>
                </div>
                <div>
                    <p>Have any query? Drop us at:</p>
                    <div className="mt-1 mb-5 items-center">
                        <div>
                            <a href="mailto:diwanshu63019@gmail.com" target="_blank" className="text-sm mr-1 text-green-700 dark:text-green-500 hover:underline">diwanshu63019@gmail.com</a>
                            <button className='cursor-pointer relative group' onClick={handleCopy}>
                                <FaRegCopy size={18} />
                                <span className='group-hover:visible invisible bg-black text-white p-2 rounded-lg absolute -top-10 -right-5 text-sm'>Copy</span>
                                {copied && (
                                    <span className='bg-black text-white p-2 rounded-lg absolute -top-10 -right-5 text-sm'>Copied</span>
                                )}
                            </button>
                        </div>
                        <div className="flex gap-2 mt-1 items-center">
                            Or
                            <Contact label="Twitter" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">A star means a lot<Contact label="GitHub" /></div>

                    <p onClick={() => navigate('/privacy')} className="cursor-pointer hover:underline text-sm  mb-1 dark:text-neutral-400 text-neutral-600">Privacy Policy</p>
                    <p onClick={() => navigate('/terms')} className="cursor-pointer hover:underline text-sm dark:text-neutral-400 text-neutral-600">Terms of Service</p>
                </div>
            </div>
        </section>
    )
}

export default Footer