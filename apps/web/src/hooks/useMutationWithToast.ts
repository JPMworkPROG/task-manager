import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ToastMessages {
  loading: string
  success: string
  error: string
}

interface MutationWithToastOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>
  messages: ToastMessages
  invalidateKeys?: readonly unknown[][]
  onSuccess?: (data: TData) => void
}

export function useMutationWithToast<TData, TVariables = void>({
  mutationFn,
  messages,
  invalidateKeys = [],
  onSuccess,
}: MutationWithToastOptions<TData, TVariables>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: TVariables) => {
      const promise = mutationFn(variables)
      toast.promise(promise, messages)
      return promise
    },
    onSuccess: (data) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key as unknown[] })
      })
      onSuccess?.(data)
    },
  })
}
