import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Member } from '../../../members/domain/member'
import { getMemberUsageCounts } from '../../infrastructure/itemUsage'
import { inputClasses } from '../../../../ui/theme'

type Props = {
  id: string
  members: Member[]
  value: number | ''
  onChange: (memberId: number | '') => void
}

type DropdownPos = { top: number; left: number; width: number }

function sortedMembers(members: Member[], usageCounts: Record<number, number>): Member[] {
  return [...members].sort((a, b) => {
    const aUsage = usageCounts[a.id] ?? 0
    const bUsage = usageCounts[b.id] ?? 0
    if (aUsage !== bUsage) return bUsage - aUsage
    return a.fullName.localeCompare(b.fullName)
  })
}

export function MemberCombobox({ id, members, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [dropdownPos, setDropdownPos] = useState<DropdownPos>({ top: 0, left: 0, width: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const usageCounts = useMemo(() => getMemberUsageCounts(), [open])
  const sorted = useMemo(() => sortedMembers(members, usageCounts), [members, usageCounts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q === '' ? sorted : sorted.filter((m) => m.fullName.toLowerCase().includes(q) || m.team?.toLowerCase().includes(q))
  }, [sorted, query])

  const selectedMember = members.find((m) => m.id === value)

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

  function selectMember(member: Member) {
    onChange(member.id)
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
    else if (e.key === 'Enter') { e.preventDefault(); const m = filtered[activeIndex]; if (m) selectMember(m) }
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
        filtered.map((member, idx) => {
          const isActive = idx === activeIndex
          const isSelected = member.id === value
          return (
            <li
              key={member.id}
              data-index={idx}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => selectMember(member)}
              className={[
                'flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors',
                isActive ? 'bg-red-50' : '',
                isSelected ? 'font-semibold text-red-700' : 'text-slate-800',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="truncate">{member.fullName}</span>
              {member.team ? (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {member.team}
                </span>
              ) : null}
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
          placeholder="Pretraži člana..."
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
          <span className={`flex-1 truncate ${!selectedMember ? 'text-slate-400' : 'text-slate-900'}`}>
            {selectedMember ? selectedMember.fullName : 'Odaberite člana'}
          </span>
          {selectedMember?.team ? (
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {selectedMember.team}
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
