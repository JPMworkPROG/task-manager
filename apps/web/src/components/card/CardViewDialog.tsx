import { useMemo } from 'react'
import { Calendar, Bug, Lightbulb, Zap, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  PRIORITY_LABELS,
  WORK_ITEM_TYPE_LABELS,
  type Card,
  type WorkItemType,
} from '@/types'
import {
  PRIORITY_COLORS,
  WORK_ITEM_COLORS,
  formatDate,
} from '@/types/card'

const WORK_ITEM_ICONS: Record<WorkItemType, React.ReactNode> = {
  BUG: <Bug className="h-3 w-3" />,
  FEATURE: <Lightbulb className="h-3 w-3" />,
  IMPROVEMENT: <Zap className="h-3 w-3" />,
}

interface CardViewDialogProps {
  card: Card
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function CardViewDialog({ card, isOpen, onClose, onEdit }: CardViewDialogProps) {
  const startDateLabel = useMemo(() => formatDate(card.start_date), [card.start_date])
  const dueDateLabel = useMemo(() => formatDate(card.due_date), [card.due_date])
  const isOverdue = useMemo(
    () => (card.due_date ? new Date(card.due_date) < new Date() : false),
    [card.due_date]
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Visualizar cartão</DialogTitle>
          <DialogDescription>
            Visualize os detalhes do cartão abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Título</label>
            <p className="text-sm">{card.title}</p>
          </div>

          {card.description && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <p className="text-sm whitespace-pre-wrap">{card.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {card.work_item_type && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tipo de item</label>
                <div className="flex items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1 text-sm', WORK_ITEM_COLORS[card.work_item_type])}>
                    {WORK_ITEM_ICONS[card.work_item_type]}
                    {WORK_ITEM_TYPE_LABELS[card.work_item_type]}
                  </span>
                </div>
              </div>
            )}

            {card.priority && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Prioridade</label>
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', PRIORITY_COLORS[card.priority])} />
                  <span className="text-sm">{PRIORITY_LABELS[card.priority]}</span>
                </div>
              </div>
            )}
          </div>

          {(startDateLabel || dueDateLabel) && (
            <div className="grid grid-cols-2 gap-4">
              {startDateLabel && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Data de início</label>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{startDateLabel}</span>
                  </div>
                </div>
              )}

              {dueDateLabel && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Data de término</label>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(isOverdue && 'text-destructive font-medium')}>
                      {dueDateLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
