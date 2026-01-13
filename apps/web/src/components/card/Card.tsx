import { useMemo, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Bug,
  Lightbulb,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card as CardUI,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  PRIORITY_LABELS,
  WORK_ITEM_TYPE_LABELS,
  type Card as CardType,
  type WorkItemType,
} from '@/types'
import {
  PRIORITY_COLORS,
  WORK_ITEM_COLORS,
  formatDate,
} from '@/types/card'
import { CardViewDialog } from './CardViewDialog'
import { CardEditDialog } from './CardEditDialog'
import { CardDeleteDialog } from './CardDeleteDialog'

type DialogState = 'closed' | 'view' | 'edit' | 'delete'

const WORK_ITEM_ICONS: Record<WorkItemType, React.ReactNode> = {
  BUG: <Bug className="h-3 w-3" />,
  FEATURE: <Lightbulb className="h-3 w-3" />,
  IMPROVEMENT: <Zap className="h-3 w-3" />,
}

interface CardProps {
  card: CardType
  boardId: string
  isDragging?: boolean
  isMoving?: boolean
  isSelected?: boolean
  onSelect?: (cardId: string | null) => void
}

export function Card({
  card,
  boardId,
  isDragging = false,
  isMoving = false,
  isSelected = false,
  onSelect,
}: CardProps) {
  const [dialogState, setDialogState] = useState<DialogState>('closed')

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    disabled: isMoving,
  })

  const dragStyle = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  const startDateLabel = useMemo(() => formatDate(card.start_date), [card.start_date])
  const dueDateLabel = useMemo(() => formatDate(card.due_date), [card.due_date])
  const isOverdue = useMemo(
    () => (card.due_date ? new Date(card.due_date) < new Date() : false),
    [card.due_date]
  )

  const openDialog = (state: DialogState) => {
    setDialogState(state)
    if (state !== 'closed') {
      onSelect?.(card.id)
    }
  }

  const closeDialog = () => {
    setDialogState('closed')
    onSelect?.(null)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('[role="menuitem"]')
    ) {
      return
    }
    openDialog('view')
  }

  // Sync with external selection state (from URL params)
  const effectiveDialogState = isSelected && dialogState === 'closed' ? 'view' : dialogState

  return (
    <>
      <CardUI
        ref={setNodeRef}
        style={dragStyle}
        onClick={handleCardClick}
        className={cn(
          'cursor-pointer hover:shadow-md transition-opacity',
          isDragging && 'opacity-0',
          isMoving && 'opacity-60 pointer-events-none',
          transform && 'z-50'
        )}
      >
        <CardHeader className="p-3 pb-1">
          <div className="flex items-start justify-between gap-2">
            <div
              {...attributes}
              {...listeners}
              className="-ml-1 -mt-1 flex h-8 w-8 cursor-grab items-center justify-center rounded text-muted-foreground touch-none hover:bg-muted hover:text-foreground active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <CardTitle className="flex-1 text-sm font-medium leading-tight">
              {card.title}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  disabled={isMoving}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openDialog('edit')} disabled={isMoving}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => openDialog('delete')}
                  disabled={isMoving}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-0 space-y-2">
          {card.description && (
            <CardDescription className="line-clamp-2 text-xs">
              {card.description}
            </CardDescription>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {card.work_item_type && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs',
                  WORK_ITEM_COLORS[card.work_item_type]
                )}
                title={WORK_ITEM_TYPE_LABELS[card.work_item_type]}
              >
                {WORK_ITEM_ICONS[card.work_item_type]}
                <span className="hidden sm:inline">
                  {WORK_ITEM_TYPE_LABELS[card.work_item_type]}
                </span>
              </span>
            )}
            {card.priority && (
              <span
                className="inline-flex items-center gap-1 text-xs"
                title={`Prioridade: ${PRIORITY_LABELS[card.priority]}`}
              >
                <span
                  className={cn('h-2 w-2 rounded-full', PRIORITY_COLORS[card.priority])}
                />
                <span className="text-muted-foreground">
                  {PRIORITY_LABELS[card.priority]}
                </span>
              </span>
            )}
          </div>

          {(startDateLabel || dueDateLabel) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {startDateLabel && (
                <span title={`Início: ${startDateLabel}`}>{startDateLabel}</span>
              )}
              {startDateLabel && dueDateLabel && <span aria-hidden="true">→</span>}
              {dueDateLabel && (
                <span
                  className={cn(isOverdue && 'text-destructive font-medium')}
                  title={`Entrega: ${dueDateLabel}`}
                >
                  {dueDateLabel}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </CardUI>

      <CardViewDialog
        card={card}
        isOpen={effectiveDialogState === 'view'}
        onClose={closeDialog}
        onEdit={() => setDialogState('edit')}
      />

      <CardEditDialog
        card={card}
        boardId={boardId}
        isOpen={effectiveDialogState === 'edit'}
        onClose={closeDialog}
      />

      <CardDeleteDialog
        cardId={card.id}
        cardTitle={card.title}
        boardId={boardId}
        isOpen={dialogState === 'delete'}
        onClose={closeDialog}
        onDeleted={closeDialog}
      />
    </>
  )
}
