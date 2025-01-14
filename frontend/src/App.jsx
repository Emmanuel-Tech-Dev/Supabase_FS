

import './App.css'
import Login from './pages/auth/login'
import PasswordReset from './pages/auth/PasswordReset'
import Register from './pages/auth/Register'
import OtpLogin from './pages/auth/otpLogin'
import VerifyOtp from './pages/auth/VerifyOtp'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from './pages/Home'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'

function App() {

  const authRoute = {
    path: "/auth/*",
    children: [
      { path: "", element: <Navigate to="/auth/login" /> },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <PasswordReset /> },
      { path: "register", element: <Register /> },
      { path: "otp-login", element: <OtpLogin /> },
      { path: "verify-otp", element: <VerifyOtp /> },
    ]
  }

  const userRoute = {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      { path: "/home", element: <Home /> },

    ]
  }

  const router = createBrowserRouter([
    authRoute, userRoute
  ])

  return (
    <>
      <ThemeProvider>

        <RouterProvider router={router} />
      </ThemeProvider>


    </>
  )
}

export default App
