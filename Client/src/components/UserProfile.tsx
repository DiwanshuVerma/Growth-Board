import { IoMdSunny } from "react-icons/io"
import ThemeToggle from "./ThemeToggle"
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
import { FaXTwitter } from "react-icons/fa6"
import { EditProfile } from "./EditProfile"

const UserProfile = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const stateUser = useAppSelector(state => state.auth.user)

    const [showMenu, setShowMenu] = useState(false)
    const [theme, setThemeProp] = useState<String>("dark")
    const dispatch = useDispatch()
    const toggleMenu = () => setShowMenu(prev => !prev)
    const navigate = useNavigate()

    const handleNavigate = (path: string) => {
        navigate(path)
        toggleMenu()
    }

    return (
        <TooltipProvider>
            <div className="relative">
                <div onClick={toggleMenu} className="cursor-pointer flex items-center">
                    <img src={user.user.avatar} alt="guest-avatar" className="w-12 h-12 rounded-full mr-2 object-cover" />
                    <div className="rounded-full text-base bg-green-800/30 py-1 px-2 h-fit flex gap-2 items-center">
                        <Trophy size={17} className="text-amber-500" />
                        {stateUser?.points || 0}
                        <IoChevronDown className={`ml-1 text-neutral-700 dark:text-neutral-300 ${showMenu && 'rotate-180'}`} />
                    </div>
                </div>

                {showMenu && (
                    <div className="absolute right-0 mt-3 w-72 sm:w-64 rounded-xl shadow-md bg-green-100 dark:bg-[#265542] border dark:border-green-900 border-green-300 z-50">
                        <div className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-t-xl">
                            <img src={user.user.avatar} alt="avatar" className="min-w-14 w-14 min-h-14 h-14 rounded-full object-cover" />
                            <div>
                                <p className="text-base font-semibold">{user.user.displayName || user.user.username}</p>
                                <div className="text-xs flex items-center gap-1 hover:underline cursor-default  ">
                                    {user.user.displayName && <FaXTwitter size={12} />}
                                    {user.user.displayName ? (
                                        <a href={`https://x.com/${user.user.username}`} target="_blank">
                                            {user.user.username}
                                        </a>
                                    ) : user.user.email}
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-3 space-y-1 text-black dark:text-white text-sm">
                            <div>
                                <EditProfile />
                            </div>

                            <div className="p-2 hover:bg-green-700 cursor-default rounded flex items-center gap-2 ">
                                <Trophy className='text-amber-500' size={18} />
                                <span>{user.user.points} Points</span>

                                <div>
                                    <PointsRulesDialog />
                                </div>
                            </div>
                            <div onClick={() => handleNavigate('/habits')} className="p-2 hover:bg-green-700 cursor-pointer rounded flex items-center gap-2 sm:hidden">
                                <FaExternalLinkAlt className='text-amber-500' />
                                Habits
                            </div>
                            <div onClick={() => handleNavigate("/leaderboard")} className="p-2 hover:bg-green-700 cursor-pointer rounded flex items-center gap-2">
                                <FaExternalLinkAlt className='text-amber-500' />
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