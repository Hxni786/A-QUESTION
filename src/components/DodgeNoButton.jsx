import { useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useGlassRipple } from '../hooks/useGlassRipple'
import { useDodgeButton } from '../hooks/useDodgeButton'

/**
 * "Nahi" button — portaled to document.body so position:fixed
 * uses real viewport coords (not trapped by backdrop-filter parents).
 */
export default function DodgeNoButton({ yesBtnRef, label, onDodge }) {
  const { withRipple } = useGlassRipple()
  const { noBtnRef, pos, dodge } = useDodgeButton(yesBtnRef)

  const handleRejectAttempt = useCallback(
    (e) => {
      e.preventDefault()
      withRipple()(e)
      dodge()
      onDodge?.()
    },
    [withRipple, dodge, onDodge]
  )

  return createPortal(
    <button
      ref={noBtnRef}
      type="button"
      className="lp-btn-no"
      style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
      onMouseEnter={handleRejectAttempt}
      onTouchStart={handleRejectAttempt}
      onClick={handleRejectAttempt}
      aria-label="This button can't actually be pressed"
    >
      <span className="lp-btn-label">{label}</span>
    </button>,
    document.body
  )
}
