import { type KeyboardEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AddColumnDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  columnName: string
  onColumnNameChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  trigger: ReactNode
  inputId?: string
}

export function AddColumnDialog({
  isOpen,
  onOpenChange,
  columnName,
  onColumnNameChange,
  onSubmit,
  isSubmitting,
  trigger,
  inputId = 'column-name',
}: AddColumnDialogProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && columnName.trim() && !isSubmitting) {
      onSubmit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova coluna</DialogTitle>
          <DialogDescription>
            Adicione uma nova coluna ao quadro.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <label htmlFor={inputId} className="text-sm font-medium">
              Nome da coluna *
            </label>
            <Input
              id={inputId}
              placeholder="Digite o nome da coluna"
              value={columnName}
              onChange={(event) => onColumnNameChange(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!columnName.trim() || isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
