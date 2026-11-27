import { useState } from 'react'

import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Crown,
  Globe,
  Layers,
  Lock,
  LogOut,
  Mail,
  ShieldAlert,
  User,
  Wallet,
} from 'lucide-react'

import { navigate, routes } from '@redwoodjs/router'

import { getUserInitials, loadAppState, signOut } from 'src/lib/appState'

const ProfilePage = () => {
  const [state] = useState(() => loadAppState())
  const user = state.user

  return (
    <div className="flex min-h-screen justify-center bg-[#050608]">
      <div className="bg-crosshatch flex min-h-screen w-full max-w-[420px] flex-col bg-[#0b0d14] pb-10">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-[#0b0d14]/95 px-4 py-3 backdrop-blur-md">
          <button
            type="button"
            onClick={() => navigate(routes.home())}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white transition hover:text-[#E8B94A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="text-[14px] font-bold tracking-wide text-white">
            Account Profile
          </span>
          <div className="rounded-md border border-[#3b2f4a] bg-[#1a1523] px-2 py-1 text-[9px] font-bold tracking-wider text-gray-400">
            LIORA-AE2C8
          </div>
        </header>

        <main className="space-y-4 px-4 pt-4">
          <section className="flex items-center justify-between rounded-2xl border border-[#1f2433] bg-[#111420] p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8B94A] to-[#C8961D] text-lg font-bold text-black shadow-inner">
                {getUserInitials(user?.username)}
              </div>
              <div>
                <p className="text-[15px] font-bold text-white">
                  {user?.username || 'member'}
                </p>
                <p className="text-[11px] text-[#8b95a5]">
                  @{user?.username || 'member'}
                </p>
              </div>
            </div>
            <div className="rounded-md border border-[#E8B94A]/30 bg-[#E8B94A]/10 px-2.5 py-1 text-[10px] font-bold text-[#E8B94A]">
              Not Activated
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-[#1f2433] bg-[#111420] p-5 shadow-lg">
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#10b981]/5" />
            <div className="relative z-10 mb-3 flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-[#E8B94A]" />
                <h3 className="text-[14px] font-bold text-white">
                  Complete Member Verification
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#E8B94A]">
                Starter Tier
              </span>
            </div>
            <p className="relative z-10 mb-4 text-[11px] leading-relaxed text-[#8b95a5]">
              Activate your Liora profile to unlock full daily task caps, AI Bot
              withdrawals, and priority NIBSS payouts.
            </p>
            <button
              type="button"
              className="relative z-10 flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] py-3.5 text-[13px] font-bold text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition hover:bg-[#059669]"
            >
              <Crown className="h-4 w-4" />
              Activate Account Now
            </button>
          </section>

          <div className="space-y-3">
            <div
              className="flex cursor-not-allowed items-center justify-between rounded-xl border border-[#1f2433] bg-[#111420] p-4 opacity-80"
              aria-disabled="true"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f2433] text-gray-400">
                  <Layers className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">
                    Dashboard Theme
                  </p>
                  <p className="text-[10px] text-[#8b95a5]">
                    Current:{' '}
                    <span className="text-gray-400">Midnight Carbon</span>
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#8b95a5]" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-[#1f2433] bg-[#111420] p-4 text-left transition hover:border-[#2f263a]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8B94A]/10 text-[#E8B94A]">
                  <BookOpen className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">
                    Open Liora Ledger
                  </p>
                  <p className="text-[10px] text-[#8b95a5]">
                    View credited wages, AI returns &amp; withdrawals
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#8b95a5]" />
            </button>
          </div>

          <section className="overflow-hidden rounded-xl border border-[#1f2433] bg-[#111420] shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1f2433] p-4">
              <div className="flex items-center gap-3">
                <User className="h-3.5 w-3.5 text-[#8b95a5]" />
                <span className="text-[12px] font-medium text-[#8b95a5]">
                  Legal Name
                </span>
              </div>
              <span className="text-[12px] font-bold text-white">
                {user?.fullName || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#1f2433] p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 text-[#8b95a5]" />
                <span className="text-[12px] font-medium text-[#8b95a5]">
                  Email
                </span>
              </div>
              <span className="text-[12px] font-bold text-white">
                {user?.email || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-3.5 w-3.5 text-[#8b95a5]" />
                <span className="text-[12px] font-medium text-[#8b95a5]">
                  Verification Tier
                </span>
              </div>
              <span className="text-[12px] font-bold text-[#E8B94A]">
                Starter (Unverified)
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#1f2433] bg-[#111420] p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f2433] text-[#E8B94A]">
                  <Wallet className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                    Settlement Bank <span className="text-gray-500">·</span>{' '}
                    <span className="text-[11px] text-[#E8B94A]">
                      Not Linked
                    </span>
                  </p>
                  <p className="text-[10px] text-[#8b95a5]">
                    Add bank account during withdrawal
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#8b95a5]" />
            </div>
            <div className="rounded-lg border border-[#1f2433] bg-[#0b0d14] p-3 text-center">
              <p className="text-[10px] text-[#8b95a5]">
                Verify your 10-digit bank account inside Withdraw Funds to link
                it here.
              </p>
            </div>
          </section>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a3040] bg-[#1f2433] py-3.5 text-[13px] font-bold text-white transition hover:bg-[#2a3040]"
            >
              <Globe className="h-4 w-4" />
              View Liora Overview
            </button>
            <button
              type="button"
              onClick={() => {
                signOut()
                navigate(routes.welcome())
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#7f1d1d] bg-[#3b1111] py-3.5 text-[13px] font-bold text-[#f87171] transition hover:bg-[#4c1515]"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfilePage
