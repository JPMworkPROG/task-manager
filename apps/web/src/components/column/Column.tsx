import { useMemo, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card as TaskCard } from '@/components/card/Card'
import { CreateCardDialog } from '@/components/card/CreateCardDialog'
import { cn } from '@/lib/utils'
import { matchesFilters } from '@/lib/filters'
import type { Column as ColumnType } from '@/types'
import type { CardFiltersState } from '@/types/filters'

interface ColumnProps {
  column: ColumnType
  boardId: string
  movingCardId?: string | null
  selectedCardId?: string | null
  onSelectCard?: (cardId: string | null) => void
  filters?: CardFiltersState
}

export function Column({
  column,
  boardId,
  movingCardId,
  selectedCardId,
  onSelectCard,
  filters,
}: ColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const visibleCards = useMemo(
    () => (column.cards || []).filter((card) => matchesFilters(card, filters)),
    [column.cards, filters]
  )

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-64 shrink-0 rounded-lg bg-muted/50 p-3 transition-colors sm:w-72',
        isOver && 'bg-muted ring-2 ring-primary/20'
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">{column.name}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {visibleCards.length}
        </span>
      </div>

      <div className="space-y-2">
        {visibleCards.map((card) => (
          <TaskCard
            key={card.id}
            card={card}
            boardId={boardId}
            isMoving={card.id === movingCardId}
            isSelected={card.id === selectedCardId}
            onSelect={onSelectCard}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-1 w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar cartão
      </Button>

      <CreateCardDialog
        columnId={column.id}
        columnName={column.name}
        boardId={boardId}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
