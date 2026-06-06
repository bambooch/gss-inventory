import { inputClasses } from '../../../../ui/theme'
import type { ItemCategory, InventoryItemDraft } from '../../domain/inventoryItem'

type Props = {
  draft: InventoryItemDraft
  idPrefix: string
  availableCategories: ItemCategory[]
  onDraftChange: (draft: InventoryItemDraft) => void
}

export function InventoryFormFields({ draft, idPrefix, availableCategories, onDraftChange }: Props) {
  function toggleCategory(id: number) {
    const next = draft.categoryIds.includes(id)
      ? draft.categoryIds.filter((c) => c !== id)
      : [...draft.categoryIds, id]
    onDraftChange({ ...draft, categoryIds: next })
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700" htmlFor={`${idPrefix}-name`}>
            Naziv opreme
          </label>
          <input
            className={inputClasses}
            id={`${idPrefix}-name`}
            type="text"
            value={draft.name}
            onChange={(e) => onDraftChange({ ...draft, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700" htmlFor={`${idPrefix}-location`}>
            Lokacija <span className="font-normal text-slate-400">(opcionalno)</span>
          </label>
          <input
            className={inputClasses}
            id={`${idPrefix}-location`}
            type="text"
            value={draft.location}
            onChange={(e) => onDraftChange({ ...draft, location: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-slate-700">
          Kategorije <span className="font-normal text-slate-400">(opcionalno, može više)</span>
        </p>
        {availableCategories.length === 0 ? (
          <p className="text-sm text-slate-400">Nema definisanih kategorija.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const checked = draft.categoryIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    checked
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-red-400 hover:text-red-600'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700" htmlFor={`${idPrefix}-quantity`}>
            Ukupna količina
          </label>
          <input
            className={inputClasses}
            id={`${idPrefix}-quantity`}
            type="number"
            min={0}
            value={draft.totalQuantity}
            onChange={(e) => onDraftChange({ ...draft, totalQuantity: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700" htmlFor={`${idPrefix}-description`}>
            Opis <span className="font-normal text-slate-400">(opcionalno)</span>
          </label>
          <textarea
            className={`${inputClasses} min-h-[2.5rem] resize-y`}
            id={`${idPrefix}-description`}
            value={draft.description}
            onChange={(e) => onDraftChange({ ...draft, description: e.target.value })}
          />
        </div>
      </div>
    </>
  )
}
