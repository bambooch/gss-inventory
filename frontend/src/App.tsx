import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './features/auth/AuthContext'
import { LoginPage } from './features/auth/LoginPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { NavBar } from './components/NavBar'
import { InventoryPage } from './features/inventory/ui/InventoryPage'
import { MembersPage } from './features/members/ui/MembersPage'
import { OrderDetailPage } from './features/orders/ui/OrderDetailPage'
import { OrdersPage } from './features/orders/ui/OrdersPage'

function App() {
  return (
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
