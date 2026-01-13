import { useQuery } from '@tanstack/react-query'
import { getBoard, getBoards, createBoard } from '@/services/api'
import type { Board, CreateBoardData } from '@/types'
import { useMutationWithToast } from './useMutationWithToast'

export function useBoard(boardId: string | null) {
  return useQuery<Board>({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId!),
    enabled: !!boardId,
  })
}

export function useBoards() {
  return useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: getBoards,
  })
}

export function useCreateBoard() {
  return useMutationWithToast({
    mutationFn: (data: CreateBoardData) => createBoard(data),
    messages: {
      loading: 'Criando quadro...',
      success: 'Quadro criado com sucesso',
      error: 'Erro ao criar quadro',
    },
    invalidateKeys: [['boards']],
  })
}
