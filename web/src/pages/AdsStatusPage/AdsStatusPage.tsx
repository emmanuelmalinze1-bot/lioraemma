import { useCallback, useEffect, useRef, useState } from 'react'

import {
  ArrowRight,
  Bot,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Eye,
  Home,
  Megaphone,
  X,
} from 'lucide-react'

import { Link } from '@redwoodjs/router'

import { getUserInitials, loadAppState, saveAppState } from 'src/lib/appState'

const CLAIM_SOUND = '/universfield-new-notification-064-494547.mp3'

const goldButton =
  'border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all hover:brightness-105 active:scale-[0.98]'

type Story = {
  id: string
  brand: string
  reward: number
  image: string
  avatar: string
  step: number
  totalSteps: number
}

const STORIES: Story[] = [
  {
    id: 'vantage-1',
    brand: 'Vantage Pay Nigeria',
    reward: 1200,
    image: '/tuneva-hero (1).jpg',
    avatar: '/tuneva-hero (1).jpg',
    step: 1,
    totalSteps: 2,
  },
  {
    id: 'vantage-2',
    brand: 'Vantage Pay Nigeria',
    reward: 1200,
    image: '/tap-pulse.jpg',
    avatar: '/tuneva-hero (1).jpg',
    step: 2,
    totalSteps: 2,
  },
  {
    id: 'liora-1',
    brand: 'Liora Merchant Desk',
    reward: 750,
    image: '/tap-pulse.jpg',
    avatar: '/tap-pulse.jpg',
    step: 1,
    totalSteps: 1,
  },
  {
    id: 'oraimo-1',
    brand: 'Pulse 5G Audio',
    reward: 1100,
    image: '/tap-pulse.jpg',
    avatar: '/oraimo.svg',
    step: 1,
    totalSteps: 2,
  },
  {
    id: 'oraimo-2',
    brand: 'Pulse 5G Audio',
    reward: 1100,
    image: '/tap-pulse.jpg',
    avatar: '/oraimo.svg',
    step: 2,
    totalSteps: 2,
  },
]

const BRANDS = [
  {
    id: 'vantage',
    name: 'Vantage Pay Nigeria',
    spend: '₦4,200,000',
    reward: 1200,
    count: 2,
    image: '/tuneva-hero (1).jpg',
    startIndex: 0,
  },
  {
    id: 'liora',
    name: 'Liora Merchant Desk',
    spend: '₦5,500,000',
    reward: 750,
    count: 1,
    image: '/tap-pulse.jpg',
    startIndex: 2,
  },
  {
    id: 'oraimo',
    name: 'Pulse 5G Audio',
    spend: '₦28,500,000',
    reward: 1100,
    count: 2,
    image: '/oraimo.svg',
    startIndex: 3,
  },
]

