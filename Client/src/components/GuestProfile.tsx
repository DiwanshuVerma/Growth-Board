import { useState } from "react"
import ThemeToggle from "./ThemeToggle"
import { IoMdSunny } from "react-icons/io"
import { IoChevronDown, IoMoonOutline } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";


const GuestProfile = ({ handleLoginClick }: { handleLoginClick: () => void }) => {
    const guest = JSON.parse(localStorage.getItem("guest") || "null")
    const [showMenu, setShowMenu] = useState(false)
    const [theme, setThemeProp] = useState<String>("dark")
    const navigate = useNavigate()
    const toggleMenu = () => setShowMenu(prev => !prev)

    const handleNavigate = () => {
        navigate('/leaderboard')
        toggleMenu()
    }

    return (
        <div className="relative">
            <div onClick={toggleMenu} className="cursor-pointer flex items-center">
                <img src={guest.guestAvatar} alt="guest-avatar" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full" />
                <div className="rounded-full bg-green-800/30 py-1 px-2 h-fit flex gap-2 items-center">
                    <Trophy size={18} className="text-amber-500" />
                    0
                    <IoChevronDown className={`ml-1 text-neutral-700 dark:text-neutral-300 ${showMenu && 'rotate-180'}`} />
                </div>
            </div>

            {showMenu && (
                <div className="absolute right-0 mt-3 w-72 sm:w-64 rounded-xl shadow-md bg-green-100 dark:bg-[#265542] border dark:border-green-900 border-green-300 z-50">
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-t-xl">
                        <img src={guest.guestAvatar} alt="avatar" className="w-14 h-14 rounded-full" />
                        <div>
                            <p className="text-sm font-semibold">{guest.guestName}</p>
                            <p className="text-xs">Guest Mode</p>
                        </div>
                    </div>

                    <div className="px-4 py-3 space-y-3 text-black dark:text-white text-sm">
                        <div className="p-2 hover:bg-green-700 cursor-default rounded flex items-center gap-2">
                            {theme === "dark" ? <IoMoonOutline size={18} /> : <IoMdSunny size={18} />}
                            {theme === "light" ? "Light Mode" : "Dark Mode"}
                            <ThemeToggle setThemeProp={setThemeProp} />
                        </div>

                        <div onClick={() => navigate('/habits')} className="p-2 hover:bg-green-700 cursor-pointer rounded flex items-center gap-2 sm:hidden">
                            <FaExternalLinkAlt color="gold" />
                            Habits
                        </div>
                        <div onClick={handleNavigate} className="p-2 hover:bg-green-700 cursor-pointer rounded flex items-center gap-2">
                            <FaExternalLinkAlt color="gold" />
                            Leaderboard
                        </div>
                        <button
                            onClick={handleLoginClick}
                            className="w-full px-3 py-1 text-lg flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default GuestProfile