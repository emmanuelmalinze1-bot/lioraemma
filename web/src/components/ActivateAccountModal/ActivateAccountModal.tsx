import { useEffect, useState } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Globe,
  ShieldCheck,
  X,
} from 'lucide-react'

const TELEGRAM_URL = 'https://t.me/+mrMvIAaR7pg5YzQ8'

const COUNTRIES = ['Cameroon', 'GHANA', 'Nigeria', 'South Africa']

const BANK = {
  name: 'Sterling',
  accountNumber: '0145224795',
  accountName: 'Nneka Nestor',
}

const goldButton =
  'border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all hover:brightness-105 active:scale-[0.98]'

type Tier = 'shareholder' | 'entry'
type Step = 'country' | 'bank'
type CopyField = 'amount' | 'account'

type ActivateAccountModalProps = {
  open: boolean
  onClose: () => void
}

const ActivateAccountModal = ({ open, onClose }: ActivateAccountModalProps) => {
  const [tier, setTier] = useState<Tier>('shareholder')
  const [step, setStep] = useState<Step>('country')
  const [secondsLeft, setSecondsLeft] = useState(15 * 60)
  const [copied, setCopied] = useState<CopyField | null>(null)

  useEffect(() => {
    if (!open) return undefined
    setStep('country')
    setCopied(null)
    setSecondsLeft(15 * 60)
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [open])

  useEffect(() => {
    if (!copied) return undefined
    const id = setTimeout(() => setCopied(null), 2000)
    return () => clearTimeout(id)
  }, [copied])

  if (!open) return null

  const amount = tier === 'shareholder' ? 15000 : 10000

  const copyValue = async (value: string, field: CopyField) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard can be blocked in some browsers; keep the UI feedback anyway.
    }
    setCopied(field)
  }

  const openTelegram = () => {
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close activation modal"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          onClose()
        }
      }}
    >
      <div
        role="presentation"
        className="toast-in w-full max-w-[360px] rounded-[20px] border border-[#2f263a] bg-[#16121c] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-bold leading-tight text-white">
              Activate Account
            </h2>
            <p className="mt-0.5 text-[11px] text-[#8b95a5]">
              Select a membership tier to unlock payouts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-[#3b2f4a] bg-[#1f1828] px-2 py-1 text-[11px] font-bold text-[#eab308]">
              <Clock className="h-3.5 w-3.5" />
              {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
              {String(secondsLeft % 60).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1f1828] text-gray-400 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTier('shareholder')}
            className={`relative rounded-xl border p-3 text-left transition ${
              tier === 'shareholder'
                ? 'border-[#5c452b] bg-[#2a211a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'border-[#2f263a] bg-[#1a1523] hover:border-[#3b2f4a]'
            }`}
          >
            <div className="mb-1.5 flex items-start justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#eab308]">
                Shareholder
              </span>
              <Crown className="h-3.5 w-3.5 text-[#eab308]" />
            </div>
            <div className="mb-1 text-[15px] font-bold text-white">₦15,000</div>
            <div
              className={`text-[9px] leading-tight ${
                tier === 'shareholder' ? 'text-[#b3a08a]' : 'text-[#8b95a5]'
              }`}
            >
              Priority payouts &amp; 2x task rates
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTier('entry')}
            className={`relative rounded-xl border p-3 text-left transition ${
              tier === 'entry'
                ? 'border-[#3f6b52] bg-[#16231b] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'border-[#2f263a] bg-[#1a1523] hover:border-[#3b2f4a]'
            }`}
          >
            <div className="mb-1.5 flex items-start justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#10b981]">
                Entry Level
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
            </div>
            <div className="mb-1 text-[15px] font-bold text-white">₦10,000</div>
            <div className="text-[9px] leading-tight text-[#8b95a5]">
              Standard account activation
            </div>
          </button>
        </div>

        {step === 'country' ? (
          <div className="rounded-xl border border-[#2f263a] bg-[#110e15] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-white">
                <Globe className="h-3.5 w-3.5 text-[#8b95a5]" />
                Select Country
              </div>
              <span className="text-[10px] font-medium text-[#8b95a5]">
                Step 1/2
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => setStep('bank')}
                  className="group flex items-center justify-between rounded-lg border border-[#3b2f4a] bg-[#241b2e] px-3 py-2.5 transition hover:bg-[#2d2238]"
                >
                  <span className="text-[12px] font-bold text-white transition group-hover:text-[#eab308]">
                    {country}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#8b95a5] transition group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[#2f263a] bg-[#110e15] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-white">
                <Building2 className="h-3.5 w-3.5 text-[#eab308]" />
                Nigeria Bank
              </div>
              <button
                type="button"
                onClick={() => setStep('country')}
                className="flex items-center gap-1 text-[10px] font-medium text-[#eab308] hover:underline"
              >
                <ArrowLeft className="h-3 w-3" />
                Change
              </button>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8b95a5]">Amount</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#eab308]">
                    NGN {amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyValue(String(amount), 'amount')}
                    aria-label="Copy amount"
                    className="text-[#8b95a5] transition hover:text-white"
                  >
                    {copied === 'amount' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8b95a5]">Bank</span>
                <span className="text-[12px] font-bold uppercase text-white">
                  {BANK.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8b95a5]">Account No.</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-white">
                    {BANK.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyValue(BANK.accountNumber, 'account')}
                    aria-label="Copy account number"
                    className="text-[#8b95a5] transition hover:text-white"
                  >
                    {copied === 'account' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10b981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8b95a5]">Name</span>
                <span className="text-[11px] font-bold uppercase text-white">
                  {BANK.accountName}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={openTelegram}
              className={`mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-bold ${goldButton}`}
            >
              Proceed to Verify <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={openTelegram}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a3040] bg-[#1f2433] py-3.5 text-[13px] font-bold text-white transition hover:bg-[#2a3040]"
            >
              <CheckCircle2 className="h-4 w-4 text-[#10b981]" /> I have made my
              payment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivateAccountModal
