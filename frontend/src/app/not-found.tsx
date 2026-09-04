import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotFoundView from '@/components/NotFoundView'
import { getSettings } from '@/lib/api'

// Handles URLs that match no route at all (e.g. /some-typo). Because an
// unmatched URL never enters the (site) layout, we render the public
// header/footer here explicitly. Detail pages that call notFound() render
// the (site)/not-found.tsx boundary instead, so chrome is never duplicated.
export default async function NotFound() {
  const settings = await getSettings()

  return (
    <>
      <Header initialSettings={settings} />
      <main>
        <NotFoundView />
      </main>
      <Footer initialSettings={settings} />
    </>
  )
}
