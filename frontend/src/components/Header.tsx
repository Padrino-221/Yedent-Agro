'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FiPhone, FiMail, FiSearch, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6'
import { useSettings } from '@/lib/useSettings'
import { settingValue } from '@/lib/settingsUtils'
import type { SiteSettings } from '@/lib/api'

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Subsidiaries', href: '/about/subsidiaries' },
      { name: 'Awards', href: '/about/awards' },
    ],
  },
  { name: 'Products', href: '/products' },
  { name: 'Departments', href: '/departments' },
  { name: 'News & Events', href: '/news' },
  {
    name: 'Contacts',
    href: '/contact',
    children: [
      { name: 'Sales Network', href: '/contact/sales' },
    ],
  },
]

export default function Header({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { settings } = useSettings(initialSettings)
  const phonePrimary = settingValue(settings, 'phone_primary', '+233 20 816 6021')
  const email = settingValue(settings, 'email', 'info@yedentghana.com')
  const facebookUrl = settingValue(settings, 'facebook_url', 'https://facebook.com')
  const instagramUrl = settingValue(settings, 'instagram_url', 'https://instagram.com')
  const twitterUrl = settingValue(settings, 'twitter_url', 'https://x.com')

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isHome = pathname === '/'

  return (
    <header className={`${isHome ? 'absolute' : 'relative'} top-0 left-0 right-0 z-50 w-full`}>
      {/* Top contact bar */}
      <div className="bg-[#1c3826] text-white border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Mobile: compact single row */}
          <div className="lg:hidden flex items-center justify-between py-3">
            <a
              href={`tel:${phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-white/90"
            >
              <FiPhone className="w-4 h-4 text-[#82db58]" />
              <span className="text-sm font-medium">{phonePrimary}</span>
            </a>
            <div className="flex items-center text-white/80">
              <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex items-center justify-center w-11 h-11 hover:text-[#82db58] transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex items-center justify-center w-11 h-11 hover:text-[#82db58] transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href={twitterUrl} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="flex items-center justify-center w-11 h-11 hover:text-[#82db58] transition-colors">
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Desktop: full row */}
          <div className="hidden lg:flex items-center justify-between py-4 text-sm">
            <div className="flex items-center gap-5">
              <a href={`tel:${phonePrimary.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 text-white/90 hover:text-[#82db58] transition-colors">
                <FiPhone className="w-4 h-4 text-[#82db58]" />
                <span className="font-medium">{phonePrimary}</span>
              </a>
              <span className="text-white/30">|</span>
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-white/90 hover:text-[#82db58] transition-colors">
                <FiMail className="w-4 h-4 text-[#82db58]" />
                <span className="font-medium">{email}</span>
              </a>
              <span className="text-white/30">|</span>
              <Link href="/contact" className="text-[#82db58] hover:text-white font-bold uppercase tracking-wider text-sm transition-colors">
                REQUEST A QUOTE
              </Link>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#82db58] transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#82db58] transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href={twitterUrl} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="hover:text-[#82db58] transition-colors">
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header overlaying Hero */}
      <nav className={`${isHome ? 'bg-transparent' : 'bg-[#233F2E]'} border-b border-white/15 text-white px-4 sm:px-8 lg:px-12 py-5 lg:py-6`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shrink-0">
              <Image
                src="/yedent-logo.png"
                alt="Yedent Agro Group Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center font-body">
              <span className="text-3xl font-bold tracking-normal text-white uppercase leading-none" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '0.02em' }}>
                YEDENT
              </span>
              <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase mt-1" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
                AGRO GROUP OF COMPANIES
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-7">
            {navigation.map((item) => {
              const active = isActive(item.href)
              const hasChildren = item.children && item.children.length > 0
              if (!hasChildren) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-base font-semibold tracking-wide transition-all py-1 ${
                      active
                        ? 'text-white border-b-2 border-[#82db58]'
                        : 'text-white/90 hover:text-[#82db58]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              }
              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-base font-semibold tracking-wide transition-all py-1 ${
                      active
                        ? 'text-white border-b-2 border-[#82db58]'
                        : 'text-white/90 hover:text-[#82db58]'
                    }`}
                  >
                    {item.name}
                    <FiChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:rotate-180 transition-transform" />
                  </Link>
                  <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-[#12281c] border border-white/10 py-2 min-w-[180px]">
                      {item.children!.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-white/85 hover:text-[#82db58] hover:bg-white/5 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Header Right Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white/90 hover:text-[#82db58] transition-colors p-1"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            <Link
              href="/products"
              className="border border-white/90 text-white hover:bg-white hover:text-[#12281c] font-bold text-sm tracking-wider uppercase px-6 py-3 transition-all duration-200"
            >
              BUY PRODUCTS
            </Link>
          </div>

          {/* Mobile menu hamburger toggle */}
          <button
            type="button"
            className="lg:hidden p-3 text-white/90 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search input bar popup */}
        {searchOpen && (
          <div className="max-w-[1400px] mx-auto mt-3 py-2 px-4 bg-white/10 rounded-md border border-white/20 flex items-center gap-3">
            <FiSearch className="w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Search products, news, subsidiaries..."
              className="bg-transparent text-white text-sm focus:outline-none w-full placeholder-white/50"
              autoFocus
            />
            <button onClick={() => setSearchOpen(false)} className="text-white/70 hover:text-white text-xs">
              Close
            </button>
          </div>
        )}

        {/* Mobile menu — full-screen overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-0 left-0 z-[60] bg-[#12281c] flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white shrink-0">
                  <Image
                    src="/yedent-logo.png"
                    alt="Yedent Agro Group Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center font-body">
                  <span className="text-xl font-bold tracking-normal text-white uppercase leading-none" style={{ fontFamily: "'Archivo', sans-serif", letterSpacing: '0.02em' }}>
                    YEDENT
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase mt-1" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
                    AGRO GROUP OF COMPANIES
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/90 hover:text-white"
                aria-label="Close menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex flex-col">
              {navigation.map((item) => {
                const hasChildren = item.children && item.children.length > 0
                return (
                  <div key={item.name}>
                    {hasChildren ? (
                      <>
                        <Link
                          href={item.href}
                          className={`block py-3 px-3 text-base font-semibold rounded ${
                            isActive(item.href) ? 'text-[#82db58] bg-white/10' : 'text-white/90 hover:bg-white/5'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <div className="pl-4 flex flex-col gap-1.5 mt-1 mb-3">
                          {item.children!.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="py-2.5 px-3 text-base font-medium text-white/70 hover:text-[#82db58] rounded"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block py-3 px-3 text-base font-semibold rounded ${
                          isActive(item.href) ? 'text-[#82db58] bg-white/10' : 'text-white/90 hover:bg-white/5'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
              })}

              <div className="mt-6 pt-4 border-t border-white/10 px-1">
                <Link
                  href="/products"
                  className="w-full block text-center border border-white/90 text-white font-bold text-sm tracking-wider uppercase py-3 px-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  BUY PRODUCTS
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}