import { ArrowRight } from "lucide-react"

const GetStarted = () => {  
    return(
        <button className="py-1 group px-3 sm:px-4 relative w-32 sm:w-40 h-fit rounded-full cursor-pointer bg-linear-to-r from-green-600 to-green-900 text-base sm:text-xl text-white flex items-center gap-1">
            Get started <ArrowRight size={22} className="absolute right-3 group-hover:right-[10px] duration-200"/>
        </button>
    )
}
export default GetStarted