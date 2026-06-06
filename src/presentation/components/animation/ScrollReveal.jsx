import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function ScrollReveal({ children, delay = 0, direction = 'up', className }) {
  const [ref, inView] = useInView({ threshold: 0.12, triggerOnce: true })
  const yFrom = direction === 'up' ? 28 : direction === 'down' ? -28 : 0
  const xFrom = direction === 'left' ? 28 : direction === 'right' ? -28 : 0
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: yFrom, x: xFrom }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
