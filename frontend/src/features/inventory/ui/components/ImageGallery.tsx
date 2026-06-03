import { useEffect, useState } from 'react'
import type { ItemImage } from '../../domain/inventoryItem'

type Props = {
  images: ItemImage[]
  initialIndex: number
  onClose: () => void
}

export function ImageGallery({ images, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(images.length - 1, i + 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main image */}
        <div className="relative overflow-hidden rounded-2xl bg-black">
          <img
            src={images[idx].url}
            alt=""
            className="max-h-[75vh] w-full object-contain"
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Zatvori"
          >
            ✕
          </button>

          {/* Prev */}
          {idx > 0 && (
            <button
              onClick={() => setIdx((i) => i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Prethodna"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {idx < images.length - 1 && (
            <button
              onClick={() => setIdx((i) => i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Sljedeća"
            >
              ›
            </button>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setIdx(i)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === idx ? 'border-white' : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        <p className="text-center text-sm text-white/70">
          {idx + 1} / {images.length}
        </p>
      </div>
    </div>
  )
}
