import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCard, updateCard, deleteCard, moveCard } from '@/services/api'
import type { Board, Card, CreateCardData, UpdateCardData } from '@/types'
import { useMutationWithToast } from './useMutationWithToast'

interface CreateCardParams {
  columnId: string
  data: CreateCardData
}

interface UpdateCardParams {
  cardId: string
  data: UpdateCardData
}

interface MoveCardParams {
  cardId: string
  newColumnId: string
}

export function useCreateCard(boardId: string) {
  return useMutationWithToast({
    mutationFn: ({ columnId, data }: CreateCardParams) => createCard(columnId, data),
    messages: {
      loading: 'Criando cartão...',
      success: 'Cartão criado com sucesso',
      error: 'Erro ao criar cartão',
    },
    invalidateKeys: [['board', boardId]],
  })
}

export function useUpdateCard(boardId: string) {
  return useMutationWithToast({
    mutationFn: ({ cardId, data }: UpdateCardParams) => updateCard(cardId, data),
    messages: {
      loading: 'Salvando alterações...',
      success: 'Cartão atualizado com sucesso',
      error: 'Erro ao atualizar cartão',
    },
    invalidateKeys: [['board', boardId]],
  })
}

export function useDeleteCard(boardId: string) {
  return useMutationWithToast({
    mutationFn: (cardId: string) => deleteCard(cardId),
    messages: {
      loading: 'Excluindo cartão...',
      success: 'Cartão excluído com sucesso',
      error: 'Erro ao excluir cartão',
    },
    invalidateKeys: [['board', boardId]],
  })
}

// useMoveCard needs optimistic updates, so it uses the standard useMutation
export function useMoveCard(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, newColumnId }: MoveCardParams) => {
      const promise = moveCard(cardId, newColumnId)
      toast.promise(promise, {
        loading: 'Movendo cartão...',
        success: 'Cartão movido com sucesso',
        error: 'Erro ao mover cartão',
      })
      return promise
    },
    onMutate: async ({ cardId, newColumnId }: MoveCardParams) => {
      await queryClient.cancelQueries({ queryKey: ['board', boardId] })

      const previousBoard = queryClient.getQueryData<Board>(['board', boardId])

      queryClient.setQueryData<Board>(['board', boardId], (old) => {
        if (!old?.columns) return old

        const newColumns = old.columns.map((column) => ({
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        }))

        let movedCard: Card | null = null
        for (const column of old.columns) {
          const card = column.cards?.find((c) => c.id === cardId)
          if (card) {
            movedCard = { ...card, column_id: newColumnId }
            break
          }
        }

        if (movedCard) {
          const targetColumnIndex = newColumns.findIndex(
            (col) => col.id === newColumnId
          )
          if (targetColumnIndex !== -1) {
            newColumns[targetColumnIndex].cards.push(movedCard)
          }
        }

        return { ...old, columns: newColumns }
      })

      return { previousBoard }
    },
    onSuccess: (updatedCard, { cardId, newColumnId }) => {
      queryClient.setQueryData<Board>(['board', boardId], (old) => {
        if (!old?.columns) return old

        return {
          ...old,
          columns: old.columns.map((column) => ({
            ...column,
            cards: column.cards.map((card) =>
              card.id === cardId
                ? { ...card, ...updatedCard, column_id: newColumnId }
                : card
            ),
          })),
        }
      })
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(['board', boardId], context.previousBoard)
      }
    },
  })
}
