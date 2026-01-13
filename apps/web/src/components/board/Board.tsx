import { useCallback, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Column } from '@/components/column/Column'
import { Card as TaskCard } from '@/components/card/Card'
import { useBoard } from '@/hooks/useBoard'
import { useMoveCard } from '@/hooks/useCard'
import { useCreateColumn, useCreateColumns } from '@/hooks/useColumn'
import type { Card, Column as ColumnType } from '@/types'
import type { CardFiltersState } from '@/types/filters'
import { AddColumnDialog } from '@/components/board/AddColumnDialog'
import { BoardSkeleton } from '@/components/board/BoardSkeleton'
import { BoardEmptyState } from '@/components/board/BoardEmptyState'
import { AddColumnTile } from '@/components/board/AddColumnTile'

const DEFAULT_COLUMNS = ['A fazer', 'Em progresso', 'Concluído']

interface BoardProps {
  boardId: string | null
  selectedCardId?: string | null
  onSelectCard?: (cardId: string | null) => void
  filters?: CardFiltersState
}

export function Board({ boardId, selectedCardId, onSelectCard, filters }: BoardProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [movingCardId, setMovingCardId] = useState<string | null>(null)
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')

  const { data: board, isLoading, isError } = useBoard(boardId)
  const moveCard = useMoveCard(boardId || '')
  const createColumn = useCreateColumn(boardId || '')
  const createColumns = useCreateColumns(boardId || '')
  const columns = board?.columns ?? []

  const { cardLookup, columnLookup } = useMemo(() => {
    const cards = new Map<string, { card: Card; column: ColumnType }>()
    const columnMap = new Map<string, ColumnType>()

    columns.forEach((column) => {
      columnMap.set(column.id, column)
      column.cards?.forEach((card) => {
        cards.set(card.id, { card, column })
      })
    })

    return { cardLookup: cards, columnLookup: columnMap }
  }, [columns])

  const handleCreateColumn = useCallback(async () => {
    const trimmedName = newColumnName.trim()
    if (!trimmedName) return

    try {
      await createColumn.mutateAsync({ name: trimmedName })
      setNewColumnName('')
      setIsAddColumnOpen(false)
    } catch (error) {
      console.error('Failed to create column:', error)
    }
  }, [createColumn, newColumnName])

  const handleCreateDefaultColumns = useCallback(() => {
    createColumns.mutate(DEFAULT_COLUMNS)
  }, [createColumns])

  const addColumnDialogProps = useMemo(
    () => ({
      isOpen: isAddColumnOpen,
      onOpenChange: setIsAddColumnOpen,
      columnName: newColumnName,
      onColumnNameChange: setNewColumnName,
      onSubmit: handleCreateColumn,
      isSubmitting: createColumn.isPending,
    }),
    [handleCreateColumn, isAddColumnOpen, newColumnName, createColumn.isPending]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      const cardId = active.id as string
      const card = cardLookup.get(cardId)?.card ?? null
      setActiveCard(card)
    },
    [cardLookup]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveCard(null)

      if (!over) return

      const cardId = active.id as string
      const overId = over.id as string

      const sourceColumn = cardLookup.get(cardId)?.column
      if (!sourceColumn) return

      let targetColumnId = overId
      if (!columnLookup.has(overId)) {
        const columnContainingOverCard = cardLookup.get(overId)?.column
        if (!columnContainingOverCard) return
        targetColumnId = columnContainingOverCard.id
      }

      if (sourceColumn.id === targetColumnId) return

      setMovingCardId(cardId)
      moveCard.mutate(
        { cardId, newColumnId: targetColumnId },
        {
          onSettled: () => {
            setMovingCardId(null)
          },
        }
      )
    },
    [cardLookup, columnLookup, moveCard]
  )

  const columnElements = useMemo(
    () =>
      columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          boardId={boardId || ''}
          movingCardId={movingCardId}
          selectedCardId={selectedCardId}
          onSelectCard={onSelectCard}
          filters={filters}
        />
      )),
    [boardId, columns, filters, movingCardId, onSelectCard, selectedCardId]
  )

  if (!boardId) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>Selecione um quadro para começar</p>
      </div>
    )
  }

  if (isLoading) {
    return <BoardSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center text-destructive">
        <p>Erro ao carregar o quadro</p>
      </div>
    )
  }

  const hasColumns = columns.length > 0
  const emptyStateAddColumnDialog = (
    <AddColumnDialog
      {...addColumnDialogProps}
      trigger={
        <Button variant="outline" className="min-w-[180px]">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar coluna
        </Button>
      }
    />
  )

  if (!hasColumns) {
    return (
      <BoardEmptyState
        onCreateDefaultColumns={handleCreateDefaultColumns}
        isCreatingDefaultColumns={createColumns.isPending}
        addColumnDialog={emptyStateAddColumnDialog}
      />
    )
  }

  const addColumnTileDialog = (
    <AddColumnDialog
      {...addColumnDialogProps}
      inputId="columnNameBoard"
      trigger={<AddColumnTile />}
    />
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="flex-1">
        <div className="flex gap-3 p-4 min-h-[calc(100vh-140px)] md:gap-4 md:p-6 md:min-h-[calc(100vh-120px)]">
          {columnElements}

          {addColumnTileDialog}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeCard && (
          <TaskCard card={activeCard} boardId={boardId} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  )
}
