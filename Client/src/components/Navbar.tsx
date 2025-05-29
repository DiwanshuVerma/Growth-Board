import GetStarted from "./button/GetStarted"

const Navbar = () => {
    return (
        <nav className="flex justify-between  w-full items-center py-2 px-12 fixed top-0 z-50 backdrop-blur-lg border-b border-green-950" >
            <div>
                <img src="logo.png" alt="Growth-board logo" className="w-40 cursor-pointer" />
            </div>

            <div>
                <GetStarted />
            </div>
        </nav>
    )
}

export default Navbar