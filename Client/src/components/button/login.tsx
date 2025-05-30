import { BsGithub } from "react-icons/bs"
import { FaXTwitter } from "react-icons/fa6"

const Login = ({label, type}: {label: string, type: string}) => {
    return <button className={`${type === 'filled' ? 'bg-linear-to-r from-green-700 to-green-800' : 'bg-[#011403cc]'} border border-neutral-700 py-2 group text-sm sm:text-base px-2 sm:px-4 w-fit h-fit rounded-lg shadow cursor-pointer  text-white flex items-center gap-1 sm:gap-2 `}>
        {type === "filled" ? <BsGithub size={20} color="black" /> : <FaXTwitter  size={20}/>}
        {label}
    </button>
}

export default Login