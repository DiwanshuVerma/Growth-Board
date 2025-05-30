import GetStarted from "./button/GetStarted"
import ThemeToggle from "./ThemeToggle"

const Navbar = () => {
    return (
        <nav className="flex justify-between  w-full items-center py-2 px-6 sm:px-12 fixed top-0 z-50 backdrop-blur-lg border-b border-green-950" >
            <div>
                <img src="logo.png" alt="Growth-board logo" className="w-36 sm:w-46 cursor-pointer" />
            </div>


            <div className="flex gap-4 items-center">
            {/* <ThemeToggle /> */}
                <GetStarted />
            </div>
        </nav>
    )
}



export default Navbar