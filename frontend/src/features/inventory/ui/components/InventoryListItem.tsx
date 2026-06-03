import { useRef, useState, type FormEvent } from 'react'

import {
  dangerButtonClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../../ui/theme'
import { categoryLabel, type InventoryItem, type InventoryItemDraft } from '../../domain/inventoryItem'
import { ImageGallery } from './ImageGallery'
import { InventoryFormFields } from './InventoryFormFields'

type Props = {
  item: InventoryItem
  editingItemId: number | null
  editDraft: InventoryItemDraft
  onEditDraftChange: (draft: InventoryItemDraft) => void
  onStartEditing: (item: InventoryItem) => void
  onCancelEditing: () => void
  onSubmitEdit: () => Promise<void>
  onDelete: (itemId: number) => Promise<void>
  onUploadImages: (itemId: number, files: File[]) => Promise<void>
  onDeleteImage: (itemId: number, imageId: number) => Promise<void>
}

export function InventoryListItem({
  item,
  editingItemId,
  editDraft,
  onEditDraftChange,
  onStartEditing,
  onCancelEditing,
  onSubmitEdit,
  onDelete,
  onUploadImages,
  onDeleteImage,
}: Props) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await onSubmitEdit()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      await onUploadImages(item.id, files)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const inUse = item.totalQuantity - item.availableQuantity
  const lowStock = item.availableQuantity === 0
  const isEditing = editingItemId === item.id

  return (
    <li className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {isEditing ? (
        <div className="space-y-4">
          <form className="space-y-3" onSubmit={(e) => void handleSubmit(e)}>
            <InventoryFormFields draft={editDraft} idPrefix={`edit-item-${item.id}`} onDraftChange={onEditDraftChange} />
            <div className="flex gap-2">
              <button
                className={primaryButtonClasses}
                type="submit"
                disabled={!editDraft.name.trim() || editDraft.category === ''}
              >
                Spremi izmjene
              </button>
              <button className={secondaryButtonClasses} type="button" onClick={onCancelEditing}>
                Otkaži
              </button>
            </div>
          </form>

          {/* Image management section */}
          <div className="border-t border-slate-200 pt-3">
            <p className="mb-2 text-sm font-semibold text-slate-600 uppercase tracking-wide">Fotografije</p>
            <div className="flex flex-wrap gap-2">
              {item.images.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    alt=""
                    className="h-20 w-20 rounded-xl object-cover border border-slate-200 cursor-pointer"
                    onClick={() => setGalleryIndex(item.images.indexOf(img))}
                  />
                  <button
                    type="button"
                    onClick={() => void onDeleteImage(item.id, img.id)}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow"
                    aria-label="Obriši fotografiju"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Upload button */}
              <label
                className={`flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-slate-400 transition
                  ${uploading ? 'border-slate-200 opacity-50 cursor-not-allowed' : 'border-slate-300 hover:border-red-400 hover:text-red-500'}`}
              >
                {uploading ? (
                  <span className="text-xs text-center leading-tight px-1">Učitavam...</span>
                ) : (
                  <>
                    <span className="text-2xl leading-none">+</span>
                    <span className="text-xs mt-0.5">Dodaj</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => void handleFileChange(e)}
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Thumbnail strip (view mode) */}
          {item.images.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {item.images.slice(0, 5).map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className="shrink-0"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover border border-slate-200 hover:border-red-400 transition"
                  />
                </button>
              ))}
              {item.images.length > 5 && (
                <button
                  type="button"
                  onClick={() => setGalleryIndex(5)}
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-300 transition"
                >
                  +{item.images.length - 5}
                </button>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                  {categoryLabel(item.category)}
                </span>
              </div>
              {item.location ? <p className="mt-1 text-sm text-slate-500">{item.location}</p> : null}
              {item.description ? <p className="mt-1 text-sm text-slate-400">{item.description}</p> : null}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className="text-right">
                <p className={`text-lg font-bold ${lowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                  {item.availableQuantity} / {item.totalQuantity}
                </p>
                <p className="text-xs text-slate-400">dostupno{inUse > 0 ? ` · ${inUse} zaduženo` : ''}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button className={secondaryButtonClasses} type="button" onClick={() => onStartEditing(item)}>
                  Uredi
                </button>
                <button className={dangerButtonClasses} type="button" onClick={() => void onDelete(item.id)}>
                  Obriši
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {galleryIndex !== null && item.images.length > 0 && (
        <ImageGallery
          images={item.images}
          initialIndex={Math.min(galleryIndex, item.images.length - 1)}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </li>
  )
}
