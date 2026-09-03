import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/api'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <>
      <Header initialSettings={settings} />
      <main>{children}</main>
      <Footer initialSettings={settings} />
    </>
  )
}
