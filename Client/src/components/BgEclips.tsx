const BgEclipse = ({position}: {position: string}) => {
    return <div className={`${position} absolute h-44 w-44 bg-green-500 dark:blur-[180px] blur-[130px] rounded-full -z-10`}></div>
}

export default BgEclipse