import type { Priority, WorkItemType } from './index'

export interface CardFiltersState {
  workItemType: WorkItemType | null
  priority: Priority | null
  startDateFrom: string
  startDateTo: string
  dueDateFrom: string
  dueDateTo: string
}

export const INITIAL_FILTERS: CardFiltersState = {
  workItemType: null,
  priority: null,
  startDateFrom: '',
  startDateTo: '',
  dueDateFrom: '',
  dueDateTo: '',
}
