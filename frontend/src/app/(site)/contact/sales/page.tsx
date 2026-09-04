import type { Metadata } from 'next'
import { getSettings, getSalesReps, getSubsidiaries, type SalesRep } from '@/lib/api'
import { SectionHeader } from '@/components/SectionComponents'
import { PiPhoneDuotone, PiMapPinDuotone, PiArrowLeftDuotone, PiEnvelopeDuotone } from 'react-icons/pi'
import { settingValue } from '@/lib/settingsUtils'
import { SectionOrbs } from '@/components/ImpactBand'
import Link from 'next/link'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'sales_meta_description',
    'Find Yedent Agro sales representatives across the Bono, Bono East, and Ashanti regions of Ghana.'
  )

  return {
    title: 'Sales Network',
    description,
    openGraph: {
      title: `Sales Network | ${orgName}`,
      description,
    },
  }
}

export default async function SalesNetworkPage() {
  const [settings, salesReps, subsidiaries] = await Promise.all([
    getSettings(),
    getSalesReps(),
    getSubsidiaries()
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'

  // Group sales reps by subsidiary
  const repsBySubsidiary = new Map<string | null, SalesRep[]>()
  salesReps.forEach((rep) => {
    const subId = rep.subsidiary_id
    if (!repsBySubsidiary.has(subId)) repsBySubsidiary.set(subId, [])
    repsBySubsidiary.get(subId)?.push(rep)
  })

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-10 bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <Link href="/contact" className="flex w-fit items-center gap-2 text-dark/60 hover:text-dark mb-8 transition-colors">
            <PiArrowLeftDuotone className="w-4 h-4" />
            {settingValue(settings, 'sales_back_label', 'Back to Contact')}
          </Link>
          <div className="max-w-3xl mx-auto text-center">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'sales_hero_kicker', 'Regional Coverage')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'sales_hero_heading', 'Our Sales Network')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'sales_hero_description', 'Our dedicated sales representatives serve customers across the Bono, Bono East, and Ashanti regions. Find the right contact for your location and product needs.')}
            </p>
          </div>
        </div>
      </section>

      {salesReps.length === 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium text-center py-16">
            <h2 className="text-2xl font-serif text-dark mb-2">{settingValue(settings, 'sales_empty_heading', 'No sales representatives listed yet')}</h2>
            <p className="text-dark/75">{settingValue(settings, 'sales_empty_body', 'Check back soon or contact our head office directly.')}</p>
          </div>
        </section>
      )}

      {Array.from(repsBySubsidiary.entries()).map(([subId, reps]) => {
        const sub = subsidiaries.find((s) => s.id === subId)
        return (
          <section key={subId} className={`section-padding ${sub ? 'bg-white' : 'bg-cream'}`}>
            <div className="container-premium">
              <SectionHeader
                kicker={sub?.focus_area || 'Sales Team'}
                heading={sub ? `${sub.name} — Sales Team` : 'Sales Team'}
                description={`Contact our ${sub?.name || 'sales'} representatives for ordering and distribution inquiries.`}
              />
              <div className="grid md:grid-cols-2 gap-6">
                {reps.map((rep) => (
                  <div key={rep.id} className="card-premium overflow-hidden flex flex-col md:flex-row">
                    <div className="relative shrink-0 aspect-[4/3] md:aspect-auto md:w-[38%] overflow-hidden bg-lime-100/70">
                      {rep.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rep.image_url} alt={rep.name} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-3xl text-lime-800">{initials(rep.name)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6 md:p-7 flex flex-col justify-center items-start">
                      <h3 className="text-xl md:text-2xl font-serif text-dark mb-1.5">{rep.name}</h3>
                      <p className="text-lime-700 text-[11px] font-bold uppercase tracking-[0.18em] mb-3">
                        {settingValue(settings, 'sales_rep_role_label', 'Sales Representative')}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-dark/75 text-sm mb-3">
                        <PiMapPinDuotone className="w-3.5 h-3.5 shrink-0 text-lime-700" />
                        {rep.region}
                        {rep.territory ? ` · ${rep.territory}` : ''}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <a href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-1.5 text-[#214d39] font-semibold text-sm hover:text-[#17392d] transition-colors">
                          <PiPhoneDuotone className="w-4 h-4" />
                          {rep.phone}
                        </a>
                        {rep.email && (
                          <a href={`mailto:${rep.email}`} className="inline-flex items-center gap-1.5 text-dark/70 font-medium text-sm hover:text-dark transition-colors">
                            <PiEnvelopeDuotone className="w-4 h-4" />
                            {rep.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}