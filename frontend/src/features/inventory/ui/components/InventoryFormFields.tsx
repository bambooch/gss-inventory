import { inputClasses } from '../../../../ui/theme'
import { itemCategoryLabels, itemCategoryOptions, type InventoryItemDraft } from '../../domain/inventoryItem'

type Props = {
  draft: InventoryItemDraft
  idPrefix: string
  onDraftChange: (draft: InventoryItemDraft) => void
}

/** Shared name/category/location/quantity/description fields for create + edit forms. */
export function InventoryFormFields({ draft, idPrefix, onDraftChange }: Props) {
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
          <label className="text-sm font-semibold text-slate-700" htmlFor={`${idPrefix}-category`}>
            Kategorija
          </label>
          <select
            className={inputClasses}
            id={`${idPrefix}-category`}
            value={draft.category}
            onChange={(e) => onDraftChange({ ...draft, category: e.target.value as InventoryItemDraft['category'] })}
          >
            <option value="" disabled>
              Odaberite kategoriju
            </option>
            {itemCategoryOptions.map((option) => (
              <option key={option} value={option}>
                {itemCategoryLabels[option]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700" htmlFor={`${idPrefix}-description`}>
          Opis <span className="font-normal text-slate-400">(opcionalno)</span>
        </label>
        <textarea
          className={`${inputClasses} min-h-[4.5rem] resize-y`}
          id={`${idPrefix}-description`}
          value={draft.description}
          onChange={(e) => onDraftChange({ ...draft, description: e.target.value })}
        />
      </div>
    </>
  )
}
