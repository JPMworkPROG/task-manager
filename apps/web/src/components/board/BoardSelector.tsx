import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useBoards, useCreateBoard } from '@/hooks/useBoard'

interface BoardSelectorProps {
  selectedBoardId: string | null
  onSelectBoard: (boardId: string) => void
}

export function BoardSelector({
  selectedBoardId,
  onSelectBoard,
}: BoardSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')

  const { data: boards = [], isLoading } = useBoards()
  const createBoard = useCreateBoard()

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return

    try {
      const newBoard = await createBoard.mutateAsync({ name: newBoardName })
      setNewBoardName('')
      setIsDialogOpen(false)
      onSelectBoard(newBoard.id)
    } catch (error) {
      console.error('Failed to create board:', error)
    }
  }

  const handleSelectChange = (value: string) => {
    if (value === '__create__') {
      setIsDialogOpen(true)
    } else {
      onSelectBoard(value)
    }
  }

  return (
    <>
      <Select
        value={selectedBoardId || ''}
        onValueChange={handleSelectChange}
        disabled={isLoading}
      >
        <SelectTrigger size="sm" className="w-full sm:w-[220px]">
          <SelectValue placeholder="Selecione um quadro" />
        </SelectTrigger>
        <SelectContent>
          {boards.map((board) => (
            <SelectItem key={board.id} value={board.id}>
              {board.name}
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value="__create__" className="text-primary focus:text-primary">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Criar novo quadro</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar novo quadro</DialogTitle>
            <DialogDescription>
              Insira um nome para o novo quadro Kanban.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nome do quadro"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateBoard}
              disabled={!newBoardName.trim() || createBoard.isPending}
            >
              {createBoard.isPending ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
