import { useCallback, useState } from 'react'
import { Kanban } from 'lucide-react'
import { BoardSelector } from '@/components/board/BoardSelector'
import { Board } from '@/components/board/Board'
import { CardFilters } from '@/components/filters/CardFilters'
import { Toaster } from '@/components/ui/sonner'
import { useUrlParams } from '@/hooks/useUrlParams'
import { INITIAL_FILTERS, type CardFiltersState } from '@/types/filters'

export function HomePage() {
  const { getParam, updateParams } = useUrlParams()
  const [filters, setFilters] = useState<CardFiltersState>(INITIAL_FILTERS)

  const selectedBoardId = getParam('board')
  const selectedCardId = getParam('card')

  const handleSelectBoard = useCallback(
    (boardId: string | null) => {
      updateParams({
        board: boardId,
        card: null,
      })
    },
    [updateParams]
  )

  const handleSelectCard = useCallback(
    (cardId: string | null) => {
      updateParams({ card: cardId })
    },
    [updateParams]
  )

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b bg-card px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:h-9 sm:w-9">
              <Kanban className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">Mini-Kanban</h1>
          </div>
          <div className="flex items-center gap-2">
            {selectedBoardId && (
              <CardFilters filters={filters} onFiltersChange={setFilters} />
            )}
            <BoardSelector
              selectedBoardId={selectedBoardId}
              onSelectBoard={handleSelectBoard}
            />
          </div>
        </div>
      </header>
      <Toaster position="top-right" />

      <main className="flex-1 overflow-hidden">
        <Board
          boardId={selectedBoardId}
          selectedCardId={selectedCardId}
          onSelectCard={handleSelectCard}
          filters={filters}
        />
      </main>

    </div>
  )
}
