import type { Card } from '@/types'
import type { CardFiltersState } from '@/types/filters'

const toDayTimestamp = (value: string): number => new Date(value).setHours(0, 0, 0, 0)

const isBefore = (date: string | null | undefined, min?: string): boolean =>
  Boolean(date && min && toDayTimestamp(date) < toDayTimestamp(min))

const isAfter = (date: string | null | undefined, max?: string): boolean =>
  Boolean(date && max && toDayTimestamp(date) > toDayTimestamp(max))

export function matchesFilters(card: Card, filters?: CardFiltersState): boolean {
  if (!filters) return true

  if (filters.workItemType && card.work_item_type !== filters.workItemType) {
    return false
  }

  if (filters.priority && card.priority !== filters.priority) {
    return false
  }

  if (isBefore(card.start_date, filters.startDateFrom)) {
    return false
  }

  if (isAfter(card.start_date, filters.startDateTo)) {
    return false
  }

  if (isBefore(card.due_date, filters.dueDateFrom)) {
    return false
  }

  if (isAfter(card.due_date, filters.dueDateTo)) {
    return false
  }

  return true
}
