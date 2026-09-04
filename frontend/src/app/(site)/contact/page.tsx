import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings } from '@/lib/api'
import { Card } from '@/components/SectionComponents'
import Link from 'next/link'
import { PiPhoneDuotone, PiEnvelopeDuotone, PiMapPinDuotone, PiArrowRightDuotone, PiClockDuotone, PiGlobeDuotone } from 'react-icons/pi'
import { contactImage } from '@/lib/images'
import { settingValue } from '@/lib/settingsUtils'
import { SectionOrbs } from '@/components/ImpactBand'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'contact_meta_description',
    'Get in touch with Yedent Agro Group. Contact our head office or find our regional sales network.'
  )

  return {
    title: 'Contact Us',
    description,
    openGraph: {
      title: `Contact Us | ${orgName}`,
      description,
    },
  }
}

export default async function ContactPage() {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-10 bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'contact_hero_kicker', 'Get In Touch')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'contact_hero_heading', 'Contact Yedent Agro')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'contact_hero_description', 'Whether you have a question about our products, want to inquire about wholesale orders, or are interested in partnership opportunities, our team is ready to help.')}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <span className="kicker mb-4">{settingValue(settings, 'contact_head_kicker', 'Head Office')}</span>
              <h2 className="text-3xl font-serif text-dark mb-8">{settingValue(settings, 'contact_head_heading', 'Our Main Contacts')}</h2>

              <div className="space-y-6">
                {settings?.head_office_address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-lime/20 flex items-center justify-center text-lime flex-shrink-0">
                      <PiMapPinDuotone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark">{settingValue(settings, 'contact_address_label', 'Address')}</p>
                      <p className="text-dark/75">{settings.head_office_address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-lime/20 flex items-center justify-center text-lime flex-shrink-0">
                    <PiPhoneDuotone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{settingValue(settings, 'contact_phone_label', 'Phone')}</p>
                    <p className="text-dark/75">
                      {[settings?.phone_primary, settings?.phone_secondary].filter((p): p is string => !!p).map((p) => (
                        <a key={p} href={`tel:${p.replace(/[^0-9+]/g, '')}`} className="block text-[#214d39] hover:text-[#17392d] transition-colors">
                          {p}
                        </a>
                      )) || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-lime/20 flex items-center justify-center text-lime flex-shrink-0">
                    <PiEnvelopeDuotone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{settingValue(settings, 'contact_email_label', 'Email')}</p>
                    <p className="text-dark/75">
                      <a href={`mailto:${settings?.email}`} className="hover:text-lime transition-colors">
                        {settings?.email}
                      </a>
                    </p>
                  </div>
                </div>

                {settings?.working_hours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-lime/20 flex items-center justify-center text-lime flex-shrink-0">
                      <PiClockDuotone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark">{settingValue(settings, 'contact_hours_label', 'Working Hours')}</p>
                      <p className="text-dark/75 whitespace-pre-line">{settings.working_hours}</p>
                    </div>
                  </div>
                )}

                {settings?.website && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-lime/20 flex items-center justify-center text-lime flex-shrink-0">
                      <PiGlobeDuotone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark">{settingValue(settings, 'contact_website_label', 'Website')}</p>
                      <p className="text-dark/75">
                        <a href={settings.website} target="_blank" rel="noopener noreferrer" className="hover:text-lime transition-colors">
                          {settings.website}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8">
              <span className="kicker mb-4">{settingValue(settings, 'contact_form_kicker', 'Send a Message')}</span>
              <h2 className="text-2xl font-serif text-dark mb-6">{settingValue(settings, 'contact_form_heading', 'We\'d Love to Hear From You')}</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1" htmlFor="name">{settingValue(settings, 'contact_form_name_label', 'Name')}</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-dark/15 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime"
                      placeholder={settingValue(settings, 'contact_form_name_placeholder', 'Your name')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1" htmlFor="email">{settingValue(settings, 'contact_form_email_label', 'Email')}</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-dark/15 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime"
                      placeholder={settingValue(settings, 'contact_form_email_placeholder', 'Your email')}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1" htmlFor="subject">{settingValue(settings, 'contact_form_subject_label', 'Subject')}</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 border border-dark/15 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime"
                    placeholder={settingValue(settings, 'contact_form_subject_placeholder', 'How can we help?')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1" htmlFor="message">{settingValue(settings, 'contact_form_message_label', 'Message')}</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-dark/15 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime"
                    placeholder={settingValue(settings, 'contact_form_message_placeholder', 'Your message')}
                    required
                  />
                </div>
                <button type="submit" className="btn-lime w-full justify-center group">
                  {settingValue(settings, 'contact_form_submit', 'Send Message')}
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Sales Network CTA */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <Card className="p-10 md:p-14">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="kicker mb-4">{settingValue(settings, 'contact_sales_kicker', 'Regional Coverage')}</span>
                <h2 className="text-3xl font-serif text-dark mb-4">{settingValue(settings, 'contact_sales_heading', 'Looking for Local Sales?')}</h2>
                <p className="text-dark/75 leading-relaxed mb-6">
                  {settingValue(settings, 'contact_sales_body', 'Our sales network covers the Bono, Bono East, and Ashanti regions, with dedicated representatives ready to serve you across all three subsidiaries.')}
                </p>
                <Link href="/contact/sales" className="btn-lime group inline-flex">
                  {settingValue(settings, 'contact_sales_button', 'Find Your Local Representative')}
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-lime rotate-2" />
                <div className="relative aspect-[4/3] border-4 border-cream bg-white overflow-hidden">
                  <Image src={contactImage} alt="Regional distribution" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}