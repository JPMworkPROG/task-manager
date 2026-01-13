import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateCard } from '@/hooks/useCard'
import type { Card, Priority, WorkItemType } from '@/types'
import { CardFormFields, type CardFormData, isFormValid } from './CardFormFields'

interface CardEditDialogProps {
  card: Card
  boardId: string
  isOpen: boolean
  onClose: () => void
}

function cardToFormData(card: Card): CardFormData {
  return {
    title: card.title,
    description: card.description || '',
    startDate: card.start_date?.split('T')[0] || '',
    dueDate: card.due_date?.split('T')[0] || '',
    priority: card.priority || '',
    workItemType: card.work_item_type || '',
  }
}

export function CardEditDialog({ card, boardId, isOpen, onClose }: CardEditDialogProps) {
  const [formData, setFormData] = useState<CardFormData>(() => cardToFormData(card))
  const updateCard = useUpdateCard(boardId)

  useEffect(() => {
    if (isOpen) {
      setFormData(cardToFormData(card))
    }
  }, [isOpen, card])

  const handleFieldChange = useCallback(<K extends keyof CardFormData>(
    field: K,
    value: CardFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = async () => {
    if (!isFormValid(formData)) return

    try {
      await updateCard.mutateAsync({
        cardId: card.id,
        data: {
          title: formData.title,
          description: formData.description || null,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
          priority: (formData.priority as Priority) || null,
          workItemType: (formData.workItemType as WorkItemType) || null,
        },
      })
      onClose()
    } catch (error) {
      console.error('Failed to update card:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar cartão</DialogTitle>
          <DialogDescription>
            Faça alterações no cartão abaixo.
          </DialogDescription>
        </DialogHeader>

        <CardFormFields
          data={formData}
          onChange={handleFieldChange}
          idPrefix="edit-"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid(formData) || updateCard.isPending}
          >
            {updateCard.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
