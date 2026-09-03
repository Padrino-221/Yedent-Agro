'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getHeroSlides } from '@/lib/api'
import type { HeroSlide } from '@/lib/api'

export default function HeroCarousel({ initialSlides }: { initialSlides?: HeroSlide[] | null }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides ?? [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(!initialSlides)

  useEffect(() => {
    if (!initialSlides) {
      getHeroSlides()
        .then((data) => { setSlides(data); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [initialSlides])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length === 0) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [slides.length, nextSlide])

  if (loading || slides.length === 0) return null

  const slide = slides[currentIndex]

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-end overflow-hidden">
      {/* Per-slide media background (keyed so it swaps when slide changes) */}
      <div key={currentIndex}>
        {slide.video_url ? (
          <video
            key="video"
            autoPlay
            muted
            loop
            playsInline
            suppressHydrationWarning
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={slide.video_url} type="video/mp4" />
          </video>
        ) : slide.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key="image"
            src={slide.image_url}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            key="fallback"
            autoPlay
            muted
            loop
            playsInline
            suppressHydrationWarning
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/yedent-hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Slide text + CTA — positioned at bottom */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                {/* Left: text */}
                <div className="max-w-3xl text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-serif text-white leading-[1.1] tracking-tight mb-6">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="text-lg sm:text-xl text-white/80 mb-3 font-medium">
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.description && (
                    <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-8 max-w-2xl">
                      {slide.description}
                    </p>
                  )}
                </div>

                {/* Right: CTA buttons */}
                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  {slide.cta_label && slide.cta_href && (
                    <Link
                      href={slide.cta_href}
                      className="bg-[#96e048] hover:bg-[#83cc37] text-[#162e1e] font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 transition-all duration-200"
                    >
                      {slide.cta_label}
                    </Link>
                  )}
                  <Link
                    href="/contact"
                    className="border border-white/90 bg-black/20 hover:bg-white hover:text-[#162e1e] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 transition-all duration-200 backdrop-blur-sm"
                  >
                    REQUEST A QUOTE
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicator dots */}
          <div className="mt-12 flex items-center gap-2 pb-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`py-3 transition-opacity ${
                  index === currentIndex ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <span
                  className={`block h-1 transition-all duration-300 ${
                    index === currentIndex ? 'bg-white w-10' : 'bg-white/40 w-5'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
