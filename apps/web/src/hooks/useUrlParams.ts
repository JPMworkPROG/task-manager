import { useCallback, useSyncExternalStore } from 'react'

function getSnapshot() {
  return window.location.search
}

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

type ParamValue = string | null | undefined

export function useUrlParams() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const params = new URLSearchParams(search)

  const updateParams = useCallback((updates: Record<string, ParamValue>) => {
    const url = new URL(window.location.href)

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, value)
      }
    })

    window.history.pushState({}, '', url.toString())
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  const setParam = useCallback(
    (key: string, value: string | null) => {
      updateParams({ [key]: value })
    },
    [updateParams]
  )

  const getParam = useCallback(
    (key: string): string | null => {
      return params.get(key)
    },
    [params]
  )

  const removeParam = useCallback(
    (key: string) => {
      updateParams({ [key]: null })
    },
    [updateParams]
  )

  return {
    params,
    setParam,
    getParam,
    removeParam,
    updateParams,
  }
}