const AdsStatusPage = () => {
  const [appState, setAppState] = useState(() => loadAppState())
  const { adsClaimed: claimed, adsTodayEarned: todayEarned } = appState
  const [viewMode, setViewMode] = useState<'list' | 'viewer'>('list')
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null)
  const [storyIndex, setStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeBrand = BRANDS.find((b) => b.id === activeBrandId) || null
  const brandStories = activeBrand
    ? STORIES.slice(
        activeBrand.startIndex,
        activeBrand.startIndex + activeBrand.count
      )
    : []
  const currentStory = brandStories[storyIndex]
  const isClaimed = !!(currentStory && claimed[currentStory.id])
  const isReady = progress >= 100
  const currentEarnings = Math.floor(
    (Math.min(progress, 100) / 100) * (currentStory?.reward || 0)
  )

  const playClaimSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(CLAIM_SOUND)
      audioRef.current.volume = 0.6
    }
    audioRef.current.currentTime = 0
    void audioRef.current.play().catch(() => undefined)
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (viewMode !== 'viewer' || !currentStory || isReady || isClaimed) {
      clearTimer()
      return undefined
    }

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 1.25 // 8s total
        if (next >= 100) return 100
        return next
      })
    }, 100)

    return clearTimer
  }, [
    viewMode,
    activeBrandId,
    storyIndex,
    isReady,
    isClaimed,
    clearTimer,
    currentStory,
  ])

  useEffect(() => () => clearTimer(), [clearTimer])

  const openBrand = (brandId: string) => {
    const brand = BRANDS.find((b) => b.id === brandId)
    if (!brand) return
    const stories = STORIES.slice(
      brand.startIndex,
      brand.startIndex + brand.count
    )
    setActiveBrandId(brandId)
    setStoryIndex(0)
    setProgress(claimed[stories[0].id] ? 100 : 0)
    setViewMode('viewer')
  }

  const goNext = () => {
    if (storyIndex < brandStories.length - 1) {
      const next = storyIndex + 1
      setStoryIndex(next)
      setProgress(claimed[brandStories[next].id] ? 100 : 0)
    } else {
      setViewMode('list')
    }
  }

  const goPrev = () => {
    if (storyIndex > 0) {
      const prev = storyIndex - 1
      setStoryIndex(prev)
      setProgress(claimed[brandStories[prev].id] ? 100 : 0)
    }
  }

  const handleClaim = () => {
    if (!currentStory || !isReady || isClaimed) return
    playClaimSound()
    const prev = loadAppState()
    if (prev.adsClaimed[currentStory.id]) return
    const next = {
      ...prev,
      adsClaimed: { ...prev.adsClaimed, [currentStory.id]: true },
      adsTodayEarned: prev.adsTodayEarned + currentStory.reward,
      balance: prev.balance + currentStory.reward,
    }
    saveAppState(next)
    setAppState(next)
  }

  const brandClaimed = (brandId: string) => {
    const brand = BRANDS.find((b) => b.id === brandId)
    if (!brand) return false
    const brandStories = STORIES.filter(
      (_, i) => i >= brand.startIndex && i < brand.startIndex + brand.count
    )
    return brandStories.every((s) => claimed[s.id])
  }

  const brandClaimedCount = (brandId: string) => {
    const brand = BRANDS.find((b) => b.id === brandId)
    if (!brand) return 0
    const brandStories = STORIES.filter(
      (_, i) => i >= brand.startIndex && i < brand.startIndex + brand.count
    )
    return brandStories.filter((s) => claimed[s.id]).length
  }

  if (viewMode === 'viewer' && currentStory) {
    const secondsLeft = Math.max(0, Math.ceil((100 - progress) * 0.08))

    return (
      <div className="flex min-h-screen justify-center bg-black">
        <div className="relative flex h-screen w-full max-w-[420px] flex-col bg-black">
          <div className="absolute left-2 right-2 top-2 z-50 flex gap-1">
            {brandStories.map((s, idx) => (
              <div
                key={s.id}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx < storyIndex || claimed[s.id]
                        ? '100%'
                        : idx === storyIndex
                          ? `${Math.min(progress, 100)}%`
                          : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute left-4 right-4 top-6 z-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
                aria-label="Back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full border border-white/30 bg-[#1a1d27]">
                  <img
                    src={currentStory.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white drop-shadow">
                    {currentStory.brand}
                  </p>
                  <p className="text-[10px] font-medium text-white/80 drop-shadow">
                    Status {currentStory.step} of {currentStory.totalSteps} ·
                    Full Reward: ₦{currentStory.reward.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="p-1 text-white drop-shadow"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden bg-[#111]">
            <img
              src={currentStory.image}
              alt="Status"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          <button
            type="button"
            onClick={goPrev}
            className={`absolute left-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm ${storyIndex === 0 ? 'pointer-events-none opacity-0' : ''}`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="z-50 rounded-t-2xl border-t border-[#1f2433] bg-[#0b0d14] p-4 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
                  <Eye className="h-3.5 w-3.5" /> Live Status Earnings
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-[28px] font-bold tracking-tight text-white">
                    ₦
                    {(isClaimed
                      ? currentStory.reward
                      : currentEarnings
                    ).toLocaleString()}
                  </span>
                  <span className="text-[14px] font-bold text-[#E8B94A]">
                    / ₦{currentStory.reward.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {isReady && !isClaimed && (
                  <div className="rounded border border-[#E8B94A]/20 bg-[#E8B94A]/10 px-2 py-1 text-[10px] font-bold text-[#E8B94A]">
                    Ready to Claim
                  </div>
                )}
                {isClaimed && (
                  <div className="flex items-center gap-1 rounded border border-[#10b981]/20 bg-[#10b981]/10 px-2 py-1 text-[10px] font-bold text-[#10b981]">
                    <CircleCheck className="h-3 w-3" /> Claimed
                  </div>
                )}
                {!isReady && (
                  <div className="mt-1 text-[10px] font-medium text-gray-400">
                    {secondsLeft}s left
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-[#2a3040] bg-[#1a1e29] text-white hover:bg-[#202534]"
                aria-label="Previous status"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {!isReady ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 rounded-xl border border-[#2a3040] bg-[#1a1e29] text-[13px] font-bold text-[#8b95a5]"
                >
                  Viewing Status ({Math.floor(Math.min(progress, 100))}%)
                </button>
              ) : isClaimed ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#10b981] text-[14px] font-bold text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] active:scale-[0.98]"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClaim}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-xl text-[14px] font-bold ${goldButton}`}
                >
                  Claim ₦{currentStory.reward.toLocaleString()}
                </button>
              )}

              <button
                type="button"
                onClick={goNext}
                className="flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-[#2a3040] bg-[#1a1e29] text-white hover:bg-[#202534]"
                aria-label="Next status"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#050608]">
      <div className="bg-crosshatch relative flex min-h-screen w-full max-w-[420px] flex-col bg-[#0b0d14] pb-28">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-[#0b0d14]/95 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-1">
            <Link
              to="/home"
              aria-label="Back to home"
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft className="h-[18px] w-[18px]" />
            </Link>
            <span className="font-serif text-[17px] font-bold tracking-widest text-white">
              LIORA
            </span>
          </div>
          <Link
            to="/profile"
            aria-label="Profile"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#f0c14b]/50 bg-gradient-to-br from-[#f0c14b] to-[#b8860b] text-[8px] font-bold text-black"
          >
            {getUserInitials(appState.user?.username)}
          </Link>
        </header>

        <main className="flex-1 space-y-4 px-4 pt-4">
          <div className="rounded-xl border border-[#232634] bg-[#161922] p-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[17px] font-bold text-white">Ads Status</h1>
                <p className="mt-0.5 text-[11px] text-[#8b95a5]">
                  Watch partner brand updates to claim instant status wages
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  Today
                </p>
                <p className="text-[11px] font-bold text-[#10b981]">
                  ₦{todayEarned.toLocaleString()} / ₦5,000
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-[#1f2433] bg-[#111420] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-white">
                Status
              </h2>
              <span className="text-[10px] text-[#8b95a5]">
                {BRANDS.length} Brands Active
              </span>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {BRANDS.map((brand) => {
                const done = brandClaimed(brand.id)
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => openBrand(brand.id)}
                    className="group relative h-[180px] w-[120px] shrink-0 overflow-hidden rounded-xl border border-[#2f263a] text-left"
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div
                      className={`absolute left-2 top-2 h-8 w-8 overflow-hidden rounded-full border-2 bg-black ${
                        done ? 'border-[#4b5563]' : 'border-[#10b981]'
                      }`}
                    >
                      <img
                        src={brand.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {!done && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-[#10b981] text-[9px] font-bold text-black">
                        {brand.count}
                      </div>
                    )}
                    <div className="absolute inset-x-2 bottom-3">
                      <p className="text-[11px] font-bold leading-tight text-white">
                        {brand.name}
                      </p>
                      <p className="mt-1 text-[9px] font-medium text-[#E8B94A]">
                        Full Reward: ₦{brand.reward.toLocaleString()}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#1f2433] bg-[#111420] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-white">
                  Top Partner Brands
                </h2>
                <p className="mt-0.5 text-[9px] text-[#8b95a5]">
                  Verified sponsors funding active status campaigns
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {BRANDS.map((brand) => {
                const doneCount = brandClaimedCount(brand.id)
                const allDone = doneCount === brand.count
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => openBrand(brand.id)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#2f263a] bg-[#1a1d27]">
                        <img
                          src={brand.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 truncate text-[12px] font-bold text-white">
                          {brand.name}
                          <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#10b981]" />
                        </p>
                        <p className="truncate text-[10px] text-[#8b95a5]">
                          Estimated Partner Advert Spend:{' '}
                          <span className="text-white">{brand.spend}</span>
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 shrink-0 text-right">
                      <p className="text-[11px] font-bold text-[#E8B94A]">
                        ₦{brand.reward.toLocaleString()}
                      </p>
                      {allDone ? (
                        <div className="mt-1 rounded-full border border-[#2a3040] bg-[#1f2433] px-2 py-0.5 text-[9px] text-[#8b95a5]">
                          Viewed
                        </div>
                      ) : (
                        <div className="ml-auto mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981] text-[10px] font-bold text-black">
                          {brand.count - doneCount}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </main>

        <nav className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[388px] -translate-x-1/2 rounded-full border border-[#2d2238] bg-[#120f19]/95 px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.75)] backdrop-blur-lg">
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
              className="flex w-24 flex-col items-center gap-1 text-[#E8B94A]"
            >
              <Megaphone className="h-[22px] w-[22px]" />
              <span className="whitespace-nowrap text-[10px] font-medium">
                Ads Status
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default AdsStatusPage
