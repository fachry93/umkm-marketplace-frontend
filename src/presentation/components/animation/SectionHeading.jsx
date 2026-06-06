import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function SectionHeading({ label, title, subtitle, accent, align = 'left' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const alignClass = align === 'center' ? 'text-center items-center' : 'items-start'
  
  return (
    <motion.div ref={ref} className={`flex flex-col gap-1 mb-6 ${alignClass}`}>
      {label && (
        <motion.span
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-sans font-semibold tracking-widest text-primary-600 uppercase"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-stone-800 leading-tight"
      >
        {title}{' '}
        {accent && <span className="text-primary-600">{accent}</span>}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-sans text-stone-500 text-sm md:text-base max-w-lg"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.35 }}
        style={{ originX: align === 'center' ? 0.5 : 0 }}
        className="h-0.5 w-12 bg-primary-500 rounded-full mt-1"
      />
    </motion.div>
  )
}
