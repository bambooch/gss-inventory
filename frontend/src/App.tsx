import { Component } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './features/auth/AuthContext'
import { LoginPage } from './features/auth/LoginPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { NavBar } from './components/NavBar'
import { InventoryPage } from './features/inventory/ui/InventoryPage'
import { MembersPage } from './features/members/ui/MembersPage'
import { OrderDetailPage } from './features/orders/ui/OrderDetailPage'
import { OrdersPage } from './features/orders/ui/OrdersPage'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8">
          <div className="max-w-lg text-center">
            <p className="text-lg font-semibold text-red-400">Greška pri učitavanju aplikacije</p>
            <pre className="mt-4 overflow-auto rounded-lg bg-slate-900 p-4 text-left text-xs text-slate-300">
              {(this.state.error as Error).message}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  )
}

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/zaduzenja" replace />} />
          <Route path="/zaduzenja" element={<OrdersPage />} />
          <Route path="/zaduzenja/:id" element={<OrderDetailPage />} />
          <Route path="/inventar" element={<InventoryPage />} />
          <Route path="/clanovi" element={<MembersPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
