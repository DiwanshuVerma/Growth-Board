import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"


function App() {

  return (
    <div className="relative z-0" >
      <Navbar />

      <div className="px-6 sm:px-12 max-w-screen-xl mx-auto">
        <LandingPage />
      </div>

      <Footer />
    </div>
  )
}

export default App
