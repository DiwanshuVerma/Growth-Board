
const Login = ({label, type}: {label: string, type: string}) => {
    return <button className={`${type === 'filled' ? 'bg-green-800' : 'bg-[#011403]'} border border-neutral-700 py-1 group px-4 w-fit h-fit rounded-full cursor-pointer  text-white flex items-center gap-1 `}>
        {label}
        
    </button>
}

export default Login