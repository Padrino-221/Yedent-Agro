import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getSettings, getSubsidiaries, getDepartments, getSalesReps, getProducts } from '@/lib/api'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiBuildingsDuotone, PiUsersDuotone, PiLeafDuotone, PiTruckDuotone, PiShoppingBagDuotone, PiArrowRightDuotone } from 'react-icons/pi'
import { subsidiaryImage, sectorImage } from '@/lib/images'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const subsidiaries = await getSubsidiaries()
  const sub = subsidiaries.find((s) => s.slug === slug)

  if (!sub) return { title: 'Not Found' }

  return {
    title: sub.name,
    description: sub.description,
    openGraph: {
      title: `${sub.name} | ${orgName}`,
      description: sub.description,
    },
  }
}

export default async function SubsidiaryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, subsidiaries, departments, salesReps, products] = await Promise.all([
    getSettings(),
    getSubsidiaries(),
    getDepartments(),
    getSalesReps(),
    getProducts()
  ])

  const sub = subsidiaries.find((s) => s.slug === slug)
  if (!sub) notFound()

  const orgName = settings?.company_name || 'Yedent Agro Group'
  const orgDepartments = departments.filter((d) => d.subsidiary_id === sub.id)
  const orgSalesReps = salesReps.filter((r) => r.subsidiary_id === sub.id)
  const orgProducts = products.filter((p) => p.subsidiary_id === sub.id)

  return (
    <>
      <section className="section-padding bg-cream relative overflow-hidden">
        <div className="container-premium relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Link href="/about/subsidiaries" className="flex w-fit items-center gap-2 text-dark/60 hover:text-dark mb-6 transition-colors">
                <PiArrowRightDuotone className="w-4 h-4 rotate-180" />
                Back to Subsidiaries
              </Link>
              <span className="kicker mb-4">Our Subsidiaries</span>
              <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">{sub.name}</h1>
              <p className="text-dark/75 text-lg leading-relaxed mb-8">{sub.description}</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-lime group">
                  View Products
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="btn-secondary group">
                  Contact Us
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-coral rotate-2" />
              <div className="absolute -inset-4 bg-lime -rotate-3 translate-x-4 translate-y-4" />
              <div className="relative aspect-[4/3] overflow-hidden border-4 border-cream bg-white">
                <Image
                  src={subsidiaryImage(sub.slug)}
                  alt={sub.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      {orgProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker="Products"
              heading={`${sub.name} — Product Portfolio`}
              description="Explore our range of products across consumer foods, industrial bulk, and poultry feed."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="block">
                  <Card className="h-full">
                    <div className="relative aspect-[4/3] overflow-hidden mb-4">
                      <Image
                        src={sectorImage(product.sector)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.fda_registration && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-dark rounded">
                          {product.fda_registration}
                        </div>
                      )}
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-dark/45 font-medium mb-1 block">
                      {product.sector === 'consumer' ? 'Consumer Foods' : product.sector === 'industrial' ? 'Industrial Bulk' : 'Poultry Feed'}
                    </span>
                    <h3 className="text-xl font-serif text-dark mb-2">{product.name}</h3>
                    <p className="text-dark/75 text-sm leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Departments */}
      {orgDepartments.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-premium">
            <SectionHeader
              kicker="Departments"
              heading={`${sub.name} — Departments`}
              description="The specialized departments driving our operations and ensuring excellence across all functions."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgDepartments.map((dept) => (
                <Card key={dept.id} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-lime/20 flex items-center justify-center text-lime">
                    <PiBuildingsDuotone className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-serif text-dark mb-2">{dept.name}</h3>
                  {dept.description && <p className="text-dark/75 text-sm mb-3">{dept.description}</p>}
                  {dept.head_of_department && (
                    <p className="text-dark/70 text-sm font-medium">
                      Head: {dept.head_of_department}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sales Representatives */}
      {orgSalesReps.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker="Sales Network"
              heading={`${sub.name} — Sales Representatives`}
              description="Our dedicated sales team covers key regions across Ghana."
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark/10">
                    <th className="pb-3 font-semibold text-dark">Name</th>
                    <th className="pb-3 font-semibold text-dark">Region</th>
                    <th className="pb-3 font-semibold text-dark">Territory</th>
                    <th className="pb-3 font-semibold text-dark">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {orgSalesReps.map((rep) => (
                    <tr key={rep.id} className="border-b border-dark/5">
                      <td className="py-4 font-medium text-dark">{rep.name}</td>
                      <td className="py-4 text-dark/70">{rep.region}</td>
                      <td className="py-4 text-dark/70">{rep.territory || '—'}</td>
                      <td className="py-4 text-dark/70">
                        <a href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-lime transition-colors">
                          {rep.phone}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </>
  )
}