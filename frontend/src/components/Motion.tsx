'use client'

import { Children, cloneElement, isValidElement, ReactNode, useRef, type MouseEvent } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'

/* ------------------------------------------------------------------ */
/* Scroll reveal — slides/rotates child into view with a spring        */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}) {
  const offsets = {
    up: { hidden: { opacity: 0, y: 60, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 } },
    down: { hidden: { opacity: 0, y: -60, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 } },
    left: { hidden: { opacity: 0, x: -70 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 70 }, visible: { opacity: 1, x: 0 } },
    none: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  }[direction] as any

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: offsets.hidden,
        visible: {
          ...offsets.visible,
          transition: { type: 'spring', stiffness: 90, damping: 16, delay, duration: 0.7 },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Stagger container + item — children cascade in with springs.         */
/* IMPORTANT: each child animates on its OWN whileInView (no reliance   */
/* on parent->child variant propagation), so items can never stay       */
/* hidden if the browser's IntersectionObserver behaves unexpectedly    */
/* (a common cause of invisible content on mobile devices).             */
/* ------------------------------------------------------------------ */
export function RevealStagger({
  children,
  className,
  gap = 0.1,
}: {
  children: ReactNode
  className?: string
  gap?: number
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) =>
        isValidElement(child)
          ? cloneElement(child as any, { staggerDelay: (child.props as any).staggerDelay ?? i * gap })
          : child
      )}
    </div>
  )
}

export function RevealItem({
  children,
  className,
  direction = 'up',
  staggerDelay = 0,
}: {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  staggerDelay?: number
}) {
  const hidden = {
    up: { opacity: 0, y: 40, scale: 0.98 },
    down: { opacity: 0, y: -40, scale: 0.98 },
    left: { opacity: 0, x: -50 },
    right: { opacity: 0, x: 50 },
    none: { opacity: 0, scale: 0.9 },
  }[direction] as any

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: 'spring', stiffness: 110, damping: 14, delay: staggerDelay, duration: 0.7 }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Parallax — child drifts / scales based on scroll position           */
/* ------------------------------------------------------------------ */
export function Parallax({
  children,
  from = -60,
  to = 60,
  className,
}: {
  children?: ReactNode
  from?: number
  to?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [from, to])
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* ParallaxScale — child scales as it enters/exits viewport            */
/* ------------------------------------------------------------------ */
export function ParallaxScale({
  children,
  from = 0.9,
  to = 1,
  className,
}: {
  children: ReactNode
  from?: number
  to?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [from, to]), { stiffness: 60, damping: 20 })
  return (
    <motion.div ref={ref} style={{ scale }} className={className}>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* TiltCard — 3D tilt + glow following the cursor on hover             */
/* ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const rotateX = useSpring(useTransform(gy, [0, 100], [maxTilt, -maxTilt]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(gx, [0, 100], [-maxTilt, maxTilt]), { stiffness: 150, damping: 20 })
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(175,230,127,0.18), transparent 60%)`

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    gx.set(((e.clientX - rect.left) / rect.width) * 100)
    gy.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  function onLeave() {
    gx.set(50)
    gy.set(50)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className={`relative [perspective:1000px] ${className || ''}`}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: glare }}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* LiftCard — simulates 3D depth on hover (elevates inner content)     */
/* ------------------------------------------------------------------ */
export function LiftCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
