import { useCallback } from 'react'

/**
 * Spawns a soft pink-gold ripple from the click/touch point.
 * Pass as the first arg to onClick — your handler runs after the ripple.
 */
export function useGlassRipple() {
  const spawnRipple = useCallback((e) => {
    const btn = e.currentTarget
    if (!btn) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = btn.getBoundingClientRect()
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top

    const ripple = document.createElement('span')
    ripple.className = 'lp-glass-ripple'
    ripple.setAttribute('aria-hidden', 'true')
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`

    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
  }, [])

  const withRipple = useCallback(
    (handler) => (e) => {
      spawnRipple(e)
      handler?.(e)
    },
    [spawnRipple]
  )

  return { spawnRipple, withRipple }
}
