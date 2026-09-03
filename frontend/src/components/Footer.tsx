'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiChevronRight, FiArrowUp } from 'react-icons/fi'
import { PiPhoneDuotone, PiEnvelopeDuotone, PiMapPinDuotone, PiClockDuotone, PiArrowRightDuotone, PiBuildingsDuotone, PiLeafDuotone } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import { settingValue } from '@/lib/settingsUtils'
import { getSocialLinks } from '@/lib/socials'
import type { SiteSettings } from '@/lib/api'

const footerLinks = [
  { setting: 'footer_link_about', name: 'About Us', href: '/about' },
  { setting: 'footer_link_subsidiaries', name: 'Our Subsidiaries', href: '/about/subsidiaries' },
  { setting: 'footer_link_products', name: 'Products', href: '/products' },
  { setting: 'footer_link_departments', name: 'Departments', href: '/departments' },
  { setting: 'footer_link_awards', name: 'Awards & Recognition', href: '/about/awards' },
  { setting: 'footer_link_news', name: 'News & Events', href: '/news' },
]

const subsidiaryLinks = [
  { name: 'Yedent Agro Foods', href: '/about/subsidiaries/yedent-agro-foods', icon: PiLeafDuotone },
  { name: 'Yedent Agro Bulk', href: '/about/subsidiaries/yedent-agro-bulk', icon: PiBuildingsDuotone },
  { name: 'Naple Betta Farms', href: '/about/subsidiaries/naple-betta-farms', icon: PiLeafDuotone },
]

