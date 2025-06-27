import { IoMdSunny } from "react-icons/io"
import ThemeToggle from "./ThemeToggle"
import { BiSolidCoin } from "react-icons/bi"
import { useState } from "react"
import { FaExternalLinkAlt } from "react-icons/fa"
import { IoChevronDown, IoMoonOutline } from "react-icons/io5"
import { MdExitToApp } from "react-icons/md";
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { PointsRulesDialog } from "./PointsRulesDialoge"
import { useDispatch } from "react-redux"
import { toggleLogoutForm } from "@/features/ui/uiSlice"
import { useNavigate } from "react-router-dom"
import { Trophy } from "lucide-react"
import { useAppSelector } from "@/app/hooks"

const UserProfile = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const stateUser = useAppSelector(state => state.auth.user)

    const [showMenu, setShowMenu] = useState(false)
    const [theme, setThemeProp] = useState<String>("dark")
    const dispatch = useDispatch()
    const toggleMenu = () => setShowMenu(prev => !prev)
    const navigate = useNavigate()

    return (
        <TooltipProvider>
            <div className="relative">
                <div onClick={toggleMenu} className="cursor-pointer flex items-center">
                    <img src={user.user.avatar} alt="guest-avatar" className="hover:scale-110 w-12 h-12 sm:w-14 sm:h-14 rounded-full" />
                    <div className="rounded-full bg-green-800/30 py-1 px-2 h-fit flex gap-2 items-center">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        {stateUser?.points || 0}
                        <IoChevronDown className={`ml-1 text-neutral-700 dark:text-neutral-300 ${showMenu && 'rotate-180'}`} />
                    </div>  
                </div>

                {showMenu && (
                    <div className="absolute right-0 mt-3 w-72 sm:w-64 rounded-xl shadow-md bg-green-100 dark:bg-[#265542] border dark:border-green-900 border-green-300 z-50">
                        <div className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-t-xl">
                            <img src={user.user.avatar} alt="avatar" className="w-14 h-14 rounded-full" />
                            <div>
                                <p className="text-sm font-semibold">{user.user.username}</p>
                                <p className="text-xs">User Mode</p>
                            </div>
                        </div>

                        <div className="px-4 py-3 space-y-1 text-black dark:text-white text-sm">
                            <div className="p-2 hover:bg-green-700 cursor-default rounded flex items-center gap-2 ">
                                <BiSolidCoin color="gold" size={20} />
                                <span>{user.user.points} Points</span>

                                <div>
                                    <PointsRulesDialog />
                                </div>
                            </div>
                            <div onClick={() => navigate('/habits')} className="p-2 hover:bg-green-700 cursor-pointer rounded flex items-center gap-2 sm:hidden">
                                <FaExternalLinkAlt color="gold" />
                                Habits
                            </div>
                            <div onClick={() => navigate("/leaderboard")} className="p-2 hover:bg-green-700 cursor-pointer rounded flex items-center gap-2">
                                <FaExternalLinkAlt color="gold" />
                                Leaderboard
                            </div>
                            <div className="p-2 hover:bg-green-700 cursor-default rounded flex items-center gap-2">
                                {theme === "dark" ? <IoMoonOutline size={18} /> : <IoMdSunny size={18} />}
                                {theme === "light" ? "Light Mode" : "Dark Mode"}
                                <ThemeToggle setThemeProp={setThemeProp} />
                            </div>

                            <div onClick={() => dispatch(toggleLogoutForm())} className="p-2 hover:bg-green-700 cursor-pointer text-[rgb(255,29,29)] rounded flex items-center gap-2">
                                <MdExitToApp size={20} className="text-black dark:text-white" />
                                Log out
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TooltipProvider>
    )
}




export default UserProfile