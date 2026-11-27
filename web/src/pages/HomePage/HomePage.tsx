import { useCallback, useEffect, useRef, useState } from 'react'

import {
  ArrowRight,
  Bot,
  Calendar,
  ChevronLeft,
  CircleCheck,
  Crown,
  Download,
  Gift,
  Home,
  Megaphone,
  Send,
  ShieldCheck,
  Users,
  Wallet,
  Waypoints,
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

const COMMUNITY_URL = 'https://t.me/+mrMvIAaR7pg5YzQ8'
const CLAIM_SOUND = '/universfield-new-notification-064-494547.mp3'

const goldButton =
  'border border-[#c08e28] bg-gradient-to-b from-[#fce181] to-[#d4a03a] text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all hover:brightness-105 active:scale-[0.98]'

type TaskProduct = {
  id: string
  label: string
  bg: string
  inner: string
  sub: string
}

type Task = {
  id: string
  name: string
  amount: string
  reward: number
  brief: string
  products: [TaskProduct, TaskProduct]
}

const TASKS: Task[] = [
  {
    id: 'colgate',
    name: 'Colgate X CloseUp',
    amount: '₦2,500',
    reward: 2500,
    brief:
      'Which of these brands products will you recommend for All-day Fresh Breath & Plaque Protection?',
    products: [
      {
        id: 'Colgate',
        label: 'Colgate',
        bg: 'from-[#e60000] to-[#990000]',
        inner: 'bg-white text-red-700',
        sub: 'Triple Action',
      },
      {
        id: 'CloseUp',
        label: 'CloseUp',
        bg: 'from-[#99001a] to-[#4d000d]',
        inner: 'bg-[#1a0005] text-white',
        sub: 'Deep Action',
      },
    ],
  },
  {
    id: 'peak',
    name: 'Peak Milk X Three Crowns',
    amount: '₦2,500',
    reward: 2500,
    brief:
      'Which of these brands products will you recommend for Best Rich Creamy Morning Breakfast?',
    products: [
      {
        id: 'Peak Milk',
        label: 'Peak Milk',
        bg: 'from-[#003399] to-[#001f66]',
        inner: 'bg-white text-[#003399]',
        sub: 'Instant Whole Milk',
      },
      {
        id: 'Three Crowns',
        label: 'Three Crowns',
        bg: 'from-[#c8102e] to-[#8b0000]',
        inner: 'bg-white text-[#c8102e]',
        sub: 'Filled Evaporated Milk',
      },
    ],
  },
  {
    id: 'indomie',
    name: 'Indomie X Golden Penny',
    amount: '₦2,500',
    reward: 2500,
    brief:
      'Which of these brands products will you recommend for Fast Evening Meal Flavor & Texture?',
    products: [
      {
        id: 'Indomie',
        label: 'Indomie',
        bg: 'from-[#d62828] to-[#a4161a]',
        inner: 'bg-[#ffd60a] text-[#d62828]',
        sub: 'Instant Noodles',
      },
      {
        id: 'Golden Penny',
        label: 'Golden Penny',
        bg: 'from-[#1a5fb4] to-[#0d3b66]',
        inner: 'bg-[#f4c430] text-[#1a3a5c]',
        sub: 'Semovita & Pasta',
      },
    ],
  },
  {
    id: 'tecno',
    name: 'Tecno X Infinix',
    amount: '₦2,500',
    reward: 2500,
    brief:
      'Which of these brands products will you recommend for Best Battery Endurance Under ₦300k?',
    products: [
      {
        id: 'Tecno',
        label: 'Tecno',
        bg: 'from-[#0057b8] to-[#002f6c]',
        inner: 'bg-white text-[#0057b8]',
        sub: 'Spark & Camon',
      },
      {
        id: 'Infinix',
        label: 'Infinix',
        bg: 'from-[#7cc242] to-[#3d7a1a]',
        inner: 'bg-black text-[#7cc242]',
        sub: 'Note & Hot Series',
      },
    ],
  },
  {
    id: 'oraimo',
    name: 'Oraimo X SOUNDS',
    amount: '₦1,000',
    reward: 1000,
    brief:
      'Which of these brands products will you recommend for Best Value Wireless Deep Bass Earbuds?',
    products: [
      {
        id: 'Oraimo',
        label: 'Oraimo',
        bg: 'from-[#6cc24a] to-[#2d6a1e]',
        inner: 'bg-black text-[#6cc24a]',
        sub: 'FreePods Series',
      },
      {
        id: 'SOUNDS',
        label: 'SOUNDS',
        bg: 'from-[#1a1a1a] to-[#000000]',
        inner: 'bg-[#ff6600] text-white',
        sub: 'Wireless Earbuds',
      },
    ],
  },
]

type TickerEvent = {
  kind: string
  time: string
  title: string
  detail: string
  tone: 'green' | 'gold'
}

const TICKER_EVENTS: TickerEvent[] = [
  {
    kind: 'Withdrawal',
    time: '2s ago',
    title: 'Obinna Okafor placed withdrawal',
    detail: '₦320,000 (Kuda Microfinance)',
    tone: 'green',
  },
  {
    kind: 'Entry Level',
    time: '1m ago',
    title: 'Aliyu Ganduje activated Liora account',
    detail: 'Verified Entry Level Package',
    tone: 'green',
  },
  {
    kind: 'Ads Status',
    time: 'Just now',
    title: 'Ebire George completed Moniepoint NG Ads Status',
    detail: 'Collected +₦3,000 reward',
    tone: 'green',
  },
]

const PointingHand = () => (
  <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient
        id="handGold"
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
      fill="url(#handGold)"
      stroke="#B97A1E"
      strokeWidth="0.6"
      strokeLinejoin="round"
    />
  </svg>
)

const HomePage = () => {
  const [tickerIndex, setTickerIndex] = useState(0)
  const [handIndex, setHandIndex] = useState(0)
  const [toast, setToast] = useState('')
  const [communityOpen, setCommunityOpen] = useState(true)
  const [activateOpen, setActivateOpen] = useState(false)
  const [taskView, setTaskView] = useState<'list' | 'brief' | 'success'>('list')
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [appState, setAppState] = useState(() => loadAppState())
  const { user, balance, todayEarnings, completedTasks } = appState
  const { claimable: dividendClaimable, maturesAt: dividendMaturesAt } =
    getDividendStatus(appState.dividendClaimedAt)
  const nextDividendDate = formatDividendDate(
    dividendMaturesAt ?? getNextDividendDate()
  )
  const [, setLimitReached] = useState(false)
  const [lastClaim, setLastClaim] = useState<{
    taskId: string
    product: string
  } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
    }
    toastTimer.current = setTimeout(
      () => setToast(''),
      message.length > 60 ? 5000 : 2600
    )
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current)
      }
    },
    []
  )

  const playClaimSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(CLAIM_SOUND)
      audioRef.current.volume = 0.6
    }
    audioRef.current.currentTime = 0
    void audioRef.current.play().catch(() => undefined)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setTickerIndex((index) => (index + 1) % TICKER_EVENTS.length)
    }, 4200)
    return () => clearInterval(id)
  }, [])

  const firstActiveTaskIndex = TASKS.findIndex(
    (t) => !completedTasks.includes(t.id)
  )

  useEffect(() => {
    if (taskView !== 'list' || firstActiveTaskIndex < 0) return undefined
    setHandIndex(firstActiveTaskIndex)
    const activeCount = TASKS.filter(
      (t) => !completedTasks.includes(t.id)
    ).length
    if (activeCount <= 1) return undefined
    const id = setInterval(() => {
      setHandIndex((prev) => {
        const start = prev + 1
        for (let i = 0; i < TASKS.length; i += 1) {
          const idx = (start + i) % TASKS.length
          if (!completedTasks.includes(TASKS[idx].id)) return idx
        }
        return prev
      })
    }, 1600)
    return () => clearInterval(id)
  }, [taskView, completedTasks, firstActiveTaskIndex])

  const handleWithdraw = () => {
    playClaimSound()
    showToast('Withdrawal request submitted')
  }

  const handleClaim = () => {
    playClaimSound()
    if (dividendClaimable) {
      const claimedAt = Date.now()
      const next = {
        ...appState,
        balance: appState.balance + WEEKLY_DIVIDEND_AMOUNT,
        dividendClaimedAt: claimedAt,
      }
      saveAppState(next)
      setAppState(next)
      showToast(
        `₦${WEEKLY_DIVIDEND_AMOUNT.toLocaleString()} weekly dividends claimed. Next payout matures ${formatDividendDate(
          getNextDividendDate(new Date(claimedAt))
        )}`
      )
      return
    }
    showToast(`Weekly dividends mature on ${nextDividendDate}`)
  }

  const activeTask = TASKS.find((t) => t.id === activeTaskId) || null

  const handleTask = (id: string) => {
    if (completedTasks.includes(id)) return
    if (todayEarnings >= 5000) {
      showToast(
        'Daily Recommendation limit reached (₦5,000). Come back tomorrow or activate your account.'
      )
      return
    }
    setActiveTaskId(id)
    setTaskView('brief')
    setSelectedProduct(null)
  }

  const handleClaimConfirm = () => {
    if (!activeTask || !selectedProduct) return
    setIsClaiming(true)
    playClaimSound()
    setTimeout(() => {
      const prev = loadAppState()
      const nextCompleted = prev.completedTasks.includes(activeTask.id)
        ? prev.completedTasks
        : [...prev.completedTasks, activeTask.id]
      const nextToday = prev.todayEarnings + activeTask.reward
      const next = {
        ...prev,
        completedTasks: nextCompleted,
        balance: prev.balance + activeTask.reward,
        todayEarnings: nextToday,
      }
      saveAppState(next)
      setAppState(next)
      setLastClaim({ taskId: activeTask.id, product: selectedProduct })
      setIsClaiming(false)
      setShowConfirm(false)
      setTaskView('success')
      if (nextToday >= 5000) {
        setLimitReached(true)
        setTimeout(() => {
          showToast(
            'Daily Recommendation limit reached (₦5,000). Come back tomorrow or activate your account.'
          )
        }, 300)
      }
    }, 1500)
  }

  const ticker = TICKER_EVENTS[tickerIndex]

  return (
    <div className="flex min-h-screen justify-center bg-[#050608]">
      <div className="bg-crosshatch relative flex min-h-screen w-full max-w-[480px] flex-col bg-[#0b0d14] pb-28 shadow-[0_0_60px_rgba(0,0,0,0.85)]">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-[#0b0d14]/95 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-1">
            <Link
              to="/"
              aria-label="Back to welcome"
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft className="h-[18px] w-[18px]" />
            </Link>
            <Link
              to="/home"
              className="font-serif text-[17px] font-bold tracking-widest text-white"
            >
              LIORA
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                showToast('Use your browser menu to install Liora')
              }
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#1a1d27] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" />
              Install App
            </button>
            <Link
              to="/profile"
              aria-label="Profile"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#f0c14b]/50 bg-gradient-to-br from-[#f0c14b] to-[#b8860b] text-[8px] font-bold text-black"
            >
              {getUserInitials(user?.username)}
            </Link>
          </div>
        </header>

        <main className="mat-unroll flex-1 space-y-4 px-4 pt-4">
          <section className="warm-glow flex items-center justify-between gap-2 rounded-xl border bg-[#161922] p-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#232634] text-[#f0c14b]">
                <Calendar className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold leading-tight text-white">
                  {dividendClaimable
                    ? 'Take Weekly Dividends'
                    : 'Your Next Weekly Dividends will be Available...'}
                </p>
                <p className="mt-0.5 text-[10px] text-[#838b9e]">
                  {dividendClaimable
                    ? `Weekly partner distribution · ₦${WEEKLY_DIVIDEND_AMOUNT.toLocaleString()}`
                    : `Matures ${nextDividendDate}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClaim}
              className={
                dividendClaimable
                  ? 'shrink-0 whitespace-nowrap rounded-md border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] px-3 py-1 text-[10px] font-bold text-black transition hover:brightness-110 active:scale-95'
                  : 'shrink-0 whitespace-nowrap rounded-md border border-white/5 bg-[#232634] px-2.5 py-1 text-[10px] font-semibold text-gray-400 transition hover:text-white'
              }
            >
              {dividendClaimable
                ? `Claim ₦${WEEKLY_DIVIDEND_AMOUNT.toLocaleString()}`
                : nextDividendDate}
            </button>
          </section>

          <section className="warm-glow relative rounded-2xl border bg-[#111420] p-5">
            <p className="mb-1 text-[11px] font-medium text-[#838b9e]">
              Available Earnings <span className="mx-1 text-[#f0c14b]">·</span>{' '}
              <span className="text-[#f0c14b]">Starter Tier</span>
            </p>
            <p className="mb-5 font-serif text-[36px] font-bold leading-none tracking-tight text-white">
              ₦{balance.toLocaleString()}
            </p>

            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={handleWithdraw}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold ${goldButton}`}
              >
                <Wallet className="h-[18px] w-[18px]" />
                Withdraw Funds
              </button>

              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[10px] font-bold text-[#E8B94A]">
                  Status: Not Activated
                </span>
                <button
                  type="button"
                  onClick={() => setActivateOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2a3040] bg-[#1a1e29] px-4 py-3 text-[13px] font-bold text-white transition hover:bg-[#202534] active:scale-[0.98]"
                >
                  <Crown className="h-3.5 w-3.5" />
                  Activate
                </button>
              </div>
            </div>

            <div className="-mx-5 -mb-5 mt-5 flex items-start gap-3 rounded-b-2xl border-t border-[#232634] bg-[#0b0d14] px-5 pb-5 pt-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#10b981]/20 bg-[#10b981]/10 text-[#10b981]">
                <Waypoints className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#E8B94A]">
                    {ticker.kind}
                    <span className="h-0.5 w-0.5 rounded-full bg-gray-500" />
                    <span className="font-normal text-gray-400">
                      {ticker.time}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-[#10b981]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#10b981]" />
                    LIVE
                  </span>
                </div>
                <p
                  key={`${tickerIndex}-title`}
                  className="fade-in truncate text-[12px] font-medium text-white"
                >
                  {ticker.title}
                </p>
                <p
                  key={`${tickerIndex}-detail`}
                  className="fade-in mt-0.5 text-[11px] font-semibold text-[#10b981]"
                >
                  {ticker.detail}
                </p>
              </div>
            </div>
          </section>

          <section className="warm-glow relative overflow-hidden rounded-2xl border bg-[#111420] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0c14b]/20 bg-[#f0c14b]/10 text-[#f0c14b]">
                  <Gift className="h-[18px] w-[18px]" />
                </span>
                <h2 className="text-[15px] font-bold tracking-tight text-white">
                  Recommend Products
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (taskView !== 'list') {
                    setTaskView('list')
                    setSelectedProduct(null)
                  }
                }}
                className="flex items-center gap-1 rounded-lg border border-[#2a3040] bg-[#1f2433] px-2.5 py-1.5 text-[10px] text-[#8b95a5] transition hover:bg-[#2a3040] hover:text-white"
              >
                <ChevronLeft className="h-3 w-3" />
                All Reviews
              </button>
            </div>

            <div className="warm-glow mb-4 rounded-xl border bg-[#0b0d14] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[10px] text-[#838b9e]">
                  Select the best product for each brief to claim wages.
                </p>
                <p className="shrink-0 text-[10px] font-bold text-[#34d399]">
                  Today: ₦{Math.min(todayEarnings, 5000).toLocaleString()} /
                  ₦5,000
                </p>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#232634]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f0c14b] to-[#fce181] transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(3, (todayEarnings / 5000) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {taskView === 'list' && (
              <>
                <div className="mb-3 flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-bold text-white">
                    Tap a comparison to recommend &amp; earn
                  </h3>
                  <span className="text-[10px] font-medium text-[#838b9e]">
                    5 tasks
                  </span>
                </div>

                <div className="relative">
                  <div className="space-y-2">
                    {TASKS.map(({ id, name, amount }, index) => {
                      const completed = completedTasks.includes(id)
                      const showHand = !completed && index === handIndex
                      return (
                        <div
                          key={id}
                          className={`warm-glow relative z-10 flex items-center justify-between rounded-xl border bg-[#0b0d14] p-3.5 transition-all duration-300 ${
                            showHand
                              ? 'shadow-[0_0_18px_rgba(232,185,74,0.18)]'
                              : ''
                          }`}
                          style={{
                            borderColor: showHand ? '#E8B94A' : 'transparent',
                          }}
                        >
                          <div className="min-w-0">
                            <p className="mb-1 truncate text-[13px] font-bold text-white">
                              {name}
                            </p>
                            <p className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-medium text-[#E8B94A]">
                                {amount}
                              </span>
                              <span className="text-gray-500">·</span>
                              <span
                                className={`font-medium ${completed ? 'text-gray-500' : 'text-[#10b981]'}`}
                              >
                                {completed ? 'Completed' : 'Active'}
                              </span>
                            </p>
                          </div>

                          <div className="relative ml-3 shrink-0">
                            {showHand && (
                              <div className="pointer-events-none absolute right-full top-1/2 z-30 -translate-y-1/2">
                                <div className="hand-tap relative h-8 w-8">
                                  <span className="absolute -inset-1.5 rounded-full bg-[#F3C75A]/35 blur-[7px]" />
                                  <PointingHand />
                                </div>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleTask(id)}
                              disabled={completed}
                              className={`flex items-center gap-1 rounded-lg px-4 py-2 text-[12px] font-bold transition-all ${
                                completed
                                  ? 'cursor-not-allowed border border-[#2a3040] bg-[#1f2433] text-[#5a6375]'
                                  : goldButton
                              }`}
                            >
                              Start
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {taskView === 'brief' && activeTask && (
              <div className="fade-in">
                <div className="mb-4 rounded-xl border border-[#2f263a] bg-[#1a1523] p-4">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-[#E8B94A]">
                    Recommendation Brief · {activeTask.amount}
                  </p>
                  <h3 className="text-[14px] font-bold leading-snug text-white">
                    {activeTask.brief}
                  </h3>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  {activeTask.products.map((p) => {
                    const selected = selectedProduct === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProduct(p.id)}
                        className={`relative rounded-xl border-2 p-2 text-left transition-all ${
                          selected
                            ? 'border-[#eab308] bg-[#2a2135]'
                            : 'border-[#2f263a] bg-[#251e30] hover:border-[#3b2f4a]'
                        }`}
                      >
                        <div
                          className={`relative flex h-[100px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${p.bg} shadow-inner`}
                        >
                          <span className="absolute left-2 top-2 text-[6px] font-bold text-white/70">
                            100ML
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-black shadow-sm ${p.inner}`}
                          >
                            {p.label.toUpperCase()}
                          </span>
                          <span className="mt-1 text-[7px] font-semibold text-white/90">
                            {p.sub}
                          </span>
                        </div>
                        <p className="mt-2 text-center text-[12px] font-bold text-white">
                          {p.label}
                        </p>
                        {selected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#eab308] text-black">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  disabled={!selectedProduct}
                  onClick={() => selectedProduct && setShowConfirm(true)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-bold transition-all ${
                    selectedProduct
                      ? `${goldButton}`
                      : 'cursor-not-allowed border border-[#5c452b] bg-[#3b2f2b] text-[#a88a44]'
                  }`}
                >
                  {selectedProduct
                    ? `Take Payment ${activeTask.amount}`
                    : 'Select a Product to Take Payment'}
                </button>
              </div>
            )}

            {taskView === 'success' && lastClaim && (
              <div className="fade-in py-2">
                {(() => {
                  const t = TASKS.find((x) => x.id === lastClaim.taskId)
                  const briefSubject = t?.brief
                    .replace(
                      'Which of these brands products will you recommend for ',
                      ''
                    )
                    .replace('?', '')
                  return (
                    <div className="rounded-2xl border border-[#1b3d32] bg-[#0e1a17] p-6 text-center shadow-inner">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#10b981]/30 bg-[#10b981]/10">
                        <CircleCheck className="h-7 w-7 text-[#10b981]" />
                      </div>
                      <h3 className="mb-2 text-[16px] font-bold text-white">
                        +{t?.amount} Claimed!
                      </h3>
                      <p className="mb-5 text-[11px] leading-relaxed text-[#8b95a5]">
                        Your recommendation of{' '}
                        <span className="font-bold text-[#E8B94A]">
                          {lastClaim.product}
                        </span>{' '}
                        for{' '}
                        <span className="font-bold text-white">
                          &quot;{briefSubject}&quot;
                        </span>{' '}
                        has been credited.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setTaskView('list')
                          setSelectedProduct(null)
                          setActiveTaskId(null)
                        }}
                        className={`w-full rounded-xl py-3 text-[13px] font-bold ${goldButton}`}
                      >
                        Back to Recommendations
                      </button>
                    </div>
                  )
                })()}
              </div>
            )}
          </section>
        </main>

        <nav className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[448px] -translate-x-1/2 rounded-full border border-[#2d2238] bg-[#120f19]/95 px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.75)] backdrop-blur-lg">
          <div className="relative flex items-center justify-between">
            <Link
              to="/ai-robot"
              className="flex w-24 flex-col items-center gap-1 text-[#8b95a5] transition hover:text-white"
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
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-[#0b0d14] bg-gradient-to-b from-[#FDE18B] to-[#C8961D] text-black shadow-[0_0_20px_rgba(232,185,74,0.3)]"
              >
                <Home className="h-6 w-6" />
              </Link>
              <span className="mt-1 text-[10px] font-bold text-[#E8B94A]">
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

        {toast && (
          <button
            type="button"
            onClick={() => setToast('')}
            aria-label="Dismiss notification"
            className="fade-in fixed left-1/2 top-3 z-[70] flex w-[calc(100%-1.5rem)] max-w-[420px] -translate-x-1/2 items-start gap-2 rounded-2xl border border-[#2f6b45] bg-[#0f2418] px-4 py-3 text-left text-[12px] font-medium leading-relaxed text-[#86efac] shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          >
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{toast}</span>
          </button>
        )}

        {showConfirm && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Close confirmation modal"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => !isClaiming && setShowConfirm(false)}
            onKeyDown={(e) => {
              if (
                (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') &&
                !isClaiming
              )
                setShowConfirm(false)
            }}
          >
            <div
              role="presentation"
              className="toast-in w-full max-w-[340px] rounded-[20px] border border-[#2f263a] bg-[#16121c] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#5c452b] bg-[#2a211a] text-[#eab308]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <button
                  type="button"
                  onClick={() => !isClaiming && setShowConfirm(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mb-2 text-[15px] font-bold leading-snug text-white">
                Are you sure this product is best recommendation for{' '}
                {activeTask?.brief
                  .replace(
                    'Which of these brands products will you recommend for ',
                    ''
                  )
                  .replace('?', '')}
                ?
              </h3>
              <p className="mb-6 text-[12px] text-[#8b95a5]">
                Selected choice:{' '}
                <span className="font-bold text-white">{selectedProduct}</span>
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => !isClaiming && setShowConfirm(false)}
                  className="flex-1 rounded-xl border border-[#3b2f4a] bg-[#241b2e] py-3 text-[13px] font-bold text-white transition hover:bg-[#2d2238]"
                >
                  No, Change
                </button>
                <button
                  type="button"
                  disabled={isClaiming}
                  onClick={handleClaimConfirm}
                  className={`flex-1 rounded-xl py-3 text-[13px] font-bold ${goldButton} disabled:opacity-70`}
                >
                  {isClaiming
                    ? 'Claiming...'
                    : `Yes, Claim ${activeTask?.amount}`}
                </button>
              </div>
            </div>
          </div>
        )}

        <ActivateAccountModal
          open={activateOpen}
          onClose={() => setActivateOpen(false)}
        />

        {communityOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Join Official Community"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
          >
            <div className="toast-in relative w-full max-w-[360px] overflow-hidden rounded-[24px] border border-[#232634] bg-[#161922] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
              <button
                type="button"
                onClick={() => setCommunityOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#232634] text-[#838b9e] transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#f0c14b]/40 bg-gradient-to-b from-[#2a230e] to-[#14100a] text-[#f0c14b] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Users className="h-6 w-6" />
                </div>
                <span className="min-w-0">
                  <span className="block text-left text-[9px] font-bold uppercase tracking-[0.2em] text-[#f0c14b]">
                    Liora Member Network
                  </span>
                  <span className="mt-0.5 block text-left font-serif text-lg font-bold text-white">
                    Join Official Community
                  </span>
                </span>
              </div>

              <p className="mt-4 text-left text-[12px] leading-relaxed text-[#838b9e]">
                Connect with active members for instant task drop alerts, AI
                trading insights, and verified payout notices.
              </p>

              <a
                href={COMMUNITY_URL}
                target="_blank"
                rel="noreferrer"
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold ${goldButton}`}
              >
                <Send className="h-4 w-4" />
                Join Community Now
              </a>
              <button
                type="button"
                onClick={() => setCommunityOpen(false)}
                className="mt-3 w-full text-center text-[12px] font-semibold text-[#838b9e] transition hover:text-white"
              >
                Maybe later
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#838b9e]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
                Verified Liora dispatch channel
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
