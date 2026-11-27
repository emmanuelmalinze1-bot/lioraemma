import { useCallback, useEffect, useRef, useState } from 'react'

import {
  Activity,
  ArrowRight,
  Bot,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Download,
  History,
  Home,
  List,
  Lock,
  Megaphone,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react'

import { Link } from '@redwoodjs/router'

import ActivateAccountModal from 'src/components/ActivateAccountModal/ActivateAccountModal'
import {
  formatDividendDate,
  getDividendStatus,
  getNextDividendDate,
  getUserInitials,
  loadAppState,
  saveAppState,
  WEEKLY_DIVIDEND_AMOUNT,
} from 'src/lib/appState'

const goldButton =
  'border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all hover:brightness-105 active:scale-[0.98]'

type Market = {
  id: string
  name: string
  code: string
  desc: string
  basePrice: number
}

const MARKETS: Market[] = [
  {
    id: 'lb1000',
    name: 'Liora Boom 1000',
    code: 'LB1000',
    desc: 'Synthetic Boom Index',
    basePrice: 3811.83,
  },
  {
    id: 'lc1000',
    name: 'Liora Crash 1000',
    code: 'LC1000',
    desc: 'Synthetic Crash Index',
    basePrice: 1204.2,
  },
  {
    id: 'lv23',
    name: 'Liora Volatility 23',
    code: 'LV23',
    desc: 'Synthetic Volatility Index',
    basePrice: 850.75,
  },
]

type Candle = {
  open: number
  close: number
  high: number
  low: number
}

const makeCandles = (base: number, count = 28): Candle[] => {
  let price = base
  return Array.from({ length: count }).map(() => {
    const open = price
    const close = open + (Math.random() - 0.48) * (base * 0.008)
    const high = Math.max(open, close) + Math.random() * (base * 0.003)
    const low = Math.min(open, close) - Math.random() * (base * 0.003)
    price = close
    return { open, close, high, low }
  })
}

const LiveChart = ({
  market,
  onPrice,
}: {
  market: Market
  onPrice: (p: { price: number; change: number; pct: number }) => void
}) => {
  const [candles, setCandles] = useState<Candle[]>(() =>
    makeCandles(market.basePrice, 34)
  )
  const [visibleCount, setVisibleCount] = useState(28)
  const chartRef = useRef<HTMLDivElement | null>(null)
  const refPrice = market.basePrice

  useEffect(() => {
    setCandles(makeCandles(market.basePrice, 34))
    setVisibleCount(28)
  }, [market.basePrice])

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1]
        const open = last.close
        const volatility = market.basePrice * 0.006
        const isBoom = market.id === 'lb1000'
        const isCrash = market.id === 'lc1000'
        let change = 0
        if (isBoom) {
          const spike = Math.random() < 0.22
          change = spike
            ? volatility * (2.5 + Math.random() * 5)
            : -volatility * (0.15 + Math.random() * 0.55)
        } else if (isCrash) {
          const spike = Math.random() < 0.22
          change = spike
            ? -volatility * (2.5 + Math.random() * 5)
            : volatility * (0.15 + Math.random() * 0.55)
        } else {
          change = (Math.random() - 0.5) * volatility * 1.8
        }
        const close = Math.max(market.basePrice * 0.75, open + change)
        const wick = volatility * (0.15 + Math.random() * 0.35)
        const high = Math.max(open, close) + wick
        const low = Math.min(open, close) - wick * 0.6
        return [...prev, { open, close, high, low }].slice(-60)
      })
    }, 900)
    return () => clearInterval(interval)
  }, [market.basePrice, market.id, refPrice])

  const visible = candles.slice(-visibleCount)
  const highs = visible.map((c) => c.high)
  const lows = visible.map((c) => c.low)
  const rawMax = Math.max(...highs, refPrice)
  const rawMin = Math.min(...lows, refPrice)
  const pad = (rawMax - rawMin || 1) * 0.08
  const maxPrice = rawMax + pad
  const minPrice = rawMin - pad
  const range = maxPrice - minPrice || 1
  const last = visible[visible.length - 1]
  const currentPrice = last.close
  const change = currentPrice - refPrice
  const pct = (change / refPrice) * 100
  const up = change >= 0
  const y = (p: number) => ((maxPrice - p) / range) * 100

  useEffect(() => {
    onPrice({ price: currentPrice, change, pct })
  }, [currentPrice, change, pct, onPrice])

  useEffect(() => {
    const el = chartRef.current
    if (!el) return undefined
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setVisibleCount((c) =>
        Math.min(50, Math.max(14, c + (e.deltaY > 0 ? 2 : -2)))
      )
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const yLabels = [
    maxPrice,
    minPrice + range * 0.75,
    minPrice + range * 0.5,
    minPrice + range * 0.25,
    minPrice,
  ]

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-[#1f2433] bg-[#0a0d14]">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none whitespace-nowrap text-[34px] font-black uppercase tracking-[0.06em] text-white/[0.035]">
          {market.name}
        </span>
      </div>
      <div className="absolute bottom-8 right-1 top-2 z-20 flex w-12 flex-col justify-between text-right text-[9px] text-[#7f8899]">
        {yLabels.map((p, i) => (
          <span key={i}>{p.toFixed(2)}</span>
        ))}
      </div>
      <div
        ref={chartRef}
        className="absolute bottom-8 left-2 right-14 top-2 cursor-crosshair touch-none"
      >
        {visible.map((c, i) => {
          const slot = 100 / visible.length
          const left = i * slot + slot * 0.18
          const width = slot * 0.64
          const candleUp = c.close >= c.open
          const color = candleUp ? '#10b981' : '#ef4444'
          const bodyTop = y(Math.max(c.open, c.close))
          const bodyBottom = y(Math.min(c.open, c.close))
          const bodyH = Math.max(bodyBottom - bodyTop, 0.25)
          return (
            <div
              key={i}
              className="absolute top-0 h-full"
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              <div
                className="absolute left-1/2 w-px -translate-x-1/2"
                style={{
                  top: `${y(c.high)}%`,
                  height: `${Math.max(y(c.low) - y(c.high), 0.2)}%`,
                  backgroundColor: color,
                }}
              />
              <div
                className="absolute w-full rounded-[1px]"
                style={{
                  top: `${bodyTop}%`,
                  height: `${bodyH}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          )
        })}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-[#E8B94A]/35"
          style={{ top: `${y(refPrice)}%` }}
        >
          <span className="absolute -top-2 right-0 rounded bg-[#1f2433] px-1 py-px text-[8px] text-[#E8B94A]">
            Ref {refPrice.toFixed(2)}
          </span>
        </div>
        <div
          className="absolute left-0 right-0 z-10 border-t border-dashed"
          style={{
            top: `${y(currentPrice)}%`,
            borderColor: up ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)',
          }}
        >
          <span
            className={`absolute -top-2.5 right-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${up ? 'bg-[#10b981]' : 'bg-red-500'}`}
          >
            {currentPrice.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="absolute bottom-1.5 left-3 right-14 flex justify-between text-[9px] text-[#7f8899]">
        <span>19:22:54</span>
        <span>19:25:33</span>
      </div>
      <div className="absolute bottom-8 left-2 z-20 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setVisibleCount((c) => Math.max(14, c - 3))}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#2a3040] bg-[#111420]/90 text-[14px] font-bold text-white hover:border-[#E8B94A]/50"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setVisibleCount((c) => Math.min(50, c + 3))}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#2a3040] bg-[#111420]/90 text-[14px] font-bold text-white hover:border-[#E8B94A]/50"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  )
}

const PointingHand = () => (
  <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient
        id="handGoldAi"
        x1="4"
        y1="2"
        x2="20"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFE7A8" />
        <stop offset="0.55" stopColor="#F6C96A" />
        <stop offset="1" stopColor="#D99A32" />
      </linearGradient>
    </defs>
    <path
      d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"
      fill="url(#handGoldAi)"
      stroke="#B97A1E"
      strokeWidth="0.6"
      strokeLinejoin="round"
    />
  </svg>
)

const AiRobotPage = () => {
  const [appState, setAppState] = useState(() => loadAppState())
  const { claimable: dividendClaimable, maturesAt: dividendMaturesAt } =
    getDividendStatus(appState.dividendClaimedAt)
  const nextDividendDate = formatDividendDate(
    dividendMaturesAt ?? getNextDividendDate()
  )

  const handleDividendClaim = () => {
    if (!dividendClaimable) return
    const next = {
      ...appState,
      balance: appState.balance + WEEKLY_DIVIDEND_AMOUNT,
      dividendClaimedAt: Date.now(),
    }
    saveAppState(next)
    setAppState(next)
  }
  const [activeTab, setActiveTab] = useState<
    'markets' | 'positions' | 'history'
  >('markets')
  const [view, setView] = useState<'dashboard' | 'chart'>('dashboard')
  const [selectedMarket, setSelectedMarket] = useState<Market>(MARKETS[0])
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)
  const [tradeAmount, setTradeAmount] = useState('')
  const [handIndex, setHandIndex] = useState(0)
  const [handPos, setHandPos] = useState<{ top: number; left: number } | null>(
    null
  )
  const [livePrice, setLivePrice] = useState({ price: 0, change: 0, pct: 0 })
  const marketListRef = useRef<HTMLDivElement | null>(null)
  const tradeRefs = useRef<Array<HTMLButtonElement | null>>([])

  const balance = appState.balance
  const limit = 30000

  useEffect(() => {
    if (activeTab !== 'markets' || view !== 'dashboard') return undefined
    setHandIndex(0)
    const id = setInterval(() => {
      setHandIndex((prev) => (prev + 1) % MARKETS.length)
    }, 1600)
    return () => clearInterval(id)
  }, [activeTab, view])

  useEffect(() => {
    if (activeTab !== 'markets' || view !== 'dashboard') return undefined
    const update = () => {
      const button = tradeRefs.current[handIndex]
      const list = marketListRef.current
      if (!button || !list) return
      const buttonRect = button.getBoundingClientRect()
      const listRect = list.getBoundingClientRect()
      setHandPos({
        top: buttonRect.top - listRect.top + buttonRect.height / 2,
        left: buttonRect.left - listRect.left - 16,
      })
    }
    update()
    const raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [handIndex, activeTab, view])

  const openChart = useCallback((market: Market) => {
    setSelectedMarket(market)
    setLivePrice({ price: market.basePrice, change: 0, pct: 0 })
    setView('chart')
  }, [])

  return (
    <div className="flex min-h-screen justify-center bg-[#070a10]">
      <div className="mat-roll-edge" aria-hidden />
      <div className="bg-crosshatch relative flex min-h-screen w-full max-w-[480px] flex-col overflow-x-hidden pb-28">
        {view === 'dashboard' ? (
          <>
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#1c2230] bg-[#0b0d14]/95 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-1">
                <Link
                  to="/home"
                  aria-label="Back to home"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/5 hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <span className="font-serif text-[17px] font-bold tracking-widest text-white">
                  LIORA
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#1a1d27] px-3 py-1.5 text-[11px] font-medium text-white"
                >
                  <Download className="h-3.5 w-3.5" /> Install App
                </button>
                <Link
                  to="/profile"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#f0c14b]/50 bg-gradient-to-br from-[#f0c14b] to-[#b8860b] text-[10px] font-bold text-black"
                >
                  {getUserInitials(appState.user?.username)}
                </Link>
              </div>
            </header>

            <main className="mat-unroll flex-1 space-y-4 px-4 pt-4">
              <div
                className="flex items-center justify-between rounded-xl border border-[#232634] bg-[#161922] p-3"
                style={{ borderColor: '#232634', backgroundColor: '#161922' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#232634] text-white">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold leading-tight text-white">
                      {dividendClaimable
                        ? 'Take Weekly Dividends'
                        : 'Your Next Weekly Dividends will be Available'}
                    </div>
                    <div className="mt-0.5 text-[10px] text-[#838b9e]">
                      {dividendClaimable
                        ? `Weekly partner distribution · ₦${WEEKLY_DIVIDEND_AMOUNT.toLocaleString()}`
                        : `Matures ${nextDividendDate}`}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDividendClaim}
                  className={
                    dividendClaimable
                      ? 'ml-2 shrink-0 rounded-lg border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] px-3 py-1.5 text-[10px] font-bold text-black transition hover:brightness-110 active:scale-95'
                      : 'ml-2 shrink-0 rounded-lg border border-white/5 bg-[#232634] px-2.5 py-1.5 text-[10px] font-semibold text-gray-400'
                  }
                >
                  {dividendClaimable
                    ? `Claim ₦${WEEKLY_DIVIDEND_AMOUNT.toLocaleString()}`
                    : nextDividendDate}
                </button>
              </div>

              <section
                className="rounded-2xl border border-[#1f2433] bg-[#111420] p-5 shadow-lg"
                style={{ borderColor: '#1f2433', backgroundColor: '#111420' }}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8B94A]/10 text-[#E8B94A]">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h2 className="text-[16px] font-bold tracking-tight text-white">
                      AI-Robot Trading
                    </h2>
                  </div>
                  <span className="rounded-md border border-[#2a3040] bg-[#1f2433] px-2.5 py-1 text-[10px] font-bold text-gray-300">
                    Today: 0/3
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#232634] bg-[#161922] p-3">
                    <div className="mb-1 text-[10px] text-[#8b95a5]">
                      Total Traded Capital
                    </div>
                    <div className="text-[15px] font-bold text-white">₦0</div>
                  </div>
                  <div className="rounded-xl border border-[#232634] bg-[#161922] p-3">
                    <div className="mb-1 text-[10px] text-[#8b95a5]">
                      Total Trade Returns
                    </div>
                    <div className="text-[15px] font-bold text-[#10b981]">
                      ₦0
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex rounded-xl border border-[#1f2433] bg-[#111420] p-1.5 shadow-inner">
                {(
                  [
                    { id: 'markets', label: 'Markets', Icon: TrendingUp },
                    { id: 'positions', label: 'Positions', Icon: List },
                    { id: 'history', label: 'History', Icon: History },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-bold transition-all ${
                      activeTab === id
                        ? 'bg-gradient-to-b from-[#FDE18B] to-[#C8961D] text-black shadow-md'
                        : 'text-[#8b95a5] hover:text-white'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              <section
                className="min-h-[260px] rounded-2xl border border-[#1f2433] bg-[#111420] p-4 shadow-lg"
                style={{ borderColor: '#1f2433', backgroundColor: '#111420' }}
              >
                {activeTab === 'markets' && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-[13px] font-bold text-white">
                        Trading Markets
                      </h3>
                      <span className="text-[10px] text-[#8b95a5]">
                        3 Synthetic Indices
                      </span>
                    </div>
                    <div ref={marketListRef} className="relative">
                      {handPos && (
                        <div
                          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-[top,left] duration-500 ease-out"
                          style={{ top: handPos.top, left: handPos.left }}
                        >
                          <div className="hand-tap h-8 w-8">
                            <PointingHand />
                          </div>
                        </div>
                      )}
                      <div className="space-y-3">
                        {MARKETS.map((market, idx) => {
                          const activeHand = idx === handIndex
                          return (
                            <div
                              key={market.id}
                              className={`relative z-10 flex items-center justify-between rounded-xl border p-3.5 transition-all duration-300 ${
                                activeHand
                                  ? 'border-[#E8B94A] bg-[#0b0d14] shadow-[0_0_12px_rgba(232,185,74,0.18)]'
                                  : 'border-[#1f2433] bg-[#0b0d14]'
                              }`}
                            >
                              <div>
                                <div className="mb-0.5 text-[13px] font-bold text-white">
                                  {market.name}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="font-medium text-[#E8B94A]">
                                    {market.code}
                                  </span>
                                  <span className="text-gray-500">·</span>
                                  <span className="text-[#8b95a5]">
                                    {market.desc}
                                  </span>
                                </div>
                              </div>
                              <button
                                ref={(el) => {
                                  tradeRefs.current[idx] = el
                                }}
                                type="button"
                                onClick={() => openChart(market)}
                                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-bold ${goldButton}`}
                              >
                                Trade With AI{' '}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'positions' && (
                  <div className="flex flex-col items-center justify-center pt-10 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f2433] text-[#E8B94A]">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <h3 className="mb-1 text-[13px] font-bold text-white">
                      No Active or Unclaimed Positions
                    </h3>
                    <p className="max-w-[240px] text-[10px] leading-relaxed text-[#8b95a5]">
                      Select any market in the Markets tab to launch an AI-Robot
                      trade.
                    </p>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-[13px] font-bold text-white">
                        Settled AI Trades
                      </h3>
                      <span className="text-[10px] text-[#8b95a5]">
                        0 claimed
                      </span>
                    </div>
                    <div className="flex h-[140px] items-center justify-center rounded-xl border border-[#1f2433] bg-[#0b0d14]">
                      <p className="text-[11px] text-[#8b95a5]">
                        No settled AI bot trades yet.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </main>
          </>
        ) : (
          <>
            <header className="sticky top-0 z-40 border-b border-[#1f2433] bg-[#0b0d14]/95 backdrop-blur-md">
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  type="button"
                  onClick={() => setView('dashboard')}
                  className="p-1 text-white hover:text-[#E8B94A]"
                  aria-label="Back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-center">
                  <div className="text-[14px] font-bold text-white">
                    {selectedMarket.name} ({selectedMarket.code})
                  </div>
                  <div className="text-[10px] text-[#8b95a5]">
                    {selectedMarket.desc} · 3s
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-[15px] font-bold ${livePrice.change >= 0 ? 'text-[#10b981]' : 'text-red-500'}`}
                  >
                    {livePrice.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-[10px] font-medium ${livePrice.change >= 0 ? 'text-[#10b981]' : 'text-red-500'}`}
                  >
                    {livePrice.change >= 0 ? '+' : ''}
                    {livePrice.change.toFixed(2)} ({livePrice.pct.toFixed(2)}%)
                  </div>
                </div>
              </div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
                {['3s', '10s', '30s', '1m', '5m', '15m', '1h'].map((tf, i) => (
                  <button
                    key={tf}
                    type="button"
                    className={`shrink-0 rounded-md px-3 py-1 text-[10px] font-bold ${
                      i === 0
                        ? 'bg-[#E8B94A] text-black'
                        : 'bg-[#1f2433] text-[#8b95a5] hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </header>

            <main className="mat-unroll flex-1 px-4 pt-4">
              <LiveChart market={selectedMarket} onPrice={setLivePrice} />
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowTradeModal(true)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[14px] font-bold ${goldButton}`}
                >
                  <Bot className="h-5 w-5" /> Start Trade With AI BOT
                </button>
              </div>
            </main>
          </>
        )}

        <nav className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[448px] -translate-x-1/2 rounded-full border border-[#2d2238] bg-[#120f19]/95 px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.75)] backdrop-blur-lg">
          <div className="relative flex items-center justify-between">
            <Link
              to="/ai-robot"
              className="flex w-24 flex-col items-center gap-1 text-[#E8B94A]"
            >
              <Bot className="h-[22px] w-[22px]" />
              <span className="whitespace-nowrap text-[10px] font-medium">
                AI-Robot Trading
              </span>
            </Link>
            <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 flex-col items-center">
              <Link
                to="/home"
                aria-label="Home"
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-[#0b0d14] bg-[#1f2433] text-gray-400"
              >
                <Home className="h-6 w-6" />
              </Link>
              <span className="mt-1 text-[10px] font-bold text-gray-500">
                Home
              </span>
            </div>
            <Link
              to="/ads-status"
              className="flex w-24 flex-col items-center gap-1 text-[#8b95a5] transition hover:text-white"
            >
              <Megaphone className="h-[22px] w-[22px]" />
              <span className="whitespace-nowrap text-[10px] font-medium">
                Ads Status
              </span>
            </Link>
          </div>
        </nav>

        {showTradeModal && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Close trade modal"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setShowTradeModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')
                setShowTradeModal(false)
            }}
          >
            <div
              role="presentation"
              className="toast-in relative w-full max-w-[360px] rounded-[20px] border border-[#2f263a] bg-[#16121c] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowTradeModal(false)}
                className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#5c452b] bg-[#2a211a] text-[#E8B94A]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-white">
                  {selectedMarket.name}
                </span>
              </div>

              <h3 className="mb-1 text-[13px] font-bold uppercase text-white">
                How much do you want the AI bot to trade for you with?
              </h3>
              <p className="mb-4 text-[11px] text-[#8b95a5]">
                Available Balance:{' '}
                <span className="font-bold text-[#10b981]">
                  ₦{balance.toLocaleString()}
                </span>
              </p>

              <div className="relative mb-4">
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="Enter amount (₦)"
                  className="w-full rounded-xl border border-[#3b2f4a] bg-[#0b0d14] py-3.5 pl-4 pr-10 text-[13px] text-white placeholder-gray-500 outline-none transition-colors focus:border-[#E8B94A]"
                />
                <div className="absolute inset-y-0 right-3 flex flex-col justify-center text-gray-500">
                  <ChevronUp className="h-3 w-3" />
                  <ChevronDown className="-mt-0.5 h-3 w-3" />
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex items-start gap-2 text-[10px] text-[#8b95a5]">
                  <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E8B94A]" />
                  <p>
                    Auto-selects the most efficient lotsize for every entry.
                  </p>
                </div>
                <div className="flex items-start gap-2 text-[10px] text-[#8b95a5]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10b981]" />
                  <p>
                    Exits at optimal timing with profit, break-even, or loss
                    mitigation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowTradeModal(false)
                  setShowLimitModal(true)
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-bold ${goldButton}`}
              >
                <Lock className="h-4 w-4" /> Enter Trade Now
              </button>
            </div>
          </div>
        )}

        <ActivateAccountModal
          open={showActivateModal}
          onClose={() => setShowActivateModal(false)}
        />

        {showLimitModal && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Close activation modal"
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
            onClick={() => setShowLimitModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')
                setShowLimitModal(false)
            }}
          >
            <div
              role="presentation"
              className="toast-in relative w-full max-w-[360px] rounded-[24px] border border-[#2f263a] bg-[#16121c] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5c452b] bg-[#2a211a] text-[#E8B94A]">
                  <Lock className="h-7 w-7" />
                </div>
              </div>

              <div className="mb-3 inline-block rounded-full border border-[#5c452b] bg-[#2a211a] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#E8B94A]">
                Activation Required
              </div>

              <h3 className="mb-3 text-[16px] font-bold text-white">
                Maximum Earnings Limit Reached
              </h3>

              <p className="mb-5 text-[11px] leading-relaxed text-[#8b95a5]">
                You have reached your maximum earnings limit of{' '}
                <span className="font-bold text-[#E8B94A]">
                  ₦{limit.toLocaleString()}
                </span>{' '}
                before account activation. You cannot claim additional earnings
                from Recommend Products, AI-Robot Trading, or Ads Status until
                you activate your account.
              </p>

              <div className="mb-6 rounded-xl border border-[#1f2433] bg-[#0b0d14] p-4 text-left">
                <div className="mb-3 flex items-start gap-2.5">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B94A]" />
                  <p className="text-[10px] leading-relaxed text-[#8b95a5]">
                    Activate your account now to lift all earning caps, unlock
                    instant withdrawals, and resume claiming daily wages on
                    Recommend Products, AI-Robot Trading &amp; Ads Status.
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[#1f2433] pt-3">
                  <span className="text-[10px] text-[#8b95a5]">
                    Current Balance:
                  </span>
                  <span className="text-[11px] font-bold text-[#10b981]">
                    ₦{balance.toLocaleString()}{' '}
                    <span className="font-normal text-gray-500">
                      / ₦{limit.toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowLimitModal(false)
                  setShowActivateModal(true)
                }}
                className={`mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-bold ${goldButton}`}
              >
                <Lock className="h-4 w-4" /> Activate Account to Continue
                Earning <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="w-full rounded-xl border border-[#2a3040] bg-[#1f2433] py-3.5 text-[13px] font-bold text-white transition hover:bg-[#2a3040]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiRobotPage
