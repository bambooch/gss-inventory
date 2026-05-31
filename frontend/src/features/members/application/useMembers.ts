import { useEffect, useState } from 'react'

import { emptyMemberDraft, type Member, type MemberDraft } from '../domain/member'
import { createMember, deleteMember, listMembers, updateMember } from '../infrastructure/memberApi'

type MemberErrors = { create: string; edit: string; delete: string }
const emptyErrors: MemberErrors = { create: '', edit: '', delete: '' }

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [createDraft, setCreateDraft] = useState<MemberDraft>(emptyMemberDraft)
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<MemberDraft>(emptyMemberDraft)
  const [errors, setErrors] = useState<MemberErrors>(emptyErrors)

  useEffect(() => {
    const load = async () => {
      setMembers(await listMembers())
    }
    void load()
  }, [])

  async function submitCreate() {
    setErrors((e) => ({ ...e, create: '' }))
    try {
      const member = await createMember(createDraft)
      setMembers((prev) => [...prev, member])
      setCreateDraft(emptyMemberDraft)
    } catch {
      setErrors((e) => ({ ...e, create: 'Nije moguće kreirati člana.' }))
    }
  }

  function startEditing(member: Member) {
    setEditingMemberId(member.id)
    setEditDraft({ fullName: member.fullName, phone: member.phone ?? '', team: member.team ?? '' })
    setErrors((e) => ({ ...e, edit: '' }))
  }

  function cancelEditing() {
    setEditingMemberId(null)
    setEditDraft(emptyMemberDraft)
  }

  async function submitEdit() {
    if (editingMemberId === null) return
    setErrors((e) => ({ ...e, edit: '' }))
    try {
      const updated = await updateMember(editingMemberId, editDraft)
      setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      cancelEditing()
    } catch {
      setErrors((e) => ({ ...e, edit: 'Nije moguće ažurirati člana.' }))
    }
  }

  async function removeMember(memberId: number) {
    setErrors((e) => ({ ...e, delete: '' }))
    try {
      await deleteMember(memberId)
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
      if (editingMemberId === memberId) cancelEditing()
    } catch {
      setErrors((e) => ({ ...e, delete: 'Nije moguće obrisati člana.' }))
    }
  }

  return {
    members,
    createDraft,
    setCreateDraft,
    editingMemberId,
    editDraft,
    setEditDraft,
    errors,
    submitCreate,
    startEditing,
    cancelEditing,
    submitEdit,
    removeMember,
  }
}
