type Props = {
  total: number
  pending: number
  late: number
  returned: number
}

export function OrderOverview({ total, pending, late, returned }: Props) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Kontrolna tabla</p>
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">Zaduženja opreme</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Pregled svih zaduženja. Pratite aktivna i istekla zaduženja i evidentirajte povrat opreme.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <article className="rounded-3xl bg-slate-950 px-5 py-4 text-left text-slate-50 shadow-lg">
          <p className="text-sm uppercase tracking-[0.24em] text-red-300">Ukupno</p>
          <p className="mt-3 text-3xl font-semibold">{total}</p>
        </article>
        <article className="rounded-3xl border border-sky-200 bg-sky-50 px-5 py-4 text-left shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-700">Aktivna</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{pending}</p>
        </article>
        <article className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-left shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-rose-700">Istekao rok</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{late}</p>
        </article>
        <article className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Vraćena</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{returned}</p>
        </article>
      </div>
    </div>
  )
}
