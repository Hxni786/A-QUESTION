export default function AnimatedHeart({ side = 'left' }) {
  return (
    <div className={`lp-heart lp-heart--${side}`} aria-hidden="true">
      <div className="lp-heart-glow" />
      <div className="lp-heart-ring" />
      <div className="lp-heart-shape" />
      <span className="lp-heart-shine" />
      <span className="lp-heart-sparkle" />
      <span className="lp-heart-sparkle" />
    </div>
  )
}
