import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteCard } from '@/hooks/useCard'

interface CardDeleteDialogProps {
  cardId: string
  cardTitle: string
  boardId: string
  isOpen: boolean
  onClose: () => void
  onDeleted?: () => void
}

export function CardDeleteDialog({
  cardId,
  cardTitle,
  boardId,
  isOpen,
  onClose,
  onDeleted,
}: CardDeleteDialogProps) {
  const deleteCard = useDeleteCard(boardId)

  const handleDelete = async () => {
    try {
      await deleteCard.mutateAsync(cardId)
      onClose()
      onDeleted?.()
    } catch (error) {
      console.error('Failed to delete card:', error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir cartão?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O cartão &quot;{cardTitle}&quot;
            será permanentemente removido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteCard.isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
