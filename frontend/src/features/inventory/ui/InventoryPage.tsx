import { cardClasses } from '../../../ui/theme'
import { useInventory } from '../application/useInventory'
import { InventoryCreateForm } from './components/InventoryCreateForm'
import { InventoryList } from './components/InventoryList'

export function InventoryPage() {
  const inventory = useInventory()

  const totalItems = inventory.items.length
  const totalUnits = inventory.items.reduce((sum, item) => sum + item.totalQuantity, 0)
  const availableUnits = inventory.items.reduce((sum, item) => sum + item.availableQuantity, 0)

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className={cardClasses}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Skladište</p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">Inventar opreme</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Evidencija sve opreme GSS Zenica. Dodajte, uredite ili obrišite stavke i pratite dostupne količine.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-3xl bg-slate-950 px-5 py-4 text-left text-slate-50 shadow-lg">
              <p className="text-sm uppercase tracking-[0.24em] text-red-300">Vrsta opreme</p>
              <p className="mt-3 text-3xl font-semibold">{totalItems}</p>
            </article>
            <article className="rounded-3xl border border-sky-200 bg-sky-50 px-5 py-4 text-left shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-700">Ukupno komada</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{totalUnits}</p>
            </article>
            <article className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Dostupno</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{availableUnits}</p>
            </article>
          </div>
        </div>

        <div className={cardClasses}>
          <h2 className="font-display text-2xl text-slate-950">Nova oprema</h2>
          <div className="mt-4">
            <InventoryCreateForm
              draft={inventory.createDraft}
              onDraftChange={inventory.setCreateDraft}
              onSubmit={inventory.submitCreate}
            />
            {inventory.errors.create ? (
              <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
                {inventory.errors.create}
              </p>
            ) : null}
          </div>
        </div>

        <div className={cardClasses}>
          <h2 className="font-display text-2xl text-slate-950">Sva oprema</h2>
          <div className="mt-4">
            <InventoryList
              items={inventory.items}
              editingItemId={inventory.editingItemId}
              editDraft={inventory.editDraft}
              onEditDraftChange={inventory.setEditDraft}
              onStartEditing={inventory.startEditing}
              onCancelEditing={inventory.cancelEditing}
              onSubmitEdit={inventory.submitEdit}
              onDelete={inventory.removeItem}
              onUploadImages={inventory.uploadItemImages}
              onDeleteImage={inventory.deleteItemImage}
              errors={inventory.errors}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
