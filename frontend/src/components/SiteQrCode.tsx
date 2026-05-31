import { useMemo, useState } from 'react'

import { QRCodeSVG } from 'qrcode.react'

function resolveSiteUrl() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.origin
}

export function SiteQrCode() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const siteUrl = useMemo(() => resolveSiteUrl(), [])

  if (!siteUrl) {
    return null
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10 md:hidden"
        onClick={() => setIsFullscreen(true)}
        aria-label="Prikaži QR kod stranice"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 14H16V16H14V14ZM16 16H18V18H16V16ZM18 14H20V20H18V14ZM14 18H16V20H14V18Z" fill="currentColor" />
        </svg>
      </button>

      <button
        type="button"
        className="group hidden h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 text-left text-slate-200 transition hover:border-white/20 hover:bg-white/10 md:inline-flex"
        onClick={() => setIsFullscreen(true)}
        aria-label="Prikaži QR kod stranice preko cijelog ekrana"
      >
        <div className="overflow-hidden rounded-lg border border-white/15 bg-white p-1 shadow-sm">
          <QRCodeSVG value={siteUrl} size={30} bgColor="#ffffff" fgColor="#020617" includeMargin={false} />
        </div>
        <span className="pr-0.5 text-sm font-semibold">QR</span>
      </button>

      {isFullscreen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative flex w-full max-w-xl flex-col items-center rounded-[2rem] border border-white/10 bg-slate-900 px-4 py-8 text-center shadow-[0_40px_120px_rgba(15,23,42,0.55)] sm:px-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              onClick={() => setIsFullscreen(false)}
            >
              Zatvori
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">QR kod stranice</p>
            <h2 className="mt-3 font-display text-2xl text-white sm:text-4xl">Skeniraj za otvaranje aplikacije</h2>
            <p className="mt-3 max-w-md text-sm text-slate-300 sm:text-base">Kod vodi na trenutnu adresu aplikacije i pogodan je za brzo otvaranje na telefonu.</p>

            <div className="mt-8 rounded-[2rem] bg-white p-4 shadow-2xl sm:p-5">
              <QRCodeSVG value={siteUrl} size={280} bgColor="#ffffff" fgColor="#020617" includeMargin={true} />
            </div>

            <a
              href={siteUrl}
              className="mt-6 break-all text-sm font-semibold text-red-300 underline decoration-red-500/50 underline-offset-4 hover:text-red-200"
              target="_blank"
              rel="noreferrer"
            >
              {siteUrl}
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}
