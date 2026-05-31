export type OrderSummary = {
  id: number
  memberId: number
  memberName: string
  status: string
  issuedAt: string
  dueDate: string
  returnedAt: string | null
  itemCount: number
}
