import { useMemo } from 'react'
import { createPortal } from 'react-dom'

const HEARTS = ['💗', '💕', '✨', '💖', '🌸']

export default function AnswerBurst({ point }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        emoji: HEARTS[i % HEARTS.length],
        angle: i * 45 + Math.random() * 20 - 10,
        dist: 28 + Math.random() * 36,
        delay: i * 0.04,
        size: 12 + Math.random() * 10,
      })),
    [point?.x, point?.y]
  )

  if (!point) return null

  return createPortal(
    <div
      className="lp-answer-burst"
      style={{ left: point.x, top: point.y }}
      aria-hidden="true"
    >
      <span className="lp-answer-burst-glow" />
      {pieces.map((p) => (
        <span
          key={p.id}
          className="lp-answer-burst-piece"
          style={{
            '--angle': `${p.angle}deg`,
            '--dist': `${p.dist}px`,
            '--delay': `${p.delay}s`,
            fontSize: `${p.size}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>,
    document.body
  )
}
