import type { Priority, WorkItemType } from './index'

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: 'bg-slate-500',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
}

export const WORK_ITEM_ICONS_CONFIG: Record<WorkItemType, { name: 'Bug' | 'Lightbulb' | 'Zap' }> = {
  BUG: { name: 'Bug' },
  FEATURE: { name: 'Lightbulb' },
  IMPROVEMENT: { name: 'Zap' },
}

export const WORK_ITEM_COLORS: Record<WorkItemType, string> = {
  BUG: 'text-red-500',
  FEATURE: 'text-green-500',
  IMPROVEMENT: 'text-blue-500',
}

export const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR')

export const formatDate = (value?: string | null): string | null =>
  value ? DATE_FORMATTER.format(new Date(value)) : null
