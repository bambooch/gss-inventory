import { type FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { user, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
    } catch {
      setError('Pogrešno korisničko ime ili lozinka.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <img
          src="/gss-logo.png"
          alt="GSS Zenica"
          className="mx-auto mb-6 h-24 w-24 object-contain"
        />
        <h1 className="mb-8 text-center text-2xl font-bold text-white">GSS Zenica</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="rounded-lg bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Korisničko ime"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            className="rounded-lg bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Prijava…' : 'Prijava'}
          </button>
        </form>
      </div>
    </div>
  )
}
