'use client'

import { ReactNode } from 'react'
import { Parallax, Reveal } from '@/components/Motion'

interface ImpactStat {
  value: string
  label: string
}

export function ImpactBand({
  kicker,
  heading,
  body,
  stats,
  children,
}: {
  kicker: string
  heading: string
  body?: string
  stats?: ImpactStat[]
  children?: ReactNode
}) {
  return (
    <section className="section-padding bg-[#233F2E] relative overflow-hidden">
      <Parallax
        from={-40}
        to={40}
        className="absolute top-16 -left-24 w-72 h-72 bg-lime/10 rounded-full blur-3xl pointer-events-none"
      />
      <Parallax
        from={50}
        to={-40}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none"
      />
      <div className="container-premium relative">
        <Reveal>
          <div className="max-w-3xl">
            <span className="kicker-light mb-6">{kicker}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-cream leading-[1.05] mb-6">
              {heading}
            </h2>
            {body && <p className="text-cream/70 text-lg leading-relaxed max-w-2xl">{body}</p>}
          </div>
        </Reveal>

        {stats && stats.length > 0 && (
          <Reveal className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/15 pt-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-4xl md:text-5xl font-serif text-lime mb-2">{s.value}</div>
                  <div className="text-sm uppercase tracking-widest text-cream/60">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  )
}

/** Decorative soft lime orbs for flat light (cream/white) hero sections. */
export function SectionOrbs({ light = true }: { light?: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl opacity-70"
        style={{ background: light ? 'radial-gradient(circle, #AFE67F22, transparent 65%)' : 'radial-gradient(circle, #AFE67F18, transparent 65%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-24 w-80 h-80 rounded-full blur-3xl opacity-60"
        style={{ background: light ? 'radial-gradient(circle, #AFE67F20, transparent 65%)' : 'radial-gradient(circle, #AFE67F14, transparent 65%)' }}
      />
    </>
  )
}

export default ImpactBand
