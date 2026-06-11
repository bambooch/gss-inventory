import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { InventoryItem } from '../../../inventory/domain/inventoryItem'
import { getItemUsageCounts } from '../../infrastructure/itemUsage'
import { inputClasses } from '../../../../ui/theme'

type Props = {
  id: string
  items: InventoryItem[]
  value: number | ''
  onChange: (itemId: number | '') => void
}

type DropdownPos = { top: number; left: number; width: number }

function sortedItems(items: InventoryItem[], usageCounts: Record<number, number>): InventoryItem[] {
  return [...items].sort((a, b) => {
    const aAvail = a.availableQuantity > 0 ? 1 : 0
    const bAvail = b.availableQuantity > 0 ? 1 : 0
    if (aAvail !== bAvail) return bAvail - aAvail
    const aUsage = usageCounts[a.id] ?? 0
    const bUsage = usageCounts[b.id] ?? 0
    if (aUsage !== bUsage) return bUsage - aUsage
    return a.name.localeCompare(b.name)
  })
}

export function ItemCombobox({ id, items, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [dropdownPos, setDropdownPos] = useState<DropdownPos>({ top: 0, left: 0, width: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const usageCounts = useMemo(() => getItemUsageCounts(), [open])
  const sorted = useMemo(() => sortedItems(items, usageCounts), [items, usageCounts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q === '' ? sorted : sorted.filter((i) => i.name.toLowerCase().includes(q))
  }, [sorted, query])

  const selectedItem = items.find((i) => i.id === value)

  function openDropdown() {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setQuery('')
    setActiveIndex(0)
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function selectItem(item: InventoryItem) {
    if (item.availableQuantity === 0) return
    onChange(item.id)
    setOpen(false)
    setQuery('')
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      openDropdown()
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); const item = filtered[activeIndex]; if (item) selectItem(item) }
  }

  useEffect(() => {
    if (!open) return
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (listRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onScroll(e: Event) {
      if (e.target === window || e.target === document) {
        setOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [open])

  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const dropdown = (
    <ul
      ref={listRef}
      role="listbox"
      style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }}
      className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-xl"
    >
      {filtered.length === 0 ? (
        <li className="px-4 py-3 text-sm text-slate-400">Nema rezultata</li>
      ) : (
        filtered.map((item, idx) => {
          const isActive = idx === activeIndex
          const isUnavailable = item.availableQuantity === 0
          const isSelected = item.id === value
          return (
            <li
              key={item.id}
              data-index={idx}
              role="option"
              aria-selected={isSelected}
              aria-disabled={isUnavailable}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => selectItem(item)}
              className={[
                'flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors',
                isUnavailable ? 'cursor-not-allowed opacity-40' : '',
                isActive && !isUnavailable ? 'bg-red-50' : '',
                isSelected ? 'font-semibold text-red-700' : 'text-slate-800',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="truncate">{item.name}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  item.availableQuantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.availableQuantity}
              </span>
            </li>
          )
        })
      )}
    </ul>
  )

  return (
    <div ref={containerRef} className="relative">
      {open ? (
        <input
          ref={inputRef}
          type="text"
          className={inputClasses}
          placeholder="Pretraži opremu..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
        />
      ) : (
        <button
          type="button"
          id={id}
          onClick={openDropdown}
          onKeyDown={handleTriggerKeyDown}
          className={`${inputClasses} flex items-center gap-2 text-left`}
        >
          <span className={`flex-1 truncate ${!selectedItem ? 'text-slate-400' : 'text-slate-900'}`}>
            {selectedItem ? selectedItem.name : 'Odaberite opremu'}
          </span>
          {selectedItem ? (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                selectedItem.availableQuantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {selectedItem.availableQuantity}
            </span>
          ) : null}
          <svg className="shrink-0 text-slate-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {open ? createPortal(dropdown, document.body) : null}
    </div>
  )
}
