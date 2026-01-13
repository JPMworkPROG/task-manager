import { createColumn } from '@/services/api'
import type { CreateColumnData } from '@/types'
import { useMutationWithToast } from './useMutationWithToast'

export function useCreateColumn(boardId: string) {
  return useMutationWithToast({
    mutationFn: (data: CreateColumnData) => createColumn(boardId, data),
    messages: {
      loading: 'Criando coluna...',
      success: 'Coluna criada com sucesso',
      error: 'Erro ao criar coluna',
    },
    invalidateKeys: [['board', boardId]],
  })
}

export function useCreateColumns(boardId: string) {
  return useMutationWithToast({
    mutationFn: (columnNames: string[]) =>
      Promise.all(columnNames.map((name) => createColumn(boardId, { name }))),
    messages: {
      loading: 'Criando colunas...',
      success: 'Colunas criadas com sucesso',
      error: 'Erro ao criar colunas',
    },
    invalidateKeys: [['board', boardId]],
  })
}
