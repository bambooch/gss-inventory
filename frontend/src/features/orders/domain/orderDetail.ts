export type OrderLine = {
  id: number
  itemId: number
  itemName: string
  quantity: number
}

export type OrderDetail = {
  id: number
  memberId: number
  memberName: string
  status: string
  issuedAt: string
  dueDate: string
  returnedAt: string | null
  note: string | null
  lines: OrderLine[]
}
