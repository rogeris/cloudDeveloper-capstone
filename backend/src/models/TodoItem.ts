export interface TodoItem {
  userId: string
  itemId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
