import { useEffect } from 'react'

import { navigate, useLocation } from '@redwoodjs/router'

import { loadAppState } from 'src/lib/appState'

type RequireAuthProps = {
  children: React.ReactNode
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { pathname } = useLocation()
  const user = loadAppState().user

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true })
    }
  }, [user, pathname])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050608] text-[13px] text-[#8b95a5]">
        Redirecting to sign in...
      </div>
    )
  }

  return <>{children}</>
}

export default RequireAuth
