import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

export function CountUp({ to, duration = 1200, suffix = '' }) {
  const ref = useRef()
  const [wrapRef, inView] = useInView({ threshold: 0.5, triggerOnce: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = (to / duration) * 16
    const timer = setInterval(() => {
      start = Math.min(start + step, to)
      if (ref.current) ref.current.textContent = Math.round(start) + suffix
      if (start >= to) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to, duration, suffix])
  return <span ref={(el) => { ref.current = el; wrapRef(el) }}>0{suffix}</span>
}
