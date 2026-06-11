import { useState, useMemo } from 'react'
import type { Member, MemberDraft } from '../../domain/member'
import { inputClasses, primaryButtonClasses, secondaryButtonClasses } from '../../../../ui/theme'
import { MemberListItem } from './MemberListItem'

type Props = {
  members: Member[]
  editingMemberId: number | null
  editDraft: MemberDraft
  onEditDraftChange: (draft: MemberDraft) => void
  onStartEditing: (member: Member) => void
  onCancelEditing: () => void
  onSubmitEdit: () => Promise<void>
  onDelete: (memberId: number) => Promise<void>
  errors: { create: string; edit: string; delete: string }
}

export function MemberList({
  members,
  editingMemberId,
  editDraft,
  onEditDraftChange,
  onStartEditing,
  onCancelEditing,
  onSubmitEdit,
  onDelete,
  errors,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return members
    return members.filter((member) => member.fullName.toLowerCase().includes(query) || member.team?.toLowerCase().includes(query))
  }, [members, searchQuery])

  async function handleDelete(memberId: number) {
    await onDelete(memberId)
    setConfirmDeleteId(null)
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        className={inputClasses}
        placeholder="Pretraži člana..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {errors.create ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
          {errors.create}
        </p>
      ) : null}
      {errors.edit ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
          {errors.edit}
        </p>
      ) : null}
      {errors.delete ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
          {errors.delete}
        </p>
      ) : null}

      <ul className="space-y-3 list-none p-0 m-0">
        {filteredMembers.map((member) => (
          <MemberListItem
            key={member.id}
            member={member}
            editingMemberId={editingMemberId}
            editDraft={editDraft}
            onEditDraftChange={onEditDraftChange}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onSubmitEdit={onSubmitEdit}
            onDelete={async (memberId) => setConfirmDeleteId(memberId)}
          />
        ))}
      </ul>

      {filteredMembers.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          {members.length === 0 ? 'Nema članova. Dodajte prvog da biste mogli kreirati zaduženja.' : 'Nema rezultata pretrage.'}
        </div>
      ) : null}

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" onClick={() => setConfirmDeleteId(null)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.3)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-950">Obriši člana?</h3>
            <p className="mt-3 text-sm text-slate-600">Ova akcija se ne može poništiti. Svi podaci člana će biti trajno obrisani.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={primaryButtonClasses}
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Obriši
              </button>
              <button
                type="button"
                className={secondaryButtonClasses}
                onClick={() => setConfirmDeleteId(null)}
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
