import { Route, Routes, useNavigate } from "react-router-dom"
import { useAppSelector } from "./app/hooks"
import Footer from "./components/Footer"
import LoginPopUp from "./components/LoginPopUp"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import { useEffect } from "react"
import Habits from "./pages/Habits"
import { LogoutPopup } from "./components/LogoutPopup"
import { useHabitSync } from "./hooks/useHabitSync"

function App() {

  useHabitSync() // it fetch habits based on source --> source: 'local' | 'backend'

  const navigate = useNavigate()

  // Sync theme on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const currentTheme = savedTheme || 'dark';
    document.documentElement.classList.toggle('dark', currentTheme === 'dark')
    localStorage.setItem("theme", currentTheme)
  }, []);

  const showLoginForm = useAppSelector(state => state.ui.showLoginForm)
  const showLogoutForm = useAppSelector(state => state.ui.showLogoutForm)
  const isGuestUser = useAppSelector(state => state.auth.isGuest)
  const isUserLogin = useAppSelector(state => state.auth.user)

  useEffect(() => {
    if (!isUserLogin && !isGuestUser) navigate('/')
  }, [isUserLogin, isGuestUser])

  return (
    <div className="relative z-0 min-h-screen">
      <Navbar />

      {showLoginForm && <LoginPopUp hideGuestOption={isGuestUser} />}
      {showLogoutForm && <LogoutPopup />}

      <div className="px-6 sm:px-10 max-w-screen-xl mx-auto">
        <Routes>
          <Route path="/habits" element={<Habits />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<PageNotFound />} />
          {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
        </Routes>
      </div>

      <Routes>
        <Route path="/landing" element={<Footer />} />
        <Route path="/" element={<Footer />} />
      </Routes>
    </div>
  )
}

function PageNotFound() {
  return (
    <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-fit">
      <h1 className="text-white text-2xl sm:text-4xl text-nowrap">404 Page Not Found</h1>
    </div>
  )
}

export default App
