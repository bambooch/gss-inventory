import { useEffect, useState } from 'react'

export function ResetPage() {
  const [status, setStatus] = useState<'running' | 'done' | 'error'>('running')

  useEffect(() => {
    async function reset() {
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          await Promise.all(registrations.map(r => r.unregister()))
        }
        if ('caches' in window) {
          const keys = await caches.keys()
          await Promise.all(keys.map(k => caches.delete(k)))
        }
        setStatus('done')
        setTimeout(() => {
          window.location.replace('/')
        }, 1500)
      } catch {
        setStatus('error')
      }
    }
    reset()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        {status === 'running' && <p className="text-slate-400">Čišćenje keša…</p>}
        {status === 'done' && <p className="text-green-400">Gotovo — preusmjeravanje…</p>}
        {status === 'error' && <p className="text-red-400">Greška pri čišćenju. Pokušajte ručno izbrisati podatke stranice.</p>}
      </div>
    </div>
  )
}
