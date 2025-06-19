import { SiDgraph } from "react-icons/si"

function Leaderboard() {
    return (
        <button
            // onClick={() => dispatch(toggleLoginForm())}
            className="py-1 group px-3 sm:px-4 relative w-36 sm:w-40 h-fit rounded-full cursor-pointer bg-linear-to-r from-green-600 to-green-900 text-base sm:text-lg text-white flex items-center gap-1">
            Leaderboard <SiDgraph size={20} color="yellow" className="absolute right-3 group-hover:right-[10px] duration-200" />
        </button>
    )
}


export default Leaderboard