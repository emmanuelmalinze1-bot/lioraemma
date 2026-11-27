export type AppUser = {
  fullName: string
  username: string
  email: string
}

export type AppState = {
  user: AppUser | null
  balance: number
  todayEarnings: number
  completedTasks: string[]
  adsClaimed: Record<string, boolean>
  adsTodayEarned: number
  dividendClaimedAt: number | null
}

const ACCOUNTS_KEY = 'liora_accounts'
const STATES_KEY = 'liora_account_states'
const SESSION_KEY = 'liora_session_email'

export type StoredAccount = AppUser & {
  passwordHash: string
  createdAt: number
}

export const DEFAULT_APP_STATE: AppState = {
  user: null,
  balance: 17500,
  todayEarnings: 0,
  completedTasks: [],
  adsClaimed: {},
  adsTodayEarned: 0,
  dividendClaimedAt: null,
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const loadAccountStates = (): Record<string, AppState> => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STATES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, AppState>)
      : {}
  } catch {
    return {}
  }
}

const saveAccountStates = (states: Record<string, AppState>) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STATES_KEY, JSON.stringify(states))
}

const readSessionEmail = (): string | null => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(SESSION_KEY)
}

const writeSessionEmail = (email: string | null) => {
  if (typeof window === 'undefined') return
  if (email) {
    window.localStorage.setItem(SESSION_KEY, normalizeEmail(email))
    return
  }
  window.localStorage.removeItem(SESSION_KEY)
}

export const loadAppState = (): AppState => {
  if (typeof window === 'undefined') return DEFAULT_APP_STATE
  const sessionEmail = readSessionEmail()
  if (!sessionEmail) return DEFAULT_APP_STATE

  const account = loadAccounts().find(
    (a) => normalizeEmail(a.email) === sessionEmail
  )
  if (!account) return DEFAULT_APP_STATE

  const user: AppUser = {
    fullName: account.fullName,
    username: account.username,
    email: account.email,
  }
  const stored = loadAccountStates()[sessionEmail]
  return { ...DEFAULT_APP_STATE, ...(stored ?? {}), user }
}

export const saveAppState = (state: AppState) => {
  if (typeof window === 'undefined') return
  if (!state.user) {
    writeSessionEmail(null)
    return
  }
  const email = normalizeEmail(state.user.email)
  writeSessionEmail(email)
  const states = loadAccountStates()
  states[email] = { ...state, user: state.user }
  saveAccountStates(states)
}

export const patchAppState = (patch: Partial<AppState>): AppState => {
  const next = { ...loadAppState(), ...patch }
  saveAppState(next)
  return next
}

export const getUserInitials = (username?: string | null) => {
  const name = (username || 'U').trim()
  if (!name) return 'U'
  return name.slice(0, 2).toUpperCase()
}

export const loadAccounts = (): StoredAccount[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : []
  } catch {
    return []
  }
}

const saveAccounts = (accounts: StoredAccount[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export const hashPassword = async (password: string): Promise<string> => {
  const fallback = (value: string) => {
    let hash = 5381
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 33) ^ value.charCodeAt(i)
    }
    return `fallback_${(hash >>> 0).toString(16)}`
  }

  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return fallback(password)
  }

  try {
    const data = new TextEncoder().encode(password)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch {
    return fallback(password)
  }
}

export const findAccountByEmail = (email: string) => {
  const normalized = email.trim().toLowerCase()
  return loadAccounts().find((a) => a.email.toLowerCase() === normalized)
}

export type AuthResult =
  | { ok: true; user: AppUser }
  | { ok: false; error: string }

export const registerAccount = async (input: {
  fullName: string
  username: string
  email: string
  password: string
}): Promise<AuthResult> => {
  const email = input.email.trim()
  const fullName = input.fullName.trim()
  const username = input.username.trim()

  if (!fullName) return { ok: false, error: 'Please enter your full name.' }
  if (!username) return { ok: false, error: 'Please enter a username.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  if (input.password.length < 6) {
    return {
      ok: false,
      error: 'Password must be at least 6 characters long.',
    }
  }
  if (findAccountByEmail(email)) {
    return {
      ok: false,
      error: 'An account with this email already exists. Please log in.',
    }
  }

  const passwordHash = await hashPassword(input.password)
  const accounts = loadAccounts()
  const account: StoredAccount = {
    fullName,
    username,
    email,
    passwordHash,
    createdAt: Date.now(),
  }
  saveAccounts([...accounts, account])

  const user: AppUser = { fullName, username, email }
  saveAppState({ ...DEFAULT_APP_STATE, user })
  return { ok: true, user }
}

export const loginAccount = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  const trimmedEmail = email.trim()

  if (!trimmedEmail) return { ok: false, error: 'Please enter your email.' }
  if (!password) return { ok: false, error: 'Please enter your password.' }

  const account = findAccountByEmail(trimmedEmail)
  if (!account) {
    return {
      ok: false,
      error: 'No account found with this email. Please register first.',
    }
  }

  const passwordHash = await hashPassword(password)
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: 'Incorrect password. Please try again.' }
  }

  const user: AppUser = {
    fullName: account.fullName,
    username: account.username,
    email: account.email,
  }
  const stored = loadAccountStates()[normalizeEmail(user.email)]
  saveAppState({ ...DEFAULT_APP_STATE, ...(stored ?? {}), user })
  return { ok: true, user }
}

export const signOut = () => {
  writeSessionEmail(null)
}

const WEEKLY_DIVIDEND_DAY = 4
export const WEEKLY_DIVIDEND_AMOUNT = 2500

export const getNextDividendDate = (from: Date = new Date()) => {
  const next = new Date(from)
  const currentDay = next.getDay()
  let daysUntil = (WEEKLY_DIVIDEND_DAY - currentDay + 7) % 7
  if (daysUntil === 0) daysUntil = 7
  next.setDate(next.getDate() + daysUntil)
  next.setHours(0, 0, 0, 0)
  return next
}

export const formatDividendDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const getDividendStatus = (claimedAt: number | null) => {
  if (!claimedAt) return { claimable: true, maturesAt: null }
  const maturesAt = getNextDividendDate(new Date(claimedAt))
  return { claimable: Date.now() >= maturesAt.getTime(), maturesAt }
}
