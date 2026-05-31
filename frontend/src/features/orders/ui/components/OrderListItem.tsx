import { useState } from 'react'
import { Link } from 'react-router-dom'

import { dangerButtonClasses, primaryButtonClasses, secondaryButtonClasses } from '../../../../ui/theme'
import {
  attentionBadgeClasses,
  attentionLabels,
  formatDate,
  orderAttention,
  orderStatusLabels,
  statusBadgeClasses,
} from '../../domain/orderPresentation'
import type { OrderSummary } from '../../domain/orderSummary'

type Props = {
  order: OrderSummary
  onReturn: (orderId: number) => Promise<void>
  onDelete: (orderId: number) => Promise<void>
}

export function OrderListItem({ order, onReturn, onDelete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const attention = orderAttention(order)
  const isActive = order.status === 'AKTIVNO'

  return (
    <li className="group rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to={`/zaduzenja/${order.id}`} className="flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl text-slate-950 transition-colors group-hover:text-slate-700 sm:text-2xl">
              {order.memberName}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${attentionBadgeClasses[attention]}`}
            >
              {attentionLabels[attention]}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusBadgeClasses[order.status] ?? 'bg-slate-200 text-slate-800 ring-1 ring-inset ring-slate-300'}`}
            >
              {orderStatusLabels[order.status] ?? order.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Rok za povrat: <span className="font-semibold text-slate-700">{formatDate(order.dueDate)}</span>
            {' · '}
            {order.itemCount} {order.itemCount === 1 ? 'komad' : 'komada'} opreme
          </p>
        </Link>

        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          {showDeleteConfirm ? (
            <>
              <span className="text-sm font-semibold text-rose-700">Obrisati?</span>
              <button
                type="button"
                className={dangerButtonClasses}
                onClick={() => void onDelete(order.id).then(() => setShowDeleteConfirm(false))}
              >
                Potvrdi
              </button>
              <button type="button" className={secondaryButtonClasses} onClick={() => setShowDeleteConfirm(false)}>
                Otkaži
              </button>
            </>
          ) : (
            <>
              {isActive ? (
                <button type="button" className={primaryButtonClasses} onClick={() => void onReturn(order.id)}>
                  Označi vraćeno
                </button>
              ) : null}
              <Link to={`/zaduzenja/${order.id}`} className={secondaryButtonClasses}>
                Detalji →
              </Link>
              <button type="button" className={dangerButtonClasses} onClick={() => setShowDeleteConfirm(true)}>
                Obriši
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}
