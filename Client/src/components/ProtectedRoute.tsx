import { Navigate, useLocation } from 'react-router-dom'
import type { JSX } from 'react'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()
  const user = localStorage.getItem("user")
  const guest = localStorage.getItem("guest")
  return guest || user ? children : <Navigate to="/" state={{ from: location }} replace />
}