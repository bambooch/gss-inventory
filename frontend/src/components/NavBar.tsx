import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../features/auth/AuthContext'
import { SiteQrCode } from './SiteQrCode'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
    isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
  }`

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-2xl px-4 py-3 text-base font-semibold transition-colors ${
    isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`

export function NavBar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleReset() {
    navigate('/reset')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950 shadow-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-white"
          onClick={closeMenu}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-black text-white">
            GSS
          </span>
          <span>GSS Zenica</span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex gap-1">
            <NavLink to="/zaduzenja" className={linkClass}>Zaduženja</NavLink>
            <NavLink to="/inventar" className={linkClass}>Inventar</NavLink>
            <NavLink to="/kategorije" className={linkClass}>Kategorije</NavLink>
            <NavLink to="/clanovi" className={linkClass}>Članovi</NavLink>
          </div>
          <SiteQrCode />
          <button
            onClick={handleReset}
            title="Očisti keš i učitaj novu verziju"
            className="rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            Resetuj
          </button>
          <button
            onClick={logout}
            title={`Prijavljen kao: ${user}`}
            className="rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            Odjava
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white sm:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen ? (
        <div className="border-t border-white/10 bg-slate-950 sm:hidden">
          <div className="flex flex-col gap-1 px-3 py-3">
            <NavLink to="/zaduzenja" className={mobileLinkClass} onClick={closeMenu}>Zaduženja</NavLink>
            <NavLink to="/inventar" className={mobileLinkClass} onClick={closeMenu}>Inventar</NavLink>
            <NavLink to="/kategorije" className={mobileLinkClass} onClick={closeMenu}>Kategorije</NavLink>
            <NavLink to="/clanovi" className={mobileLinkClass} onClick={closeMenu}>Članovi</NavLink>
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 px-4 py-3">
            <span className="text-xs text-slate-500">Prijavljen kao: {user}</span>
            <div className="flex gap-2">
              <button
                onClick={() => { closeMenu(); handleReset() }}
                className="flex-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Resetuj
              </button>
              <button
                onClick={() => { closeMenu(); logout() }}
                className="flex-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Odjava
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
