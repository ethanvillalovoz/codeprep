import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react"
import { Navigate, useLocation } from "react-router-dom"

export default function AuthenticationPage() {
  const location = useLocation()
  const isSignUp = location.pathname.startsWith("/sign-up")

  return (
    <div className="auth-container">
      <SignedOut>
        {isSignUp
          ? <SignUp path="/sign-up" routing="path" />
          : <SignIn path="/sign-in" routing="path" />}
      </SignedOut>
      <SignedIn><Navigate to="/" replace /></SignedIn>
    </div>
  )
}
