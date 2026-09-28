import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { PersonIcon } from './icons'

export function PatientHeader() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <Link to="/inicio" className="flex items-center gap-2">
        <Logo className="h-7 w-7" />
        <span className="text-sm font-semibold">
          Lembra<span className="text-emerald-600">+</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
          Emergência
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <PersonIcon className="h-4 w-4" />
        </span>
      </div>
    </header>
  )
}
