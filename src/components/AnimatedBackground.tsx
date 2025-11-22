import { Starfield } from './Starfield'

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Starfield />
      <div className="vignette absolute inset-0" />
    </div>
  )
}
