import Link from 'next/link'
import {
  PiHouseDuotone,
  PiBuildingsDuotone,
  PiPackageDuotone,
  PiNewspaperDuotone,
  PiArrowRightDuotone,
  PiMapTrifoldDuotone,
} from 'react-icons/pi'

const quickLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Subsidiaries', href: '/about/subsidiaries' },
  { label: 'News & Events', href: '/news' },
  { label: 'Sales Network', href: '/contact/sales' },
]

const destinations = [
  {
    href: '/',
    label: 'Home',
    description: 'Back to the Yedent Agro homepage.',
    icon: PiHouseDuotone,
  },
  {
    href: '/about',
    label: 'About the Group',
    description: 'Our story, subsidiaries and awards.',
    icon: PiBuildingsDuotone,
  },
  {
    href: '/products',
    label: 'Our Products',
    description: 'Fortified foods, animal feed and ingredients.',
    icon: PiPackageDuotone,
  },
  {
    href: '/news',
    label: 'News & Events',
    description: 'Latest announcements and exhibitions.',
    icon: PiNewspaperDuotone,
  },
]

export default function NotFoundView() {
  return (
    <>
      {/* 404 hero */}
      <section className="relative overflow-hidden bg-[#233F2E]">
        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 dots-white opacity-30" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #AFE67F26, transparent 65%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-36 -left-24 w-[26rem] h-[26rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #AFE67F14, transparent 65%)' }}
        />

        <div className="container-premium relative py-24 md:py-32 text-center">
          <span className="kicker-light justify-center mb-8">Oops — Wrong Turn</span>

          <div
            aria-hidden
            className="font-extrabold leading-none text-lime mb-10 select-none"
            style={{ fontFamily: "'Archivo', sans-serif", fontSize: 'clamp(6rem, 20vw, 13rem)', letterSpacing: '-0.03em' }}
          >
            404
          </div>

          <h1 className="sr-only">Page not found</h1>
          <h2 className="text-3xl md:text-5xl font-serif text-cream leading-[1.1] mb-6 max-w-3xl mx-auto">
            Nothing&rsquo;s growing on this page
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mx-auto">
            The page you were looking for may have been moved or harvested already.
            Let&rsquo;s guide you back to fertile ground.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link href="/" className="btn-lime">
              Back to Home
              <PiArrowRightDuotone className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.06em] transition-all duration-300 border-2 border-white/80 text-white hover:bg-white hover:text-[#233F2E]"
              style={{ fontFamily: "'Archivo Narrow', sans-serif", borderRadius: 5 }}
            >
              Get in Touch
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-[0.08em] px-5 py-2.5 text-white/75 border border-white/25 hover:text-[#12281c] hover:bg-lime hover:border-lime transition-colors"
                style={{ fontFamily: "'Archivo Narrow', sans-serif", borderRadius: 5 }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="kicker justify-center mb-4">Explore the Site</span>
            <h2 className="text-3xl md:text-4xl font-serif text-dark leading-[1.1] mb-4">
              Popular Destinations
            </h2>
            <p className="text-dark/70 text-lg leading-relaxed">
              Jump straight to what you&rsquo;re looking for.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map(({ href, label, description, icon: Icon }) => (
              <Link key={href} href={href} className="group h-full">
                <div className="card-premium h-full flex flex-col p-7">
                  <span className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-lime/20 text-[#233F2E] mb-5">
                    <Icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-lg font-serif text-dark mb-2">{label}</h3>
                  <p className="text-dark/70 text-sm leading-relaxed mb-5 flex-1">{description}</p>
                  <span className="inline-flex items-center gap-2 text-[#233F2E] font-bold text-xs uppercase tracking-[0.08em] group-hover:gap-3.5 transition-all" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
                    Visit
                    <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-[#233F2E] font-bold text-sm uppercase tracking-[0.06em] hover:text-lime-700 transition-colors"
              style={{ fontFamily: "'Archivo Narrow', sans-serif" }}
            >
              <PiMapTrifoldDuotone className="w-4 h-4" />
              Still stuck? Contact our team
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
