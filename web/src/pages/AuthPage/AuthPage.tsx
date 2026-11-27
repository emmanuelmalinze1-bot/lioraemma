import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react'

import { Link, navigate } from '@redwoodjs/router'

import Logo from 'src/components/Logo'
import { loginAccount, registerAccount } from 'src/lib/appState'

type Mode = 'register' | 'login'

const inputClasses =
  'w-full rounded-xl border border-[#3F384A] bg-[#16131C] py-3.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all focus:border-[#E5B84D] focus:outline-none focus:ring-1 focus:ring-[#E5B84D]/50'

const labelClasses = 'mb-2 block text-xs font-bold text-white'

const iconWrap =
  'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#A89A6F]'

const goldButton =
  'border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)] transition-all hover:brightness-105 active:scale-[0.98]'

const goldActive =
  'border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.3)]'

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>('register')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === 'register'

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    const confirmPassword = String(data.get('confirmPassword') || '')
    const username = String(data.get('username') || '').trim()
    const fullName = String(data.get('fullName') || '').trim()

    if (isRegister) {
      if (!fullName || !username) {
        setError('Please fill in your full name and username.')
        return
      }
      if (!email) {
        setError('Please enter your email address.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    } else {
      if (!email) {
        setError('Please enter your email address.')
        return
      }
      if (!password) {
        setError('Please enter your password.')
        return
      }
    }

    setSubmitting(true)
    setError('')

    try {
      const result = isRegister
        ? await registerAccount({ fullName, username, email, password })
        : await loginAccount(email, password)

      if ('error' in result) {
        setError(result.error)
        return
      }

      navigate('/home')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-crosshatch flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Logo />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-[#E5B84D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px] rounded-[24px] border border-[#2D2735] bg-[#0E0B12] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-bold tracking-tight">
                {isRegister ? 'Create Member Account' : 'Member Log In'}
              </h1>
              <p className="mt-1 max-w-[180px] text-[13px] leading-snug text-gray-400">
                {isRegister
                  ? 'Complete your details below to register'
                  : 'Enter your email and password to continue'}
              </p>
            </div>
            <div className="flex shrink-0 rounded-full border border-[#3F384A] bg-[#09080B] p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  isRegister ? goldActive : 'text-white hover:text-[#E5B84D]'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  !isRegister ? goldActive : 'text-white hover:text-[#E5B84D]'
                }`}
              >
                Log In
              </button>
            </div>
          </div>

          <div className="mb-6 h-px w-full bg-[#2D2735]" />

          {error && (
            <div className="mb-6 rounded-xl border border-[#7f1d1d] bg-[#3b1111] p-3 text-xs text-[#f87171]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses} htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className={iconWrap}>
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="e.g. Chidi Okonkwo"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClasses} htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <span className={iconWrap}>
                      <AtSign className="h-4 w-4" />
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      placeholder="username"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className={labelClasses} htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className={iconWrap}>
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className={isRegister ? 'grid grid-cols-2 gap-4' : ''}>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    className="text-xs font-bold text-white"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      className="text-xs font-medium text-[#E5B84D] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className={iconWrap}>
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isRegister ? 'Min. 6 chars' : '••••••••'}
                    className={`${inputClasses} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 transition-colors hover:text-white"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className={labelClasses} htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className={iconWrap}>
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      type="password"
                      placeholder="Repeat password"
                      className={inputClasses}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold ${goldButton} disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {submitting
                ? isRegister
                  ? 'Creating Account...'
                  : 'Signing In...'
                : isRegister
                  ? 'Create Member Account'
                  : 'Log In to Liora'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>

      <footer className="pb-8 text-center text-xs font-medium tracking-wide text-gray-500">
        Liora Member Escrow &amp; Encrypted Authentication
      </footer>
    </div>
  )
}

export default AuthPage
