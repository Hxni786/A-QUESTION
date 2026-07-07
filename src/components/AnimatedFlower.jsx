const PETALS = [0, 1, 2, 3, 4, 5]

export default function AnimatedFlower({ side = 'left' }) {
  return (
    <div className={`lp-flower lp-flower--${side}`} aria-hidden="true">
      <div className="lp-flower-glow" />
      <div className="lp-flower-petals">
        {PETALS.map((i) => (
          <span key={i} className="lp-flower-petal" style={{ '--i': i }} />
        ))}
      </div>
      <div className="lp-flower-center" />
      <span className="lp-flower-sparkle" />
      <span className="lp-flower-sparkle" />
      <span className="lp-flower-sparkle" />
      <span className="lp-flower-leaf" />
    </div>
  )
}
