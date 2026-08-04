import { useEffect, useRef, useMemo } from 'react'

export default function ParticleStars({ count = 50 }) {
  const canvasRef = useRef(null)

  const stars = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.0003 + 0.0001,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }))
  }, [count])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      time += 1

      stars.forEach((star) => {
        const x = star.x * w
        const y = star.y * h

        if (!prefersReducedMotion) {
          star.y -= star.speed
          if (star.y < -0.02) star.y = 1.02
        }

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        const alpha = star.opacity * (prefersReducedMotion ? 1 : twinkle)

        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 166, 74, ${alpha})`
        ctx.fill()

        // Glow
        if (star.size > 1.5) {
          ctx.beginPath()
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(212, 166, 74, ${alpha * 0.1})`
          ctx.fill()
        }
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [stars])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
