import type { FormEvent } from 'react'

import { inputClasses, primaryButtonClasses } from '../../../../ui/theme'
import type { MemberDraft } from '../../domain/member'

type Props = {
  draft: MemberDraft
  onDraftChange: (draft: MemberDraft) => void
  onSubmit: () => Promise<void>
}

export function MemberCreateForm({ draft, onDraftChange, onSubmit }: Props) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <form className="space-y-3" onSubmit={(e) => void handleSubmit(e)}>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="member-name">
            Ime i prezime
          </label>
          <input
            className={inputClasses}
            id="member-name"
            name="fullName"
            type="text"
            value={draft.fullName}
            onChange={(e) => onDraftChange({ ...draft, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="member-phone">
            Telefon <span className="font-normal text-slate-400">(opcionalno)</span>
          </label>
          <input
            className={inputClasses}
            id="member-phone"
            name="phone"
            type="text"
            value={draft.phone}
            onChange={(e) => onDraftChange({ ...draft, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="member-team">
            Tim / uloga <span className="font-normal text-slate-400">(opcionalno)</span>
          </label>
          <input
            className={inputClasses}
            id="member-team"
            name="team"
            type="text"
            value={draft.team}
            onChange={(e) => onDraftChange({ ...draft, team: e.target.value })}
          />
        </div>
      </div>
      <button className={primaryButtonClasses} type="submit" disabled={!draft.fullName.trim()}>
        Dodaj člana
      </button>
    </form>
  )
}
