import { useEffect, useRef, useState } from 'react'

export default function CountUp({ end, duration = 2, suffix = '', prefix = '', decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            const value = eased * end
            setCount(decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.round(value))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, decimals])

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  )
}
