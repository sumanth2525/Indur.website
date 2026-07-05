import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { canNavigateBack, getBackFallback } from '../utils/navigation'

export default function useGoBack(fallback) {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvedFallback = fallback ?? getBackFallback(location.pathname)

  return useCallback(() => {
    if (canNavigateBack()) {
      navigate(-1)
      return
    }
    navigate(resolvedFallback)
  }, [navigate, resolvedFallback])
}
