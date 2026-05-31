import { useState } from 'react'

import { useOrdersBoard } from '../application/useOrdersBoard'
import { summarizeOrders } from '../domain/orderPresentation'
import { OrderCreateModal } from './components/OrderCreateModal'
import { OrderList } from './components/OrderList'
import { OrderOverview } from './components/OrderOverview'

export function OrdersPage() {
  const board = useOrdersBoard()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const summary = summarizeOrders(board.orders)

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <OrderOverview
          total={summary.total}
          pending={summary.pending}
          late={summary.late}
          returned={summary.returned}
        />

        {board.errors.action ? (
          <p
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
            role="alert"
          >
            {board.errors.action}
          </p>
        ) : null}

        <OrderList
          orders={board.orders}
          onReturn={board.markReturned}
          onDelete={board.removeOrder}
          onCreateNew={() => setShowCreateModal(true)}
        />
      </div>

      {showCreateModal ? (
        <OrderCreateModal
          draft={board.createDraft}
          members={board.members}
          items={board.items}
          onDraftChange={board.setCreateDraft}
          onSubmit={board.submitCreate}
          error={board.errors.create}
          onClose={() => setShowCreateModal(false)}
        />
      ) : null}
    </div>
  )
}
