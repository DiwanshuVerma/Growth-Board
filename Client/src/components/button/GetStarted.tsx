import { ArrowRight } from "lucide-react"

const GetStarted = () => {  
    return(
        <button className="py-1 group px-4 relative w-40 h-fit rounded-full cursor-pointer bg-[#008236] text-xl text-white flex items-center gap-1">
            Get started <ArrowRight size={22} className="absolute right-3 group-hover:right-[10px] duration-200"/>
        </button>
    )
}
export default GetStarted