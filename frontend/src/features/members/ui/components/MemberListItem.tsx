import type { FormEvent } from 'react'

import {
  dangerButtonClasses,
  inputClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../../ui/theme'
import type { Member, MemberDraft } from '../../domain/member'

type Props = {
  member: Member
  editingMemberId: number | null
  editDraft: MemberDraft
  onEditDraftChange: (draft: MemberDraft) => void
  onStartEditing: (member: Member) => void
  onCancelEditing: () => void
  onSubmitEdit: () => Promise<void>
  onDelete: (memberId: number) => Promise<void>
}

export function MemberListItem({
  member,
  editingMemberId,
  editDraft,
  onEditDraftChange,
  onStartEditing,
  onCancelEditing,
  onSubmitEdit,
  onDelete,
}: Props) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await onSubmitEdit()
  }

  return (
    <li className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {editingMemberId === member.id ? (
        <form className="space-y-3" onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600" htmlFor={`edit-member-name-${member.id}`}>
                Ime i prezime
              </label>
              <input
                className={inputClasses}
                id={`edit-member-name-${member.id}`}
                type="text"
                value={editDraft.fullName}
                onChange={(e) => onEditDraftChange({ ...editDraft, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600" htmlFor={`edit-member-phone-${member.id}`}>
                Telefon
              </label>
              <input
                className={inputClasses}
                id={`edit-member-phone-${member.id}`}
                type="text"
                value={editDraft.phone}
                onChange={(e) => onEditDraftChange({ ...editDraft, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600" htmlFor={`edit-member-team-${member.id}`}>
                Tim / uloga
              </label>
              <input
                className={inputClasses}
                id={`edit-member-team-${member.id}`}
                type="text"
                value={editDraft.team}
                onChange={(e) => onEditDraftChange({ ...editDraft, team: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className={primaryButtonClasses} type="submit" disabled={!editDraft.fullName.trim()}>
              Spremi izmjene
            </button>
            <button className={secondaryButtonClasses} type="button" onClick={onCancelEditing}>
              Otkaži
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-800">{member.fullName}</span>
            {member.team ? <span className="ml-2 text-sm text-slate-500">{member.team}</span> : null}
            {member.phone ? <span className="ml-2 text-sm text-slate-400">· {member.phone}</span> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={secondaryButtonClasses} type="button" onClick={() => onStartEditing(member)}>
              Uredi
            </button>
            <button className={dangerButtonClasses} type="button" onClick={() => void onDelete(member.id)}>
              Obriši
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
