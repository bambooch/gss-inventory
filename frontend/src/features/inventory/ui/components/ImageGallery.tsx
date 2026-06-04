import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ItemImage } from '../../domain/inventoryItem'

type Props = {
  images: ItemImage[]
  initialIndex: number
  onClose: () => void
}

export function ImageGallery({ images, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex)

  // keyboard nav + body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(images.length - 1, i + 1))
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [images.length, onClose])

  const hasPrev = idx > 0
  const hasNext = idx < images.length - 1

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-4xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Main image ───────────────────────────────────────────── */}
        <div className="relative flex w-full items-center justify-center">
          {/* Prev arrow */}
          <button
            onClick={() => setIdx((i) => i - 1)}
            disabled={!hasPrev}
            className={`absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white text-2xl font-light backdrop-blur-sm transition hover:bg-white/25 disabled:invisible`}
            aria-label="Prethodna"
          >
            ‹
          </button>

          <div className="relative mx-14 overflow-hidden rounded-2xl bg-black shadow-2xl">
            <img
              key={images[idx].url}
              src={images[idx].url}
              alt=""
              className="max-h-[70vh] max-w-full object-contain"
              style={{ minWidth: 200, display: 'block' }}
            />
          </div>

          {/* Next arrow */}
          <button
            onClick={() => setIdx((i) => i + 1)}
            disabled={!hasNext}
            className={`absolute right-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white text-2xl font-light backdrop-blur-sm transition hover:bg-white/25 disabled:invisible`}
            aria-label="Sljedeća"
          >
            ›
          </button>
        </div>

        {/* ── Thumbnail strip (only for multiple images) ───────────── */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto py-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setIdx(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition focus:outline-none ${
                  i === idx
                    ? 'border-white scale-105 shadow-lg'
                    : 'border-white/20 opacity-50 hover:opacity-90 hover:border-white/60'
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* ── Counter + close ──────────────────────────────────────── */}
        <div className="flex items-center gap-6">
          {images.length > 1 && (
            <span className="text-sm text-white/60 tabular-nums">
              {idx + 1} / {images.length}
            </span>
          )}
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-5 py-1.5 text-sm text-white/80 backdrop-blur-sm hover:bg-white/10 transition"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
