import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getSettings, getProductBySlug } from '@/lib/api'
import YouTubeVideo from '@/components/YouTubeVideo'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiShoppingBagDuotone, PiLeafDuotone, PiArrowRightDuotone, PiCaretLeftDuotone, PiShieldCheckDuotone, PiPackageDuotone } from 'react-icons/pi'
import { sectorImage } from '@/lib/images'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const product = await getProductBySlug(slug).catch(() => null)

  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${orgName}`,
      description: product.description,
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, product] = await Promise.all([
    getSettings(),
    getProductBySlug(slug).catch(() => null)
  ])

  if (!product) notFound()

  const orgName = settings?.company_name || 'Yedent Agro Group'
  const subsidiary = product.subsidiary

  // Separate macro and micro nutrients
  const macroNutrients = product.nutrition.filter((n) => n.category === 'macro')
  const microNutrients = product.nutrition.filter((n) => n.category === 'micro')

  return (
    <>
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <Link href="/products" className="flex w-fit items-center gap-2 text-dark/60 hover:text-dark mb-8 transition-colors">
            <PiCaretLeftDuotone className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden border-4 border-cream bg-white">
                <Image
                  src={sectorImage(product.sector)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {product.videos.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {product.videos.map((video, i) => (
                    <YouTubeVideo
                      key={i}
                      videoUrl={video.video_url}
                      title={video.title || `Product Video ${i + 1}`}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <Link href={`/about/subsidiaries/${subsidiary?.slug}`} className="inline-flex items-center gap-2 text-dark/60 hover:text-dark mb-4 transition-colors">
                <PiShoppingBagDuotone className="w-4 h-4" />
                {subsidiary?.name}
              </Link>
              <span className="kicker mb-4">
                {product.sector === 'consumer' ? 'Consumer Foods' : product.sector === 'industrial' ? 'Industrial Bulk' : 'Poultry Feed'}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-4">{product.name}</h1>

              {product.fda_registration && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-dark rounded mb-4">
                  <PiShieldCheckDuotone className="w-3 h-3" />
                  FDA Registered: {product.fda_registration}
                </div>
              )}

              <p className="text-dark/75 text-lg leading-relaxed mb-8">{product.description}</p>

              {product.allergens && (
                <div className="mb-6 p-4 bg-dark/5 rounded-lg border border-dark/10">
                  <p className="text-sm text-dark/70"><strong>Allergen Information:</strong> {product.allergens}</p>
                </div>
              )}

              {product.net_weight && (
                <p className="text-dark/70 font-medium mb-2">Net Weight: {product.net_weight}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-lime group">
                  Inquire About This Product
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/products" className="btn-secondary group">
                  View All Products
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nutritional Information */}
      {(macroNutrients.length > 0 || microNutrients.length > 0) && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker="Nutrition Facts"
              heading="Nutritional Information"
              description="Complete macro and micronutrient profile per serving."
            />
            <div className="grid lg:grid-cols-2 gap-12">
              {macroNutrients.length > 0 && (
                <Card>
                  <h3 className="text-xl font-serif text-dark mb-4 flex items-center gap-2">
                    <PiLeafDuotone className="w-5 h-5 text-lime" />
                    Macronutrients
                  </h3>
                  <div className="space-y-3">
                    {macroNutrients.map((nutrient) => (
                      <div key={nutrient.nutrient} className="flex justify-between py-2 border-b border-dark/10 last:border-0">
                        <span className="text-dark/70">{nutrient.nutrient}</span>
                        <span className="font-semibold text-dark">
                          {nutrient.value} {nutrient.unit || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {microNutrients.length > 0 && (
                <Card>
                  <h3 className="text-xl font-serif text-dark mb-4 flex items-center gap-2">
                    <PiPackageDuotone className="w-5 h-5 text-lime" />
                    Micronutrients
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {microNutrients.map((nutrient) => (
                      <div key={nutrient.nutrient} className="py-2 px-3 bg-cream rounded border border-dark/10">
                        <p className="text-xs text-dark/75 font-medium">{nutrient.nutrient}</p>
                        <p className="font-semibold text-dark">
                          {nutrient.value} {nutrient.unit || ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Preparation Steps */}
      {product.preparation_steps.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-premium">
            <SectionHeader
              kicker="Preparation"
              heading="How to Prepare"
              description="Follow these steps for the best results."
            />
            <div className="max-w-2xl mx-auto space-y-4">
              {product.preparation_steps.map((step) => (
                <Card key={step.step_number} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-lime flex items-center justify-center flex-shrink-0 font-extrabold text-dark">
                    {step.step_number}
                  </div>
                  <p className="text-dark/70 leading-relaxed pt-1">{step.instruction}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Storage Instructions */}
      {product.storage_instructions && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker="Storage"
              heading="Storage Instructions"
              description="Proper storage ensures product quality and safety."
            />
            <Card>
              <p className="text-dark/70 leading-relaxed">{product.storage_instructions}</p>
            </Card>
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <SectionHeader
            kicker="Related"
            heading="You may also like"
            description="Explore more products from our portfolio."
          />
        </div>
      </section>
    </>
  )
}