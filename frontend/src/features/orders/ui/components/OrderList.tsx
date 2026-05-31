import { primaryButtonClasses } from '../../../../ui/theme'
import { orderAttention } from '../../domain/orderPresentation'
import type { OrderSummary } from '../../domain/orderSummary'
import { OrderListItem } from './OrderListItem'

type Props = {
  orders: OrderSummary[]
  onReturn: (orderId: number) => Promise<void>
  onDelete: (orderId: number) => Promise<void>
  onCreateNew: () => void
}

const attentionRank: Record<string, number> = {
  LATE: 0,
  DUE_SOON: 1,
  ACTIVE: 2,
  RETURNED: 3,
}

export function OrderList({ orders, onReturn, onDelete, onCreateNew }: Props) {
  const sorted = [...orders].sort((a, b) => {
    const rankDiff = attentionRank[orderAttention(a)] - attentionRank[orderAttention(b)]
    if (rankDiff !== 0) {
      return rankDiff
    }
    return a.dueDate.localeCompare(b.dueDate)
  })

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Tabla</p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">Sva zaduženja</h2>
        </div>
        <button className={primaryButtonClasses} type="button" onClick={onCreateNew}>
          + Novo zaduženje
        </button>
      </div>

      <ul className="mt-6 space-y-3 p-0" style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
        {sorted.map((order) => (
          <OrderListItem key={order.id} order={order} onReturn={onReturn} onDelete={onDelete} />
        ))}
      </ul>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
          Nema zaduženja.{' '}
          <button type="button" className="font-semibold text-red-700 underline hover:text-red-900" onClick={onCreateNew}>
            Kreirajte prvo
          </button>{' '}
          da pokrenete tablu.
        </div>
      ) : null}
    </section>
  )
}
