import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

interface BoardSkeletonProps {
  columnCount?: number
}

export function BoardSkeleton({ columnCount = 8 }: BoardSkeletonProps) {
  const placeholders = Array.from({ length: columnCount }, (_, index) => index)

  return (
    <ScrollArea className="flex-1">
      <div className="flex gap-3 p-4 min-h-[calc(100vh-140px)] md:gap-4 md:p-6 md:min-h-[calc(100vh-120px)]">
        {placeholders.map((placeholder) => (
          <div
            key={placeholder}
            className="flex h-[calc(100vh-140px)] w-64 shrink-0 flex-col rounded-lg bg-muted/50 p-3 sm:w-72 md:h-[calc(100vh-120px)]"
          >
            <div className="mb-1 flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <Skeleton className="mt-1 h-8 w-full rounded-md" />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
