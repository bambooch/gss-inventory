import { cardClasses } from '../../../ui/theme'
import { useMembers } from '../application/useMembers'
import { MemberList } from './components/MemberList'

export function MembersPage() {
  const membersHook = useMembers()

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Registar</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">Članovi</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Upravljajte članovima službe. Članovima se dodjeljuju zaduženja opreme.
          </p>
        </div>

        <div className={cardClasses}>
          <MemberList
            members={membersHook.members}
            createDraft={membersHook.createDraft}
            onCreateDraftChange={membersHook.setCreateDraft}
            onSubmitCreate={membersHook.submitCreate}
            editingMemberId={membersHook.editingMemberId}
            editDraft={membersHook.editDraft}
            onEditDraftChange={membersHook.setEditDraft}
            onStartEditing={membersHook.startEditing}
            onCancelEditing={membersHook.cancelEditing}
            onSubmitEdit={membersHook.submitEdit}
            onDelete={membersHook.removeMember}
            errors={membersHook.errors}
          />
        </div>
      </div>
    </div>
  )
}
