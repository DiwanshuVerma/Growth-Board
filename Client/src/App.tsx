import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"


function App() {

  return (
    <div className="relative z-0" >
      <Navbar />

      <div className=" px-12 ">
        <LandingPage />
      </div>

      <Footer />
    </div>
  )
}

export default App
