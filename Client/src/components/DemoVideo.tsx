import BgEclipse from "./BgEclips"

export const DemoVideo = () => {
    return (
        <section className="my-4 md:my-22 relative">
            <BgEclipse position="hidden sm:block left-56 top-40" />
            <BgEclipse position="hidden sm:block visible dark:invisible right-60 top-76" />

            <video
                muted
                playsInline
                loop
                autoPlay
                preload="auto"
                className="rounded-lg h-auto md:h-[500px] w-fit m-auto shadow-2xl border-2 border-green-700 dark:border-green-950"
            >
                <source
                    src="https://res.cloudinary.com/dsvsm4qdo/video/upload/q_auto,f_auto,vc_auto/fl_progressive/v1753772703/Growth_board_yw7iwe.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag
            </video>
        </section>
    )
}