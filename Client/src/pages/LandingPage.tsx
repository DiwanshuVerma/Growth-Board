import { DemoVideo } from "@/components/DemoVideo"
import Features from "../components/Features"
import HeroSection from "../components/HeroSection"
import LoginLinksSection from "../components/LoginLinksSection"

const LandingPage = () => {
    return (
        <div className="space-y-36 mb-12">
            <HeroSection />
            <Features />
            <LoginLinksSection />
            <DemoVideo />
        </div>
    )
}
export default LandingPage