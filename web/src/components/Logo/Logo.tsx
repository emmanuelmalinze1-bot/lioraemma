import { Link } from '@redwoodjs/router'

interface LogoProps {
  to?: string
  className?: string
}

const Logo = ({ to = '/', className = '' }: LogoProps) => (
  <Link
    to={to}
    className={`font-serif text-2xl font-bold tracking-wide text-white ${className}`}
  >
    Liora
  </Link>
)

export default Logo
