
import { ArrowRight } from "lucide-react"

const GetStarted = ({label, onClick}: {label: string, onClick: () => void}) => {
    
    return (
        <button
            onClick={onClick}
            className="py-1 group pr-10 px-3  relative h-fit rounded-full cursor-pointer bg-linear-to-r from-green-600 to-green-900 text-base sm:text-xl text-white flex items-center gap-1" >
            {label} < ArrowRight size={22} className="absolute right-3 group-hover:right-[10px] duration-200" />
        </button >
    )
}

export default GetStarted