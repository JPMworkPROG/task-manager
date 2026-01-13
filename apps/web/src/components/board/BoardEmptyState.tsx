import { type ReactNode } from 'react'
import { Columns3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BoardEmptyStateProps {
  onCreateDefaultColumns: () => void
  isCreatingDefaultColumns: boolean
  addColumnDialog: ReactNode
}

export function BoardEmptyState({
  onCreateDefaultColumns,
  isCreatingDefaultColumns,
  addColumnDialog,
}: BoardEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Columns3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Quadro vazio</h2>
        <p className="max-w-md text-muted-foreground">
          Este quadro ainda não possui colunas. Crie colunas padrão para começar rapidamente ou adicione
          suas próprias colunas personalizadas.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={onCreateDefaultColumns}
          disabled={isCreatingDefaultColumns}
          className="min-w-[180px]"
        >
          {isCreatingDefaultColumns ? (
            'Criando...'
          ) : (
            <>
              <Columns3 className="mr-2 h-4 w-4" />
              Criar colunas padrão
            </>
          )}
        </Button>

        {addColumnDialog}
      </div>
    </div>
  )
}
