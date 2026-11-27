import { useEffect, useMemo, useState } from 'react'

import {
  AlertCircle,
  Building2,
  ChevronDown,
  Landmark,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react'

const BANKS = [
  'Access Bank',
  'Access Bank (Diamond)',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Jaiz Bank',
  'Keystone Bank',
  'Kuda Bank',
  'Lotus Bank',
  'Moniepoint MFB',
  'OPay Digital Services (OPay)',
  'Optimus Bank',
  'PalmPay',
  'Parallex Bank',
  'Polaris Bank',
  'PremiumTrust Bank',
  'Providus Bank',
  'Rubies MFB',
  'Signature Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'TAJ Bank',
  'Titan Trust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'VFD Microfinance Bank',
  'Wema Bank',
  'Zenith Bank',
  '9mobile 9Payment Service Bank',
  'Carbon',
  'FairMoney MFB',
  'Hope PSB',
  'Money Master PSB',
  'MTN Momo PSB',
  'Paga',
  'Paystack-Titan',
  'Sparkle Microfinance Bank',
]

const goldButton =
  'border border-[#A67C1D] bg-gradient-to-b from-[#FDE18B] via-[#E8B94A] to-[#C8961D] text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 disabled:active:scale-100'

type WithdrawalModalProps = {
  open: boolean
  onClose: () => void
  balance: number
  onWithdraw: (amount: number) => void
}

const WithdrawalModal = ({
  open,
  onClose,
  balance,
  onWithdraw,
}: WithdrawalModalProps) => {
  const [bankOpen, setBankOpen] = useState(false)
  const [bankQuery, setBankQuery] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [verified, setVerified] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    setBankOpen(false)
    setBankQuery('')
    setSelectedBank('')
    setAccountNumber('')
    setAccountName('')
    setVerified(false)
    setAmount('')
    setError('')
    return undefined
  }, [open])

  const filteredBanks = useMemo(() => {
    const q = bankQuery.trim().toLowerCase()
    if (!q) return BANKS
    return BANKS.filter((b) => b.toLowerCase().includes(q))
  }, [bankQuery])

  if (!open) return null

  const canVerify =
    !!selectedBank &&
    accountNumber.length === 10 &&
    accountName.trim().length >= 3

  const numericAmount = Number(amount.replace(/,/g, ''))
  const canWithdraw =
    verified && Number.isFinite(numericAmount) && numericAmount > 0

  const handleVerify = () => {
    if (!canVerify) return
    setVerified(true)
    setError('')
  }

  const handleAmount = (value: string) => {
    setAmount(value.replace(/[^0-9.]/g, ''))
    setError('')
  }

  const applyPct = (pct: number) => {
    if (!verified) return
    setAmount(String(Math.floor(balance * pct)))
    setError('')
  }

  const handleWithdraw = () => {
    if (!canWithdraw) return
    if (numericAmount < 50000) {
      setError('Minimum withdrawal threshold is ₦50,000.')
      return
    }
    if (numericAmount > balance) {
      setError('Withdrawal amount cannot exceed your balance.')
      return
    }
    onWithdraw(numericAmount)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close withdrawal modal"
      className="fixed inset-0 z-[140] flex items-end justify-center bg-black/75 px-3 pb-3 pt-10 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose()
      }}
    >
      <div
        role="presentation"
        className="toast-in flex max-h-[92vh] w-full max-w-[420px] flex-col overflow-hidden rounded-[24px] border border-[#2f263a] bg-[#110d17] shadow-[0_24px_70px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-[#241b2f] px-5 py-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#1d1727] text-gray-400 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-1 flex items-center gap-2 pr-10 text-[13px] font-bold text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#241b2e] text-[#E8B94A]">
              <Wallet className="h-4 w-4" />
            </span>
            Liora Payout Desk
            <span className="text-gray-500">·</span>
            <span className="text-[#E8B94A]">Starter Tier</span>
          </div>
          <p className="mb-1 text-[11px] font-medium text-[#8b95a5]">
            Withdrawable Wallet Balance
          </p>
          <p className="font-serif text-[34px] font-bold leading-none tracking-tight text-white">
            ₦{balance.toLocaleString()}
          </p>
        </div>

        <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-3 rounded-xl border border-[#3a2f17] bg-[#19130d] p-3.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E8B94A]" />
            <div>
              <p className="mb-1 text-[11px] font-bold text-[#E8B94A]">
                Minimum Withdrawal Threshold
              </p>
              <p className="text-[10px] leading-relaxed text-[#8b95a5]">
                Minimum withdrawal threshold is{' '}
                <span className="font-bold text-white">₦50,000</span>. Keep
                completing daily recommendation tasks and sessions to reach it.
              </p>
            </div>
          </div>

          <section className="rounded-xl border border-[#2f263a] bg-[#16121c] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8B94A] text-[10px] font-bold text-black">
                  1
                </span>
                <h3 className="text-[12px] font-bold text-white">
                  Bank Account Details
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#E8B94A]">
                NUBAN Lookup
              </span>
            </div>

            <p className="mb-1.5 block text-[10px] font-bold text-white">
              Select Your Bank
            </p>
            <div className="relative mb-4">
              <button
                type="button"
                onClick={() => setBankOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-[#3b2f4a] bg-[#1f1828] px-3 py-3 text-left transition focus:border-[#E8B94A] focus:outline-none"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
                  <span
                    className={`truncate text-[12px] font-medium ${
                      selectedBank ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {selectedBank || 'Select bank'}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition ${bankOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {bankOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#3b2f4a] bg-[#110d17] shadow-2xl">
                  <div className="border-b border-[#2f263a] p-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={bankQuery}
                        onChange={(e) => setBankQuery(e.target.value)}
                        placeholder="Search bank name..."
                        className="w-full rounded-lg border border-[#E8B94A] bg-[#1a1523] py-2 pl-9 pr-3 text-[12px] text-white placeholder-gray-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto">
                    {filteredBanks.map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => {
                          setSelectedBank(bank)
                          setBankOpen(false)
                          setBankQuery('')
                          setVerified(false)
                          setError('')
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[12px] font-medium transition ${
                          selectedBank === bank
                            ? 'bg-[#241b2e] text-white'
                            : 'text-gray-300 hover:bg-[#1f1828] hover:text-white'
                        }`}
                      >
                        <Landmark className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="truncate">{bank}</span>
                      </button>
                    ))}
                    {filteredBanks.length === 0 && (
                      <p className="px-4 py-4 text-center text-[11px] text-gray-500">
                        No bank found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <label
              htmlFor="withdraw-account-number"
              className="mb-1.5 block text-[10px] font-bold text-white"
            >
              10-Digit Account Number
            </label>
            <input
              id="withdraw-account-number"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, ''))
                setVerified(false)
                setError('')
              }}
              placeholder="Enter 10-digit NUBAN"
              className="mb-4 w-full rounded-lg border border-[#3b2f4a] bg-[#1f1828] px-3 py-3 text-[13px] text-white placeholder-gray-500 outline-none transition focus:border-[#E8B94A]"
            />

            <label
              htmlFor="withdraw-account-name"
              className="mb-1.5 block text-[10px] font-bold text-white"
            >
              Account Name
            </label>
            <input
              id="withdraw-account-name"
              type="text"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value)
                setVerified(false)
                setError('')
              }}
              placeholder="Enter beneficiary account name"
              className="mb-4 w-full rounded-lg border border-[#3b2f4a] bg-[#1f1828] px-3 py-3 text-[13px] text-white placeholder-gray-500 outline-none transition focus:border-[#E8B94A]"
            />

            <button
              type="button"
              onClick={handleVerify}
              disabled={!canVerify || verified}
              className={
                verified
                  ? 'flex w-full items-center justify-center gap-2 rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 py-3 text-[12px] font-bold text-[#10b981]'
                  : `flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[12px] font-bold ${goldButton}`
              }
            >
              <ShieldCheck className="h-4 w-4" />
              {verified ? 'Account Verified' : 'Verify Account Number'}
            </button>
          </section>

          <section className="rounded-xl border border-[#2f263a] bg-[#16121c] p-4">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8B94A] text-[10px] font-bold text-black">
                  2
                </span>
                <h3 className="text-[12px] font-bold text-white">
                  Withdrawal Amount
                </h3>
              </div>
              <div className="flex gap-1.5">
                {[
                  ['25%', 0.25],
                  ['50%', 0.5],
                  ['Max', 1],
                ].map(([label, pct]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => applyPct(pct as number)}
                    disabled={!verified}
                    className="rounded-md border border-[#3b2f4a] bg-[#1f1828] px-2 py-1 text-[9px] font-bold text-white transition hover:bg-[#2a2235] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#E8B94A]">
                ₦
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => handleAmount(e.target.value)}
                disabled={!verified}
                placeholder="0.00"
                className="w-full rounded-lg border border-[#3b2f4a] bg-[#1f1828] py-3 pl-8 pr-3 text-[14px] font-bold text-white placeholder-gray-500 outline-none transition focus:border-[#E8B94A] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
          </section>
        </div>

        <div className="border-t border-[#241b2f] px-5 py-4">
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={!canWithdraw}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-bold ${goldButton}`}
          >
            {verified ? 'Withdraw Funds' : 'Verify Bank Account to Continue'}
          </button>
          <p className="mt-3 text-center text-[10px] text-[#8b95a5]">
            Zero transfer fees · Direct NIBSS bank settlement
          </p>
        </div>
      </div>
    </div>
  )
}

export default WithdrawalModal
