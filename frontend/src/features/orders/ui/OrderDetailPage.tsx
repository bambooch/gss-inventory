import { Link, useParams } from 'react-router-dom'

import { OrderDetailPanel } from './components/OrderDetailPanel'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const orderId = id ? parseInt(id, 10) : NaN

  if (isNaN(orderId)) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold text-rose-700" role="alert">
            Nevažeći ID zaduženja.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link to="/zaduzenja" className="text-sm font-semibold text-red-700 underline hover:text-red-900">
          ← Nazad na zaduženja
        </Link>
        <OrderDetailPanel orderId={orderId} />
      </div>
    </div>
  )
}
