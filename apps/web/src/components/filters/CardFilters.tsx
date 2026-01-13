import { Filter, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PRIORITY_OPTIONS,
  WORK_ITEM_TYPE_OPTIONS,
  type Priority,
  type WorkItemType,
} from '@/types'
import { type CardFiltersState, INITIAL_FILTERS } from '@/types/filters'

interface CardFiltersProps {
  filters: CardFiltersState
  onFiltersChange: (filters: CardFiltersState) => void
}

export function CardFilters({ filters, onFiltersChange }: CardFiltersProps) {
  const activeFiltersCount = [
    filters.workItemType,
    filters.priority,
    filters.startDateFrom,
    filters.startDateTo,
    filters.dueDateFrom,
    filters.dueDateTo,
  ].filter(Boolean).length

  const handleClearFilters = () => {
    onFiltersChange(INITIAL_FILTERS)
  }

  const updateFilter = <K extends keyof CardFiltersState>(
    key: K,
    value: CardFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs leading-none" variant="secondary">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtrar cartões</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-3 w-3" />
                Limpar
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tipo de item</label>
              <Select
                value={filters.workItemType || 'all'}
                onValueChange={(value) =>
                  updateFilter('workItemType', value === 'all' ? null : (value as WorkItemType))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {WORK_ITEM_TYPE_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Prioridade</label>
              <Select
                value={filters.priority || 'all'}
                onValueChange={(value) =>
                  updateFilter('priority', value === 'all' ? null : (value as Priority))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {PRIORITY_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Data de início</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">De</label>
                  <Input
                    type="date"
                    value={filters.startDateFrom}
                    onChange={(event) => updateFilter('startDateFrom', event.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Até</label>
                  <Input
                    type="date"
                    value={filters.startDateTo}
                    onChange={(event) => updateFilter('startDateTo', event.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Data de término</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">De</label>
                  <Input
                    type="date"
                    value={filters.dueDateFrom}
                    onChange={(event) => updateFilter('dueDateFrom', event.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Até</label>
                  <Input
                    type="date"
                    value={filters.dueDateTo}
                    onChange={(event) => updateFilter('dueDateTo', event.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { type CardFiltersState, INITIAL_FILTERS } from '@/types/filters'
