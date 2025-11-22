import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  speed: number
  phase: number
}

type ShootingStar = {
  x: number
  y: number
  len: number
  speed: number
  angle: number
  opacity: number
}

type Props = {
  density?: number
}

export function Starfield({ density = 0.0008 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const stars: Star[] = []
    const shootingStars: ShootingStar[] = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(200, Math.floor(w * h * density))
      stars.length = 0
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2 + 0.5,
          speed: Math.random() * 1.2 + 0.4,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    let t = 0
    let nextShootingStar = Math.random() * 3 + 2

    const draw = () => {
      t += 0.016
      const w = window.innerWidth
      const h = window.innerHeight

      // Dark background with subtle gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h))
      grad.addColorStop(0, '#0a0a0f')
      grad.addColorStop(1, '#050508')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Nebula clouds
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.08
      const nebulaX = w * 0.3 + Math.sin(t * 0.1) * 60
      const nebulaY = h * 0.25 + Math.cos(t * 0.15) * 40
      const nebGrad = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, 300)
      nebGrad.addColorStop(0, '#ec4899')
      nebGrad.addColorStop(0.5, '#a855f7')
      nebGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = nebGrad
      ctx.fillRect(0, 0, w, h)

      const neb2X = w * 0.7 - Math.sin(t * 0.12) * 50
      const neb2Y = h * 0.6 + Math.cos(t * 0.08) * 30
      const nebGrad2 = ctx.createRadialGradient(neb2X, neb2Y, 0, neb2X, neb2Y, 250)
      nebGrad2.addColorStop(0, '#fb923c')
      nebGrad2.addColorStop(0.5, '#f97316')
      nebGrad2.addColorStop(1, 'transparent')
      ctx.fillStyle = nebGrad2
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'

      // Stars
      for (const s of stars) {
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.phase))
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Shooting stars
      if (t > nextShootingStar && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.3,
          len: Math.random() * 60 + 40,
          speed: Math.random() * 4 + 3,
          angle: Math.PI / 4 + Math.random() * 0.3,
          opacity: 1,
        })
        nextShootingStar = t + Math.random() * 4 + 3
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.opacity -= 0.008

        if (ss.opacity <= 0 || ss.x > w || ss.y > h) {
          shootingStars.splice(i, 1)
          continue
        }

        ctx.globalAlpha = ss.opacity
        const grad = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len
        )
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(0.3, '#fbbf24')
        grad.addColorStop(1, 'transparent')
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(draw)
    }

    const onResize = () => {
      resize()
    }
    resize()
    rafRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', onResize)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [density])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}
