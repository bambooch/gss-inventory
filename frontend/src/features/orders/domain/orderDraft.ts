export type OrderLineDraft = {
  itemId: number | ''
  quantity: number
}

export type OrderDraft = {
  memberId: number | ''
  dueDate: string
  note: string
  lines: OrderLineDraft[]
}

export const emptyOrderDraft: OrderDraft = {
  memberId: '',
  dueDate: '',
  note: '',
  lines: [{ itemId: '', quantity: 1 }],
}
