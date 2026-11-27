import { useState } from 'react'

import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'

import Logo from 'src/components/Logo'
import PuzzleCube from 'src/components/PuzzleCube'

const NAV_LINKS = [
  { label: 'Channels', href: '#channels' },
  { label: 'AI Markets', href: '#markets' },
  { label: 'Simulator', href: '#calculator' },
  { label: 'Payout Rails', href: '#payouts' },
  { label: 'FAQ', href: '#faq' },
]

const BRANDS = [
  { name: 'MTN Nigeria', category: 'Telecom' },
  { name: 'Access Bank', category: 'Banking' },
  { name: 'OPay', category: 'Fintech' },
  { name: 'Indomie', category: 'FMCG' },
  { name: 'Zenith Bank', category: 'Banking' },
  { name: 'Kuda', category: 'Digital Bank' },
  { name: 'Peak Milk', category: 'Consumer' },
  { name: 'GTBank', category: 'Banking' },
  { name: 'Moniepoint', category: 'Payments' },
  { name: 'Oraimo', category: 'Hardware' },
  { name: 'PalmPay', category: 'Fintech' },
  { name: 'Golden Penny', category: 'Foods' },
]

const MARKETS = [
  {
    id: 'LB1000',
    name: 'Liora Boom 1000',
    tag: 'LB1000 · High-Frequency Spike',
    detailTitle: 'Liora Boom 1000 (LB1000)',
    detail:
      'Bullish spike capture engine · 3s candlestick feed with automated exit protection.',
  },
  {
    id: 'LC1000',
    name: 'Liora Crash 1000',
    tag: 'LC1000 · Short-Momentum Drop',
    detailTitle: 'Liora Crash 1000 (LC1000)',
    detail:
      'Short-momentum drop engine · fast downside capture with automated exit protection.',
  },
  {
    id: 'LV23',
    name: 'Liora Volatility 23',
    tag: 'LV23 · Balanced Swing Model',
    detailTitle: 'Liora Volatility 23 (LV23)',
    detail:
      'Balanced swing engine · measured volatility capture with automated exit protection.',
  },
]

const RATES = [
  { label: 'Recommend (~₦1,500)', rate: 1500 },
  { label: 'AI-Robot (~₦2,800)', rate: 2800 },
  { label: 'Ads Status (~₦1,200)', rate: 1200 },
]

const SESSIONS = [3, 6, 10, 15, 24]

const BANKS = [
  'Access Bank',
  'Zenith Bank',
  'GTBank',
  'First Bank',
  'UBA',
  'OPay Digital',
  'PalmPay',
  'Kuda Bank',
  'Moniepoint MFB',
  'Fidelity Bank',
  'Union Bank',
  'Stanbic IBTC',
  'Sterling Bank',
  'Wema Bank',
  'Polaris Bank',
  'FCMB',
  'Ecobank Nigeria',
  'Keystone Bank',
  'Unity Bank',
  'Providus Bank',
  'Titan Trust Bank',
  'Jaiz Bank',
  'Lotus Bank',
  'TAJBank',
  'Globus Bank',
  'Parallex Bank',
]

const FAQS = [
  {
    q: 'How does Recommend Products pay members?',
    a: 'Brands list head-to-head product comparisons on Liora (for example, toothpaste or smartphone matchups). You evaluate both options against the criteria, submit your pick, and receive the stated payout directly in your Liora wallet.',
  },
  {
    q: 'How does AI-Robot Trading work on Liora?',
    a: 'The AI-Robot deploys automated synthetic trades on LB1000, LC1000, and LV23 with auto-managed lot sizing and 30s–180s exits. Every trade is tracked in real time from your dashboard.',
  },
  {
    q: 'What is the Ads Status showcase?',
    a: 'It is a feed of partner brand visual status updates. Watch each drop and claim cumulative rewards directly into your Liora account.',
  },
  {
    q: 'How fast do withdrawals reach Nigerian bank accounts?',
    a: 'Withdrawals settle over direct NIBSS rails and typically reach Nigerian bank accounts within minutes of approval.',
  },
]

const WelcomePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeMarket, setActiveMarket] = useState(0)
  const [sessions, setSessions] = useState(6)
  const [rateIndex, setRateIndex] = useState(0)

  const daily = sessions * RATES[rateIndex].rate
  const weekly = daily * 7
  const monthly = daily * 30
  const market = MARKETS[activeMarket]

  return (
    <div className="bg-crosshatch min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/80 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Logo />
          <div className="hidden items-center gap-8 text-sm font-medium text-muted lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <Link
              to={routes.auth()}
              className="text-sm font-medium text-white/80 transition-colors hover:text-gold-light"
            >
              Log in
            </Link>
            <Link
              to={routes.auth()}
              className="rounded-full border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] px-5 py-2 text-sm font-bold text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)] transition-all hover:brightness-110 active:scale-95"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 text-center sm:px-6 sm:pb-20 sm:pt-14">
        <div className="mb-5 flex justify-center sm:mb-9">
          <PuzzleCube />
        </div>
        <a
          href="#markets"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 shadow-lg transition-colors hover:bg-white/10"
        >
          <Sparkles className="h-4 w-4 text-gold" />
          What&apos;s new at Liora Network
          <ChevronRight className="h-4 w-4" />
        </a>
        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-[40px] font-bold leading-[1.05] tracking-tight sm:mt-8 sm:text-5xl md:text-7xl">
          <span className="bg-gradient-to-b from-[#F8E5B5] to-[#D4A73E] bg-clip-text text-transparent">
            Rewards for
          </span>{' '}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-b from-[#E5C06A] to-[#C28E1C] bg-clip-text text-transparent">
            modern earners
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:mt-6 md:text-lg">
          The best way to earn from everyday brands instead of idle scrolling.
          Recommend products, automate AI trades, and claim Ads Status payouts
          at scale.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            to={routes.auth()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] px-12 py-4 text-[17px] font-bold text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_6px_12px_rgba(0,0,0,0.4)] transition-all hover:brightness-105 active:scale-[0.98] sm:w-auto"
          >
            Register
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to={routes.auth()}
            className="inline-flex w-full items-center justify-center rounded-xl border border-[#2C2A33] bg-[#121116] px-12 py-4 text-[17px] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.3)] transition-all hover:bg-[#1a1820] active:scale-[0.98] sm:w-auto"
          >
            Member Login
          </Link>
        </div>
      </section>

      <section id="channels" className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mx-auto max-w-2xl text-center text-sm text-muted md:text-base">
          Leading Nigerian consumer brands and payout rails power Liora member
          rewards daily.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <p className="text-sm font-semibold text-white/90">
                {brand.name}
              </p>
              <p className="mt-1 text-xs text-muted">{brand.category}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            Built for focus, speed, and payout reliability
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Three purpose-built revenue streams unified inside one dark obsidian
            workspace.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-ink-card p-5 sm:p-8">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-semibold">
              Recommend Products
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Compare two everyday products head-to-head against verified buyer
              criteria and collect instant wages.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-ink-panel p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/80">
                  Daily Cavity Matchup
                </span>
                <span className="text-sm font-bold text-success">+₦1,500</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-center text-sm font-semibold text-white/80">
                  Colgate
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-center text-sm font-semibold text-white/80">
                  CloseUp
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-card p-5 sm:p-8">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-semibold">
              AI-Robot Trading
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Deploy automated synthetic trades on LB1000, LC1000, and LV23 with
              auto-managed lot sizing and 30s–180s exits.
            </p>
            <div className="mt-6 space-y-2">
              {[
                { name: 'LB1000', value: '+62% settled' },
                { name: 'LC1000', value: '+114% settled' },
                { name: 'LV23', value: '+48% settled' },
              ].map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-panel px-4 py-3"
                >
                  <span className="text-sm font-semibold text-white/80">
                    {row.name}
                  </span>
                  <span className="text-sm font-bold text-success">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-card p-5 sm:p-8">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-2xl font-semibold">
              Ads Status Showcase
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Watch partner brand visual status updates and claim cumulative
              rewards directly into your account.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-ink-panel p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white/80">
                  Vantage Pay Drop
                </span>
                <span className="text-xs font-bold text-gold">
                  Full Reward: ₦2,400
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
                  Top Partner Brand
                </span>
                <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
                  Instant Claim Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="markets"
        className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            3 Synthetic Indices
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
            Precision AI-Robot Markets
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Select a Liora synthetic market below to review its execution model
            before entering the live desk.
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:mt-10 md:grid-cols-3">
          {MARKETS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveMarket(index)}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                activeMarket === index
                  ? 'border-gold/50 bg-gold/10'
                  : 'border-white/10 bg-ink-card hover:border-white/20'
              }`}
            >
              <span className="flex items-center justify-between text-sm font-semibold text-white">
                {item.name}
                <Zap
                  className={`h-4 w-4 ${
                    activeMarket === index ? 'text-gold' : 'text-muted'
                  }`}
                />
              </span>
              <span className="mt-1 block text-xs text-muted">{item.tag}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-3xl border border-white/10 bg-ink-card p-4 sm:mt-6 sm:p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold">
                {market.detailTitle}
              </h3>
              <p className="mt-2 text-sm text-muted">{market.detail}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] px-6 py-3 text-sm font-bold text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Trade {market.id}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section
        id="calculator"
        className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6"
      >
        <div className="rounded-3xl border border-white/10 bg-ink-card p-5 sm:p-8 md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Earnings Projection
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
              Calculate your daily workflow
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              Estimate how your daily activity compounds across Product
              Recommendations, AI-Robot Trading cycles, and Ads Status drops.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {RATES.map((option, index) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setRateIndex(index)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  rateIndex === index
                    ? 'border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)]'
                    : 'border-white/10 bg-white/[0.02] text-white/80 hover:border-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Select Daily Completed Sessions:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SESSIONS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSessions(count)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    sessions === count
                      ? 'border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)]'
                      : 'border-white/10 bg-ink-panel text-white/80 hover:border-white/20'
                  }`}
                >
                  {count} tasks/day
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-ink-panel p-4 text-center sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Estimated Daily Total
              </p>
              <p className="mt-3 text-3xl font-bold text-success">
                ₦{daily.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-panel p-4 text-center sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                7-Day Projection
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                ₦{weekly.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-panel p-4 text-center sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                30-Day Projection
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                ₦{monthly.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to={routes.auth()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] px-8 py-3.5 text-sm font-bold text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Launch Recommend Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="payouts"
        className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            Direct NIBSS Settlement Rails
          </h2>
          <p className="mt-3 text-sm text-muted md:text-base">
            Seamless payouts across 25+ Nigerian banks
          </p>
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-ink-card py-6">
          <div className="marquee-track flex w-max">
            <div className="flex gap-3 pr-3">
              {BANKS.map((bank) => (
                <span
                  key={bank}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white/70"
                >
                  <Lock className="h-4 w-4 text-gold" />
                  {bank}
                </span>
              ))}
            </div>
            <div className="flex gap-3 pr-3" aria-hidden="true">
              {BANKS.map((bank) => (
                <span
                  key={`dup-${bank}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white/70"
                >
                  <Lock className="h-4 w-4 text-gold" />
                  {bank}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-4 sm:mt-24 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-ink-card p-5 sm:p-8 md:p-12">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold md:text-4xl">
              CAC Registered &amp; Accountable Operations
            </h2>
          </div>
          <p className="mt-4 text-lg font-semibold text-white">
            Built for Nigerian members. Structured for trust.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
            LIORA Network operates with verifiable payouts, transparent task
            logs, real-time AI trade tracking, and instant bank account
            verification.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              'Verified Bank Resolution',
              '50% AI Risk Safeguards',
              'Instant Wallet Settlement',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white/80"
              >
                <Check className="h-4 w-4 shrink-0 text-success" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to={routes.auth()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] px-8 py-3.5 text-sm font-bold text-black shadow-[inset_0_2px_2px_rgba(255,255,255,0.7),inset_0_-2px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Register
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={routes.auth()}
              className="inline-flex items-center justify-center rounded-xl border border-[#2C2A33] bg-[#121116] px-8 py-3.5 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_6px_rgba(0,0,0,0.3)] transition-all hover:bg-[#1a1820] active:scale-[0.98]"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto mt-16 max-w-3xl px-4 sm:mt-24 sm:px-6"
      >
        <h2 className="text-center font-serif text-3xl font-bold md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/10 bg-ink-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="text-sm font-semibold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-gold" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-gold" />
                  )}
                </button>
                {isOpen && (
                  <p className="px-4 pb-4 text-sm leading-relaxed text-muted sm:px-6 sm:pb-5">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <footer className="mt-16 border-t border-white/5 sm:mt-24">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <Logo />
              <p className="mt-2 text-sm font-semibold text-white/90">
                Liora Network
              </p>
              <p className="mt-1 text-sm text-muted">
                Product Recommendations, AI-Robot Trading &amp; Ads Status
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <button
                type="button"
                className="transition-colors hover:text-white"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                className="transition-colors hover:text-white"
              >
                Terms &amp; Conditions
              </button>
            </div>
          </div>
          <p className="mt-8 text-xs text-muted">
            © 2026 Liora Network. All rights reserved. CAC Registered
            Operations.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default WelcomePage
