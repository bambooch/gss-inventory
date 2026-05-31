import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { dangerButtonClasses, primaryButtonClasses, secondaryButtonClasses } from '../../../../ui/theme'
import type { OrderDetail } from '../../domain/orderDetail'
import {
  attentionBadgeClasses,
  attentionLabels,
  formatDate,
  orderAttention,
  orderStatusLabels,
  statusBadgeClasses,
} from '../../domain/orderPresentation'
import { deleteOrder, getOrderDetail, returnOrder } from '../../infrastructure/orderApi'

type ContentProps = {
  detail: OrderDetail
  onDetailChange: (detail: OrderDetail) => void
}

function OrderDetailContent({ detail, onDetailChange }: ContentProps) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [actionError, setActionError] = useState('')

  const attention = orderAttention(detail)
  const isActive = detail.status === 'AKTIVNO'

  async function handleReturn() {
    setActionError('')
    try {
      const updated = await returnOrder(detail.id)
      onDetailChange(updated)
    } catch {
      setActionError('Nije moguće označiti zaduženje kao vraćeno.')
    }
  }

  async function handleDelete() {
    setActionError('')
    try {
      await deleteOrder(detail.id)
      navigate('/zaduzenja')
    } catch {
      setActionError('Nije moguće obrisati zaduženje.')
      setShowDeleteConfirm(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Zaduženje #{detail.id}</p>
            <h1 className="mt-2 font-display text-2xl text-slate-950 sm:text-3xl">{detail.memberName}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${attentionBadgeClasses[attention]}`}
              >
                {attentionLabels[attention]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusBadgeClasses[detail.status] ?? 'bg-slate-200 text-slate-800 ring-1 ring-inset ring-slate-300'}`}
              >
                {orderStatusLabels[detail.status] ?? detail.status}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isActive ? (
              <button type="button" className={primaryButtonClasses} onClick={() => void handleReturn()}>
                Označi vraćeno
              </button>
            ) : null}
            {showDeleteConfirm ? (
              <>
                <span className="text-sm font-semibold text-rose-700">Obrisati?</span>
                <button type="button" className={dangerButtonClasses} onClick={() => void handleDelete()}>
                  Potvrdi
                </button>
                <button type="button" className={secondaryButtonClasses} onClick={() => setShowDeleteConfirm(false)}>
                  Otkaži
                </button>
              </>
            ) : (
              <button type="button" className={dangerButtonClasses} onClick={() => setShowDeleteConfirm(true)}>
                Obriši
              </button>
            )}
          </div>
        </div>

        {actionError ? (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
            {actionError}
          </p>
        ) : null}
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Izdato</p>
            <p className="mt-1 font-semibold text-slate-800">{formatDate(detail.issuedAt)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Rok za povrat</p>
            <p className="mt-1 font-semibold text-slate-800">{formatDate(detail.dueDate)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Vraćeno</p>
            <p className="mt-1 font-semibold text-slate-800">{formatDate(detail.returnedAt)}</p>
          </div>
        </div>

        {detail.note ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Napomena</p>
            <p className="mt-1 text-slate-700">{detail.note}</p>
          </div>
        ) : null}

        <div>
          <h2 className="font-display text-xl text-slate-950">Zadužena oprema</h2>
          <ul className="mt-3 space-y-2 list-none p-0 m-0">
            {detail.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <span className="font-semibold text-slate-800">{line.itemName}</span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                  {line.quantity} kom
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

type PanelProps = {
  orderId: number
}

export function OrderDetailPanel({ orderId }: PanelProps) {
  const [detail, setDetail] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    setLoading(true)
    setLoadError('')
    setDetail(null)

    const load = async () => {
      try {
        setDetail(await getOrderDetail(orderId))
      } catch {
        setLoadError('Nije moguće učitati detalje zaduženja.')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [orderId])

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
        <p className="text-sm text-slate-500">Učitavanje detalja…</p>
      </section>
    )
  }

  if (loadError || !detail) {
    return (
      <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
        <p className="text-sm font-semibold text-rose-700" role="alert">
          {loadError}
        </p>
      </section>
    )
  }

  return <OrderDetailContent detail={detail} onDetailChange={setDetail} />
}
