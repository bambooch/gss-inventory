export type Member = {
  id: number
  fullName: string
  phone: string | null
  team: string | null
}

export type MemberDraft = {
  fullName: string
  phone: string
  team: string
}

export const emptyMemberDraft: MemberDraft = {
  fullName: '',
  phone: '',
  team: '',
}
