import { CgMail } from "react-icons/cg"
import { FaXTwitter } from "react-icons/fa6"

type LoginProps = {
    label: string;
    type: 'filled' | 'transparent';
    handle?: 'Email' | 'Twitter' | '';
    onClick?: () => void;
}
const Login = ({ label, type, handle, onClick }: LoginProps) => {
    

    return (
        <button
            onClick={onClick}
            className={`${type === 'filled'
                    ? 'bg-gradient-to-r from-green-700 to-green-800'
                    : 'bg-[#011403cc]'
                } border border-neutral-700 py-2 group text-sm sm:text-base px-4 min-w-56 h-fit rounded-lg shadow cursor-pointer text-white flex items-center justify-center gap-2`}
        >
            {handle === "Email" ? <CgMail size={22} /> :
            handle === "Twitter" ? <FaXTwitter size={20} /> : ""} 
            {label}
        </button>
    )
}

export default Login