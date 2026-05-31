import type { Member, MemberDraft } from '../domain/member'

export async function listMembers(): Promise<Member[]> {
  const response = await fetch('/api/members')
  return (await response.json()) as Member[]
}

export async function createMember(draft: MemberDraft): Promise<Member> {
  const response = await fetch('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  })
  if (!response.ok) throw new Error('Could not create member.')
  return (await response.json()) as Member
}

export async function updateMember(memberId: number, draft: MemberDraft): Promise<Member> {
  const response = await fetch(`/api/members/${memberId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  })
  if (!response.ok) throw new Error('Could not update member.')
  return (await response.json()) as Member
}

export async function deleteMember(memberId: number): Promise<void> {
  const response = await fetch(`/api/members/${memberId}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Could not delete member.')
}
