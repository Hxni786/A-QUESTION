import { useState, useCallback } from 'react'

const EXIT_MS = 580

/**
 * Classy step transition: exit animation → advance → enter animation.
 */
export function useQuestionTransition(onStepChange) {
  const [phase, setPhase] = useState('enter')
  const [burst, setBurst] = useState(null)
  const [cardGlow, setCardGlow] = useState(false)

  const advance = useCallback(
    (e) => {
      const btn = e?.currentTarget
      if (btn) {
        const rect = btn.getBoundingClientRect()
        setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        setTimeout(() => setBurst(null), 900)
      }

      setCardGlow(true)
      setPhase('exit')

      setTimeout(() => {
        onStepChange()
        setPhase('enter')
        setCardGlow(false)
      }, EXIT_MS)
    },
    [onStepChange]
  )

  return { phase, burst, cardGlow, advance }
}
