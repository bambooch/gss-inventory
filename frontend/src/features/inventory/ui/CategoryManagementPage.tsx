import { useState, type FormEvent, useMemo } from 'react'

import {
  cardClasses,
  dangerButtonClasses,
  inputClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../ui/theme'
import type { ItemCategory } from '../domain/inventoryItem'
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../infrastructure/inventoryCategoryApi'
import { useCategories } from '../application/useCategories'
import { CategoryCreateModal } from './components/CategoryCreateModal'

type DraftCategory = { name: string; label: string; sortOrder: string }
const emptyDraft: DraftCategory = { name: '', label: '', sortOrder: '' }

export function CategoryManagementPage() {
  const { categories, setCategories } = useCategories()
  const [draft, setDraft] = useState<DraftCategory>(emptyDraft)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<DraftCategory>(emptyDraft)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditConfirm, setShowEditConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return categories
    return categories.filter((cat) => cat.label.toLowerCase().includes(query) || cat.name.toLowerCase().includes(query))
  }, [categories, searchQuery])

  function toDraft(cat: ItemCategory): DraftCategory {
    return { name: cat.name, label: cat.label, sortOrder: String(cat.sortOrder) }
  }

  async function handleCreate() {
    setError('')
    try {
      const created = await createCategory(draft.name, draft.label, Number(draft.sortOrder) || 0)
      setCategories((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder))
      setDraft(emptyDraft)
      setShowCreateModal(false)
    } catch {
      setError('Nije moguće kreirati kategoriju.')
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    setShowEditConfirm(true)
  }

  async function confirmUpdate() {
    if (editingId === null) return
    setError('')
    setShowEditConfirm(false)
    try {
      const updated = await updateCategory(editingId, editDraft.name, editDraft.label, Number(editDraft.sortOrder) || 0)
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)).sort((a, b) => a.sortOrder - b.sortOrder),
      )
      setEditingId(null)
    } catch {
      setError('Nije moguće ažurirati kategoriju.')
    }
  }

  async function handleDelete(id: number) {
    setError('')
    setShowDeleteConfirm(null)
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setError('Nije moguće obrisati kategoriju. Možda ima opreme vezane za nju.')
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className={cardClasses}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Podešavanja</p>
          <h1 className="font-display text-4xl leading-tight">Kategorije</h1>
          <p className="mt-2 text-slate-600">
            Upravljajte kategorijama opreme. Oprema može imati više kategorija ili nijednu.
          </p>
        </div>

        <div className={cardClasses}>
          <button className={primaryButtonClasses} onClick={() => setShowCreateModal(true)}>
            + Dodaj kategoriju
          </button>
          {error ? (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className={cardClasses}>
          <h2 className="font-display text-2xl text-slate-950">Sve kategorije</h2>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              className={inputClasses}
              placeholder="Pretraži kategorije..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredCategories.length === 0 && (
              <p className="text-sm text-slate-500">{categories.length === 0 ? 'Nema definisanih kategorija.' : 'Nema rezultata pretrage.'}</p>
            )}
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                {editingId === cat.id ? (
                  <form className="space-y-3" onSubmit={(e) => void handleUpdate(e)}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Ključ</label>
                        <input
                          className={inputClasses}
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value.toUpperCase() })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Naziv za prikaz</label>
                        <input
                          className={inputClasses}
                          value={editDraft.label}
                          onChange={(e) => setEditDraft({ ...editDraft, label: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="w-36 space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Redoslijed</label>
                        <input
                          className={inputClasses}
                          type="number"
                          min={0}
                          value={editDraft.sortOrder}
                          onChange={(e) => setEditDraft({ ...editDraft, sortOrder: e.target.value })}
                        />
                      </div>
                      <button className={primaryButtonClasses} type="submit">Spremi</button>
                      <button
                        className={secondaryButtonClasses}
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Otkaži
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{cat.label}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{cat.name}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        className={secondaryButtonClasses}
                        type="button"
                        onClick={() => { setEditingId(cat.id); setEditDraft(toDraft(cat)) }}
                      >
                        Uredi
                      </button>
                      <button
                        className={dangerButtonClasses}
                        type="button"
                        onClick={() => setShowDeleteConfirm(cat.id)}
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CategoryCreateModal
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={handleCreate}
          onClose={() => {
            setShowCreateModal(false)
            setDraft(emptyDraft)
          }}
          error={error}
        />
      )}

      {showEditConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" onClick={() => setShowEditConfirm(false)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.3)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-950">Potvrdi ažuriranje</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Kategorija</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{editDraft.label || 'Nije navedeno'}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={primaryButtonClasses}
                onClick={confirmUpdate}
              >
                Potvrdi
              </button>
              <button
                type="button"
                className={secondaryButtonClasses}
                onClick={() => setShowEditConfirm(false)}
              >
                Nazad
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" onClick={() => setShowDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.3)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-950">Obriši kategoriju?</h3>
            <p className="mt-3 text-sm text-slate-600">Ova akcija se ne može poništiti. Kategorija će biti trajno obrisana.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={primaryButtonClasses}
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Obriši
              </button>
              <button
                type="button"
                className={secondaryButtonClasses}
                onClick={() => setShowDeleteConfirm(null)}
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
