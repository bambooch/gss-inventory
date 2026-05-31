import { NavLink } from 'react-router-dom'

import { SiteQrCode } from './SiteQrCode'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-white/15 text-white'
      : 'text-slate-300 hover:text-white hover:bg-white/10'
  }`

export function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950 shadow-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-black text-white">
            GSS
          </span>
          GSS Zenica
        </NavLink>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <NavLink to="/zaduzenja" className={linkClass}>
              Zaduženja
            </NavLink>
            <NavLink to="/inventar" className={linkClass}>
              Inventar
            </NavLink>
            <NavLink to="/clanovi" className={linkClass}>
              Članovi
            </NavLink>
          </div>
          <SiteQrCode />
        </div>
      </div>
    </nav>
  )
}
