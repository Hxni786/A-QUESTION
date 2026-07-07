import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'

const randBetween = (min, max) => Math.random() * (max - min) + min

const VIEWPORT_PADDING = 16
const HOVER_BUFFER = 14
const YES_AVOID_PAD = 24
const FALLBACK_BTN_W = 100
const FALLBACK_BTN_H = 46

function defaultPos() {
  const edge = VIEWPORT_PADDING + HOVER_BUFFER
  return {
    left: Math.max(edge, window.innerWidth - FALLBACK_BTN_W - edge - 20),
    top: edge + 48,
  }
}

/**
 * Keeps the "No" button dodging within the visible viewport.
 * Coords are viewport-based — pair with a portaled fixed button.
 */
export function useDodgeButton(yesBtnRef) {
  const noBtnRef = useRef(null)
  const [pos, setPos] = useState(defaultPos)

  const getViewportBounds = useCallback(() => {
    const noBtn = noBtnRef.current
    const btnW = noBtn?.offsetWidth || FALLBACK_BTN_W
    const btnH = noBtn?.offsetHeight || FALLBACK_BTN_H
    const edge = VIEWPORT_PADDING + HOVER_BUFFER

    return {
      btnW,
      btnH,
      minLeft: edge,
      minTop: edge,
      maxLeft: Math.max(edge, window.innerWidth - btnW - edge),
      maxTop: Math.max(edge, window.innerHeight - btnH - edge),
    }
  }, [])

  const overlapsYes = useCallback((left, top, btnW, btnH) => {
    const yesBtn = yesBtnRef?.current
    if (!yesBtn) return false

    const r = yesBtn.getBoundingClientRect()
    return !(
      left + btnW + YES_AVOID_PAD < r.left ||
      left > r.right + YES_AVOID_PAD ||
      top + btnH + YES_AVOID_PAD < r.top ||
      top > r.bottom + YES_AVOID_PAD
    )
  }, [yesBtnRef])

  const pickSafePosition = useCallback(() => {
    const { minLeft, minTop, maxLeft, maxTop, btnW, btnH } = getViewportBounds()

    for (let i = 0; i < 30; i++) {
      const left = randBetween(minLeft, maxLeft)
      const top = randBetween(minTop, maxTop)
      if (!overlapsYes(left, top, btnW, btnH)) {
        return { left, top }
      }
    }

    return { left: minLeft, top: maxTop }
  }, [getViewportBounds, overlapsYes])

  const dodge = useCallback(() => {
    setPos(pickSafePosition())
  }, [pickSafePosition])

  const placeInitial = useCallback(() => {
    const { minLeft, maxLeft, minTop, btnW } = getViewportBounds()
    setPos({
      left: Math.max(minLeft, maxLeft - btnW * 0.2),
      top: minTop + 8,
    })
  }, [getViewportBounds])

  const clampToViewport = useCallback(() => {
    setPos((current) => {
      const { minLeft, minTop, maxLeft, maxTop } = getViewportBounds()
      return {
        left: Math.min(Math.max(current.left, minLeft), maxLeft),
        top: Math.min(Math.max(current.top, minTop), maxTop),
      }
    })
  }, [getViewportBounds])

  // Refine position once the real button size is known
  useLayoutEffect(() => {
    placeInitial()
  }, [placeInitial])

  useEffect(() => {
    window.addEventListener('resize', clampToViewport)
    return () => window.removeEventListener('resize', clampToViewport)
  }, [clampToViewport])

  return { noBtnRef, pos, dodge }
}
