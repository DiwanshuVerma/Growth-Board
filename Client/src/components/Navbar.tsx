
import GetStarted from "./button/GetStarted"
import { useLocation, useNavigate } from "react-router-dom";
import { toggleLoginForm } from "@/features/ui/uiSlice";
import { useAppDispatch } from "@/app/hooks";
import UserProfile from "./UserProfile";
import GuestProfile from "./GuestProfile";
import { GoArrowUpRight } from "react-icons/go";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isActive = (path: string) => location.pathname === path
    const [_theme, setThemeProp] = useState<String>("dark")

    const guest = JSON.parse(localStorage.getItem("guest") || "null")
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const dispatch = useAppDispatch()

    const handleLoginClick = () => {
        dispatch(toggleLoginForm())
    }

    return (
        <nav className="flex justify-between items-center py-2 px-6 sm:px-12 fixed top-0 z-50 w-full backdrop-blur-lg border-b bg-green-50/20 dark:bg-green-950/20 dark:border-green-950 border-green-300">
            {/* Logo */}
            <div>
                <img onClick={() => navigate('/')} src="logo.png" alt="Growth-board logo" className="w-32 sm:w-40 cursor-pointer" />
            </div>

            {(user || guest) && (
                <ul className="hidden gap-4 mr-12 sm:flex">
                    <li onClick={() => navigate('/habits')} className={`text-sm hover:text-green-950 dark:hover:text-green-300 cursor-pointer ${isActive("/habits") ? 'text-green-600 dark:text-green-400' : 'dark:text-neutral-400 text-neutral-800'}`}>Habits</li>
                    <li onClick={() => navigate('/leaderboard')} className={`text-sm hover:text-green-950 dark:hover:text-green-300 cursor-pointer flex  ${isActive("/leaderboard") ? 'text-green-600 dark:text-green-400' : 'dark:text-neutral-400 text-neutral-800'}`}>Leaderboard <GoArrowUpRight /></li>
                </ul>
            )}

            {/* Right side (profile dropdown only) */}
            <div className="flex items-center gap-1">
                {guest ? (
                    <GuestProfile handleLoginClick={handleLoginClick} />
                ) : user ? (
                    <UserProfile />
                ) : (
                    <>
                        <GetStarted label="Get Started" onClick={handleLoginClick} />
                        <ThemeToggle setThemeProp={setThemeProp} />
                    </>

                )}
            </div>
        </nav>
    )
}

export default Navbar