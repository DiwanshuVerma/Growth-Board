import { FaXTwitter } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";
import { FaGithub } from "react-icons/fa";

const Contact = ({label}: {label: string}) => {

    return (
        <button className="border border-neutral-700 px-2 py-1 text-sm flex items-center gap-2 rounded cursor-pointer">
            {label}
            {label === "Twitter" ? <FaXTwitter size={21}/> : label === "Gmail" ? <CgMail size={21}/> : <FaGithub size={22} />}
        </button>
    )
}

export default Contact