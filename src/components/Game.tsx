import { useCallback, useEffect, useRef, useState } from 'react'

interface Heart {
  id: number
  x: number
  y: number
  vy: number
  vx: number
  scale: number
  rotation: number
  hit?: boolean
}

interface HeartClickGameProps {
  durationSeconds?: number
  targetScore?: number
  onComplete?: (win: boolean, score: number) => void
  onEnd?: (score: number) => void // legacy simple end (no win condition)
}

export function HeartClickGame({ durationSeconds = 30, targetScore, onComplete, onEnd }: HeartClickGameProps) {
  const [running, setRunning] = useState(true)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const heartsRef = useRef<Heart[]>([])
  const frameRef = useRef<number | undefined>(undefined)
  const lastSpawnRef = useRef(0)

  const spawnHeart = useCallback(() => {
    const id = Date.now() + Math.random()
    const x = 6 + Math.random() * 88
    const y = 100
    // Mayor velocidad vertical para desaparecer antes
    const vy = -0.8 - Math.random() * 1.2
    const vx = (-0.22 + Math.random() * 0.44)
    // Más grandes
    const scale = 0.95 + Math.random() * 0.9 // 0.95 - 1.85
    const rotation = -30 + Math.random() * 60
    heartsRef.current.push({ id, x, y, vy, vx, scale, rotation })
  }, [])

  useEffect(() => {
    let last = performance.now()
    function loop(now: number) {
      const dt = now - last
      last = now
      if (running) {
        // Spawn faster if short duration to give enough hearts
        // Intervalo más corto para compensar desaparición rápida
        const interval = durationSeconds <= 12 ? 260 : 430
        if (now - lastSpawnRef.current > interval) {
          spawnHeart()
          lastSpawnRef.current = now
        }
        heartsRef.current.forEach(h => {
          h.y += h.vy * (dt * 0.09) // más rápido hacia arriba
          h.x += h.vx * (dt * 0.05)
          h.rotation += h.vx * 2.2
        })
        heartsRef.current = heartsRef.current.filter(h => h.y > -12 && !h.hit)
      }
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [running, spawnHeart, durationSeconds])

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      setRunning(false)
      const win = targetScore !== undefined ? score >= targetScore : false
      if (onComplete) onComplete(win, score)
      else if (onEnd) onEnd(score)
      return
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running, score, targetScore, onComplete, onEnd])

  const clickHeart = (id: number) => {
    heartsRef.current = heartsRef.current.map(h => h.id === id ? { ...h, hit: true } : h)
    setScore(s => s + 1)
  }

  return (
    <div className="play-overlay" style={{ pointerEvents: 'none' }}>
      <div className="score-panel">
        <span>Corazones: {score}{targetScore ? ` / ${targetScore}` : ''}</span>
        <span>Tiempo: {timeLeft}s</span>
      </div>
      {heartsRef.current.map(h => (
        <div
          key={h.id}
          className={`game-heart ${h.hit ? 'hit' : ''}`}
          onClick={() => clickHeart(h.id)}
          style={{
            left: `${h.x}%`,
            bottom: `${h.y}vmin`,
            transform: `translate(-50%, 0) scale(${h.scale}) rotate(${h.rotation}deg)`,
            pointerEvents: 'auto'
          }}
        >
          <svg viewBox="0 0 32 32">
            <path fill="#ff6b9d" d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z" />
          </svg>
        </div>
      ))}
    </div>
  )
}

export function ChallengeResult({ win, score, target, onRetry }: { win: boolean; score: number; target: number; onRetry: () => void }) {
  return (
    <div className="end-overlay">
      <h2 style={{ marginBottom:'2vmin' }}>{win ? '¡Ganaste! 🥳' : 'Intento fallido 😅'}</h2>
      <p style={{ fontSize:'2.2vmin', margin:'0 0 2.5vmin', color:'#fff' }}>
        {win ? 'Atrapaste lo necesario para continuar.' : `Necesitas ${target} corazones. Atrapaste ${score}.`}
      </p>
      {!win && <button className="restart-btn" onClick={onRetry}>Reintentar</button>}
    </div>
  )
}

export function GameEnd({ score, onRestart }: { score:number; onRestart:()=>void }) {
  return (
    <div className="end-overlay">
      <h2>¡Puntaje {score}!</h2>
      <button className="restart-btn" onClick={onRestart}>Reiniciar</button>
    </div>
  )
}