export default function Footer({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const orgName = settingValue(settings, 'company_name', 'Yedent Agro Group')
  const tagline = settingValue(settings, 'tagline', '')
  const description = settingValue(
    settings,
    'footer_description',
    'A wholly Ghanaian owned agricultural company producing affordable, convenient and nutritious cereal staple foods, animal feed and poultry products.'
  )
  const phonePrimary = settingValue(settings, 'phone_primary', '+233 (0)20 816 6021')
  const phoneSecondary = settingValue(settings, 'phone_secondary', '+233 (0)24 321 2389')
  const email = settingValue(settings, 'email', 'info@yedentghana.com')
  const address = settingValue(settings, 'head_office_address', 'P.O. Box 1306, Sunyani – Bono Region, Ghana')

  const socials = getSocialLinks(settings)

  if (loading) return null

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#233F2E] to-[#12281c] text-white">
      {/* Decorative background */}
      <div className="absolute -top-28 -right-24 w-[28rem] h-[28rem] bg-[#AFE67F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -left-28 w-[30rem] h-[30rem] bg-[#AFE67F]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Lime CTA band */}
      <div className="relative">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 pt-10 lg:pt-14">
          <div className="bg-[#AFE67F] text-[#12281c] relative overflow-hidden">
            <div className="absolute -right-10 -top-16 w-64 h-64 bg-white/25 rounded-full blur-2xl pointer-events-none" />
            <div className="relative px-6 sm:px-10 py-8 lg:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-block bg-[#12281c] text-[#AFE67F] text-xs font-bold uppercase tracking-[0.06em] px-3 py-1.5 mb-4" style={{ fontFamily: "'Archivo Narrow', sans-serif", borderRadius: 5 }}>
                  {settingValue(settings, 'footer_cta_badge', 'Get In Touch')}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  {settingValue(settings, 'footer_cta_heading', 'Ready to partner with Yedent?')}
                </h3>
                <p className="text-[#12281c]/75 mt-2 text-sm sm:text-base">
                  {settingValue(settings, 'footer_cta_body', 'From fortified foods to industrial ingredients and poultry feed — our team is ready to serve you.')}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#12281c] text-[#AFE67F] text-sm font-bold uppercase tracking-[0.06em] px-6 py-3.5 transition-colors hover:bg-white hover:text-[#12281c]"
                  style={{ borderRadius: 5, fontFamily: "'Archivo Narrow', sans-serif" }}
                >
                  {settingValue(settings, 'footer_cta_quote_button', 'Request a Quote')}
                  <PiArrowRightDuotone className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 border-2 border-[#12281c] text-[#12281c] text-sm font-bold uppercase tracking-[0.06em] px-6 py-3.5 transition-colors hover:bg-[#12281c] hover:text-white"
                  style={{ borderRadius: 5, fontFamily: "'Archivo Narrow', sans-serif" }}
                >
                  {settingValue(settings, 'footer_cta_products_button', 'Browse Products')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid gap-12 lg:gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-5 group">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
                  <Image src="/yedent-logo.png" alt="Yedent logo" width={44} height={44} className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-bold text-white leading-tight" style={{ fontFamily: "'Archivo', sans-serif" }}>
                  {orgName}
                </span>
              </Link>
              {tagline && (
                <p className="text-sm italic text-white/40 mb-4">{tagline}</p>
              )}
              <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-7">
                {description}
              </p>
              <div className="flex items-center gap-3">
                {socials.map(({ platform, url, Icon }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={platform}
                    className="w-10 h-10 inline-flex items-center justify-center border border-white/20 text-white/75 hover:bg-[#AFE67F] hover:text-[#12281c] hover:border-[#AFE67F] transition-colors"
                    style={{ borderRadius: 5 }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div className="lg:col-span-2">
              <span className="kicker-light mb-5">{settingValue(settings, 'footer_explore_title', 'Explore')}</span>
              <ul className="space-y-2.5">
                {footerLinks.map((link) => (
                  <li key={link.setting}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
                    >
                      <FiChevronRight className="w-3.5 h-3.5 text-[#AFE67F]/70 group-hover:translate-x-0.5 transition-transform" />
                      {settingValue(settings, link.setting, link.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subsidiaries */}
            <div className="lg:col-span-3">
              <span className="kicker-light mb-5">{settingValue(settings, 'footer_group_title', 'Our Group')}</span>
              <ul className="space-y-2.5">
                {subsidiaryLinks.map(({ name, href, icon: Icon }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-2.5 text-white/60 hover:text-white text-sm transition-colors"
                    >
                      <span className="w-7 h-7 inline-flex items-center justify-center rounded bg-[#AFE67F]/15 text-[#AFE67F] group-hover:bg-[#AFE67F] group-hover:text-[#12281c] transition-colors" style={{ borderRadius: 5 }}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="group-hover:translate-x-0.5 transition-transform">{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact */}
              <div className="mt-7 pt-6 border-t border-white/10 space-y-3 text-sm">
                <a href={`tel:${phonePrimary.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2.5 text-white/60 hover:text-[#AFE67F] transition-colors">
                  <PiPhoneDuotone className="w-4 h-4 text-[#AFE67F]" /> {phonePrimary}
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-white/60 hover:text-[#AFE67F] transition-colors">
                  <PiEnvelopeDuotone className="w-4 h-4 text-[#AFE67F]" /> {email}
                </a>
                <div className="flex items-start gap-2.5 text-white/60">
                  <PiMapPinDuotone className="w-4 h-4 text-[#AFE67F] mt-0.5" /> <span>{address}</span>
                </div>
              </div>
            </div>

            {/* Hours / quick badge */}
            <div className="lg:col-span-3">
              <span className="kicker-light mb-5">{settingValue(settings, 'footer_hours_title', 'Office Hours')}</span>
              <div className="bg-white/5 border border-white/10 p-5 mb-6" style={{ borderRadius: 5 }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <PiClockDuotone className="w-4 h-4 text-[#AFE67F]" />
                  <span className="text-sm font-semibold text-white">{settingValue(settings, 'footer_hours_days', 'Monday – Friday')}</span>
                </div>
                <p className="text-white/60 text-sm mb-1">{settingValue(settings, 'footer_hours_time', '8:00 AM – 5:00 PM')}</p>
                <p className="text-white/60 text-sm">{settingValue(settings, 'footer_hours_timezone', 'Weekdays, GMT')}</p>
              </div>
              <Link
                href="/contact/sales"
                className="inline-flex items-center gap-2 text-[#AFE67F] hover:text-white text-sm font-bold uppercase tracking-[0.06em] transition-colors"
                style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
              >
                {settingValue(settings, 'footer_sales_link_label', 'Sales Network')}
                <PiArrowRightDuotone className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/35 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} {orgName} of Companies Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex gap-5 text-xs text-white/35">
              <Link href="/about" className="hover:text-white/70 transition-colors">{settingValue(settings, 'footer_privacy_label', 'Privacy')}</Link>
              <Link href="/about" className="hover:text-white/70 transition-colors">{settingValue(settings, 'footer_terms_label', 'Terms')}</Link>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-11 h-11 inline-flex items-center justify-center border border-white/20 text-white/70 hover:bg-[#AFE67F] hover:text-[#12281c] hover:border-[#AFE67F] transition-colors"
              style={{ borderRadius: 5 }}
              aria-label="Back to top"
            >
              <FiArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
