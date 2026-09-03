import type { Partner } from '@/lib/api'

function PartnerRow({ partners, hidden }: { partners: Partner[]; hidden?: boolean }) {
  return (
    <div
      className="flex items-center gap-12 md:gap-16 pr-12 md:pr-16"
      aria-hidden={hidden || undefined}
    >
      {partners.map((p) =>
        p.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.id}
            src={p.logo_url}
            alt=""
            className="h-9 md:h-11 w-auto max-w-[180px] object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          />
        ) : null
      )}
    </div>
  )
}

export default function PartnersCarousel({ partners }: { partners: Partner[] | null }) {
  const list = partners ?? []
  if (list.length === 0) return null

  return (
    <div className="partner-marquee overflow-x-auto md:overflow-hidden partner-scroll">
      <div className="partner-track">
        <PartnerRow partners={list} />
        <PartnerRow partners={list} hidden />
      </div>
    </div>
  )
}
