import { useState } from 'react'
import { cardClasses, primaryButtonClasses } from '../../../ui/theme'
import { useCategories } from '../application/useCategories'
import { useInventory } from '../application/useInventory'
import { emptyInventoryItemDraft } from '../domain/inventoryItem'
import { InventoryCreateModal } from './components/InventoryCreateModal'
import { InventoryList } from './components/InventoryList'

export function InventoryPage() {
  const inventory = useInventory()
  const { categories } = useCategories()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const totalItems = inventory.items.length
  const totalUnits = inventory.items.reduce((sum, item) => sum + item.totalQuantity, 0)
  const availableUnits = inventory.items.reduce((sum, item) => sum + item.availableQuantity, 0)

  async function handleCreateSubmit() {
    await inventory.submitCreate()
    setShowCreateModal(false)
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className={cardClasses}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Skladište</p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">Inventar opreme</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Evidencija sve opreme GSS Zenica. Dodajte, uredite ili obrišite stavke i pratite dostupne količine.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
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
          <h2 className="font-display text-2xl text-slate-950">Sva oprema</h2>
          <div className="mt-4">
            <button className={primaryButtonClasses} onClick={() => setShowCreateModal(true)}>
              + Dodaj opremu
            </button>
            <div className="mt-6">
              <InventoryList
              items={inventory.items}
              editingItemId={inventory.editingItemId}
              editDraft={inventory.editDraft}
              availableCategories={categories}
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

      {showCreateModal && (
        <InventoryCreateModal
          draft={inventory.createDraft}
          availableCategories={categories}
          onDraftChange={inventory.setCreateDraft}
          onSubmit={handleCreateSubmit}
          onClose={() => {
            setShowCreateModal(false)
            inventory.setCreateDraft(emptyInventoryItemDraft)
          }}
          error={inventory.errors.create}
        />
      )}
    </div>
  )
}
