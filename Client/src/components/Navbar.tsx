
import GetStarted from "./button/GetStarted"
import { useNavigate } from "react-router-dom";
import { toggleLoginForm } from "@/features/ui/uiSlice";
import { useAppDispatch } from "@/app/hooks";
import UserProfile from "./UserProfile";
import GuestProfile from "./GuestProfile";

const Navbar = () => {
    const navigate = useNavigate()
    const guest = JSON.parse(localStorage.getItem("guest") || "null")
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const dispatch = useAppDispatch()

    const handleLoginClick = () => {
        dispatch(toggleLoginForm())
    }

    return (
        <nav className="flex justify-between items-center py-2 px-6 sm:px-12 fixed top-0 z-50 w-full backdrop-blur-lg border-b bg-green-50/20 dark:bg-green-950/20 dark:border-green-900 border-green-300">
            {/* Logo */}
            <div>
                <img onClick={() => navigate('/')} src="logo.png" alt="Growth-board logo" className="w-32 sm:w-40 cursor-pointer" />
            </div>

            {/* Right side (profile dropdown only) */}
            <div className="flex items-center gap-3">
                {guest ? (
                    <GuestProfile handleLoginClick={handleLoginClick} />
                ) : user ? (
                    <UserProfile />
                ) : (
                    <GetStarted label="Get Started" onClick={handleLoginClick} />
                )}
            </div>
        </nav>
    )
}

export default Navbar