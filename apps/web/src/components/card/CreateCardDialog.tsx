import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateCard } from '@/hooks/useCard'
import type { Priority, WorkItemType } from '@/types'
import { CardFormFields, type CardFormData, isFormValid } from './CardFormFields'

const INITIAL_FORM_DATA: CardFormData = {
  title: '',
  description: '',
  startDate: '',
  dueDate: '',
  priority: '',
  workItemType: '',
}

interface CreateCardDialogProps {
  columnId: string
  columnName: string
  boardId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCardDialog({
  columnId,
  columnName,
  boardId,
  isOpen,
  onOpenChange,
}: CreateCardDialogProps) {
  const [formData, setFormData] = useState<CardFormData>(INITIAL_FORM_DATA)
  const createCard = useCreateCard(boardId)

  const handleFieldChange = useCallback(<K extends keyof CardFormData>(
    field: K,
    value: CardFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA)
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    if (!isFormValid(formData, true)) return

    try {
      await createCard.mutateAsync({
        columnId,
        data: {
          title: formData.title,
          description: formData.description || null,
          startDate: new Date(formData.startDate).toISOString(),
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
          priority: formData.priority as Priority,
          workItemType: formData.workItemType as WorkItemType,
        },
      })
      handleClose()
    } catch (error) {
      console.error('Failed to create card:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo cartão</DialogTitle>
          <DialogDescription>
            Adicione um novo cartão à coluna &quot;{columnName}&quot;.
          </DialogDescription>
        </DialogHeader>

        <CardFormFields
          data={formData}
          onChange={handleFieldChange}
          idPrefix="create-"
          requireFields
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid(formData, true) || createCard.isPending}
          >
            {createCard.isPending ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
