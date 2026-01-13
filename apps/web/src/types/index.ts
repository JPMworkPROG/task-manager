export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type WorkItemType = 'BUG' | 'FEATURE' | 'IMPROVEMENT'

export interface Card {
  id: string
  title: string
  description?: string | null
  start_date?: string | null
  due_date?: string | null
  priority?: Priority | null
  work_item_type?: WorkItemType | null
  column_id: string
}

export interface Column {
  id: string
  name: string
  board_id: string
  cards: Card[]
}

export interface Board {
  id: string
  name: string
  columns?: Column[]
}

export interface CreateBoardData {
  name: string
}

export interface CreateColumnData {
  name: string
}

export interface CreateCardData {
  title: string
  description?: string | null
  startDate: string
  dueDate?: string | null
  priority: Priority
  workItemType: WorkItemType
}

export interface UpdateCardData {
  title?: string
  description?: string | null
  startDate?: string | null
  dueDate?: string | null
  priority?: Priority | null
  workItemType?: WorkItemType | null
}

export interface MoveCardData {
  newColumnId: string
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

export const WORK_ITEM_TYPE_LABELS: Record<WorkItemType, string> = {
  BUG: 'Bug',
  FEATURE: 'Funcionalidade',
  IMPROVEMENT: 'Melhoria',
}

type SelectOption<T extends string> = {
  value: T
  label: string
}

export const PRIORITY_OPTIONS: SelectOption<Priority>[] = (
  Object.entries(PRIORITY_LABELS) as Array<[Priority, string]>
).map(([value, label]) => ({
  value,
  label,
}))

export const WORK_ITEM_TYPE_OPTIONS: SelectOption<WorkItemType>[] = (
  Object.entries(WORK_ITEM_TYPE_LABELS) as Array<[WorkItemType, string]>
).map(([value, label]) => ({
  value,
  label,
}))
