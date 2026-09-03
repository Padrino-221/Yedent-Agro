import type { Metadata } from 'next'
import { Archivo, Archivo_Narrow } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  variable: '--font-archivo-narrow',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Yedent Agro | Affordable Nutrition From Farm To Table',
    template: '%s | Yedent Agro',
  },
  description:
    'Yedent Agro Group of Companies is a wholly Ghanaian owned company producing affordable, convenient and nutritious cereal staple foods, animal feed and poultry products.',
  keywords: [
    'Yedent',
    'agro',
    'Ghana',
    'cereal',
    'maize',
    'soy',
    'fortified food',
    'poultry feed',
    'Tomvita',
    'Koko Plus',
    'Maisoyforte',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivoNarrow.variable}`}>
      <head>
        <meta name="theme-color" content="#233f2e" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
