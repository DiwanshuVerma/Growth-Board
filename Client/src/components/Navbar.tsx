import { useState } from "react";
import GetStarted from "./button/GetStarted"
import ThemeToggle from "./ThemeToggle"
import { SiDgraph } from "react-icons/si";
import { Cross, CrossIcon, Menu } from "lucide-react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import GuestLogin from "./button/Guest";
import Login from "./button/login";
import { toggleLoginForm, toggleLogoutForm } from "@/features/ui/uiSlice";
import { useAppDispatch } from "@/app/hooks";
import { IoMdPower } from "react-icons/io";


const Navbar = () => {

    const [toggleMenu, setToggleMenu] = useState<boolean>(false)
    const navigate = useNavigate()

    const guest = JSON.parse(localStorage.getItem("guest") || "null")
    const user = JSON.parse(localStorage.getItem("user") || "null")

    // const avatar = localStorage.getItem("avatar")

    const dispatch = useAppDispatch()

    const handleaLoginClick = () => {
        dispatch(toggleLoginForm())
    }

    return (
        <nav className="flex justify-between  w-full items-center py-2 px-6 sm:px-12 fixed top-0 z-50 backdrop-blur-lg border-b bg:border-green-950 border-green-300 dark:border-green-900" >
            <div>
                <img onClick={() => navigate('/')} src="logo.png" alt="Growth-board logo" className="w-36 sm:w-46 cursor-pointer" />
            </div>

            <div className="hidden sm:flex gap-4 items-center">
                {/* <ThemeToggle /> */}
                <Leaderboard />

                {guest ?
                    <GuestProfile handleaLoginClick={handleaLoginClick} /> :
                    user ? <UserProfile /> :
                        <GetStarted label="Get Started" onClick={handleaLoginClick} />}

            </div>

            <div className="block sm:hidden text-white">
                {toggleMenu ? <FiX size={25} onClick={() => setToggleMenu(false)} /> : <Menu onClick={() => setToggleMenu(true)} />}
            </div>

            <div className={`fixed top-16 sm:top-20 backdrop-blur-3xl h-28 bg-green-900/40 w-fit duration-200 p-4 rounded flex sm:hidden justify-between items-center flex-col ${toggleMenu ? 'right-6 sm:right-12' : '-right-56'}`}>
                <Leaderboard />
                <GetStarted label="Get Started" onClick={handleaLoginClick} />
            </div>
        </nav>
    )
}

const GuestProfile = ({ handleaLoginClick }: { handleaLoginClick: () => void }) => {
    const guest = JSON.parse(localStorage.getItem("guest") || "null")
    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => {
        setShowMenu(prev => !prev)
    }

    return (
        <div className="relative">
            <div
                className="cursor-pointer"
                onClick={toggleMenu}
            >
                <img src={guest.guestAvatar} alt="guest-avatar" className="w-14 h-14 rounded-full" />
            </div>

            {showMenu && (
                <div className="space-y-2 absolute right-2 text-lg top-15  h-fit  dark:bg-[#163b29]/90 bg-[#91e49fc2] rounded p-2">
                    <h3 className="text-base mb-3 dark:text-white text-neutral-900 ">{guest.guestName}</h3>
                    <ThemeToggle />
                    <GetStarted label="Login" onClick={handleaLoginClick} />

                    <div className="absolute -top-2 right-1 rotate-45  dark:bg-[#163b29]/90 bg-[#91e49fc2] h-4 w-4"></div>
                </div>
            )}
        </div>
    )
}

const UserProfile = () => {
    const user = JSON.parse(localStorage.getItem("user")!)

    const [showMenu, setShowMenu] = useState(false)
    const dispatch = useAppDispatch()

    const toggleMenu = () => {
        setShowMenu(prev => !prev)
    }

    return (
        <div className="relative">
            <div
                className=" rounded-full  cursor-pointer flex items-center justify-center"
                onClick={toggleMenu}
            >
                <img src={user.avatar} className="rounded-full h-14 w-14" alt="user-profile-avatar" />
            </div>

            {showMenu && (
                <div className="space-y-2 absolute right-2 text-lg h-fit  dark:bg-[#163b29]/90 bg-[#91e49fc2] rounded p-2">
                    <h3 className="text-base mb-3 dark:text-white text-neutral-900">{user.username}</h3>
                    <ThemeToggle />
                    <button onClick={() => dispatch(toggleLogoutForm())} className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer bg-red-700 border-none hover:bg-red-800 text-sm"><IoMdPower />Logout</button>

                    <div className="absolute -top-2 right-1 rotate-45  dark:bg-[#163b29]/90 bg-[#91e49fc2] h-4 w-4"></div>
                </div>
            )}
        </div>
    )
}


function Leaderboard() {
    return (
        <button
            // onClick={() => dispatch(toggleLoginForm())}
            className="py-1 group px-3 sm:px-4 relative w-36 sm:w-40 h-fit rounded-full cursor-pointer bg-linear-to-r from-green-600 to-green-900 text-base sm:text-lg text-white flex items-center gap-1">
            Leaderboard <SiDgraph size={20} color="yellow" className="absolute right-3 group-hover:right-[10px] duration-200" />
        </button>
    )
}

export default Navbar