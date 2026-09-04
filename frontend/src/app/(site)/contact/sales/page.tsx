import type { Metadata } from 'next'
import { getSettings, getSalesReps, getSubsidiaries, type SalesRep } from '@/lib/api'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiPhoneDuotone, PiMapPinDuotone, PiUserDuotone, PiArrowLeftDuotone, PiCaretDownDuotone } from 'react-icons/pi'
import { settingValue } from '@/lib/settingsUtils'
import { SectionOrbs } from '@/components/ImpactBand'
import Link from 'next/link'

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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reps.map((rep) => (
                  <Card key={rep.id} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-lime/20 flex items-center justify-center text-lime">
                      <PiUserDuotone className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-serif text-dark mb-1">{rep.name}</h3>
                    <p className="text-dark/75 text-sm font-medium mb-4">{settingValue(settings, 'sales_rep_role_label', 'Sales Representative')}</p>
                    <div className="flex justify-center gap-2 text-xs text-dark/75 mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-cream rounded">
                        <PiMapPinDuotone className="w-3 h-3" />
                        {rep.region}
                      </span>
                      {rep.territory && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-cream rounded">
                          {rep.territory}
                        </span>
                      )}
                    </div>
                    <a href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-2 text-[#214d39] font-semibold text-sm hover:text-[#17392d] transition-colors">
                      <PiPhoneDuotone className="w-4 h-4" />
                      {rep.phone}
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}