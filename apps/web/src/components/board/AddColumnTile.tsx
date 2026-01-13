import { type ButtonHTMLAttributes } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddColumnTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function AddColumnTile({ className, ...props }: AddColumnTileProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-fit w-64 shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-4 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-muted/50 hover:text-foreground sm:w-72',
        className
      )}
      {...props}
    >
      <Plus className="h-5 w-5" />
      <span className="font-medium">Adicionar coluna</span>
    </button>
  )
}
