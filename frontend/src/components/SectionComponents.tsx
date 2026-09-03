'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PiArrowRightDuotone } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import { settingValue } from '@/lib/settingsUtils'

export function CTABlock() {
  const { settings } = useSettings()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-dark px-8 md:px-16 lg:px-24 py-20 md:py-28 text-center relative overflow-hidden"
    >
      <div className="absolute -top-10 right-10 w-64 h-64 bg-sky/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-64 h-64 bg-coral/15 rounded-full blur-3xl pointer-events-none" />

      <span className="kicker-light justify-center mb-8">{settingValue(settings, 'cta_kicker', 'Partner With Us')}</span>
      <h2 className="text-4xl md:text-6xl font-serif text-cream leading-[1.02] mx-auto max-w-3xl text-balance mb-8">
        {settingValue(settings, 'cta_heading', 'Let\'s build a more nourished Ghana together')}
      </h2>
      <p className="text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
        {settingValue(settings, 'cta_body', 'Whether you\'re a distributor, institution, farmer, or development partner — we\'re ready to collaborate.')}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/contact" className="btn-lime !px-8 !py-4 text-base group">
          {settingValue(settings, 'cta_contact_label', 'Contact Us')}
          <PiArrowRightDuotone className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
        <Link href="/products" className="btn-white group !px-8 !py-4 text-base">
          {settingValue(settings, 'cta_products_label', 'Explore Products')}
          <PiArrowRightDuotone className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

interface SectionHeaderProps {
  kicker: string
  heading: string
  description?: string
  descriptionAlign?: 'left' | 'right'
  className?: string
}

export function SectionHeader({ kicker, heading, description, descriptionAlign = 'right', className }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 ${className || ''}`}>
      <div>
        <span className="kicker mb-6">{kicker}</span>
        <h2 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] max-w-2xl">
          {heading}
        </h2>
      </div>
      {description && (
        <p className={`text-dark/75 leading-relaxed max-w-sm text-lg ${descriptionAlign === 'right' ? 'text-right lg:text-right' : ''}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div className={`card-premium p-8 ${hover ? '' : ''} ${className || ''}`}>
      {children}
    </div>
  )
}

export interface FeatureCardProps {
  icon: React.ReactNode
  subtitle: string
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, subtitle, title, description, className }: FeatureCardProps) {
  return (
    <div className={`card-premium overflow-hidden h-full flex flex-col ${className || ''}`}>
      <div className="flex flex-col flex-1 p-6">
        <div className="w-12 h-12 rounded-xl bg-lime/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-dark/45 font-medium mb-1">{subtitle}</p>
        <h3 className="text-2xl font-serif text-dark mb-3">{title}</h3>
        <p className="text-dark/75 leading-relaxed flex-1">{description}</p>
      </div>
    </div>
  )
}

export interface SimpleCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
  footer?: React.ReactNode
}

export function SimpleCard({ title, description, icon, className, footer }: SimpleCardProps) {
  return (
    <div className={`bg-white border border-dark/10 p-6 ${className || ''}`}>
      {icon && <div className="w-10 h-10 rounded-lg bg-lime/20 flex items-center justify-center mb-4 text-lime">{icon}</div>}
      <h3 className="text-xl font-serif text-dark mb-2">{title}</h3>
      {description && <p className="text-dark/75 text-sm leading-relaxed mb-4">{description}</p>}
      {footer && <div className="mt-4 pt-4 border-t border-dark/10">{footer}</div>}
    </div>
  )
}