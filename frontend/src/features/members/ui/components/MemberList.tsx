import type { Member, MemberDraft } from '../../domain/member'
import { MemberCreateForm } from './MemberCreateForm'
import { MemberListItem } from './MemberListItem'

type Props = {
  members: Member[]
  createDraft: MemberDraft
  onCreateDraftChange: (draft: MemberDraft) => void
  onSubmitCreate: () => Promise<void>
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
  createDraft,
  onCreateDraftChange,
  onSubmitCreate,
  editingMemberId,
  editDraft,
  onEditDraftChange,
  onStartEditing,
  onCancelEditing,
  onSubmitEdit,
  onDelete,
  errors,
}: Props) {
  return (
    <div className="space-y-4">
      <MemberCreateForm draft={createDraft} onDraftChange={onCreateDraftChange} onSubmit={onSubmitCreate} />

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
        {members.map((member) => (
          <MemberListItem
            key={member.id}
            member={member}
            editingMemberId={editingMemberId}
            editDraft={editDraft}
            onEditDraftChange={onEditDraftChange}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onSubmitEdit={onSubmitEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {members.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          Nema članova. Dodajte prvog da biste mogli kreirati zaduženja.
        </div>
      ) : null}
    </div>
  )
}
