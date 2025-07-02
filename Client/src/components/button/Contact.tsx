import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

const Contact = ({ label }: { label: string }) => {

    return (
        <button className="border border-neutral-700 px-2 py-1 text-sm rounded cursor-pointer">
            <a href={label === "Twitter" ? "https://x.com/diwanshu_28" : "https://github.com/DiwanshuVerma/Growth-Board"} target="_blank" className="flex items-center gap-2">
                {label}
                {label === "Twitter" ? <FaXTwitter size={16} /> : <FaGithub size={20} />}
            </a>
        </button>
    )
}

export default Contact