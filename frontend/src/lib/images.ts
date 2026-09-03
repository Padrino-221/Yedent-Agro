export const subsidiaryImage = (slug: string) => {
  switch (slug) {
    case 'naple-betta-farms':
      return '/images/poultry.jpg'
    case 'yedent-agro-bulk':
      return '/images/grains-burlap.jpg'
    default:
      return '/images/muesli.jpg'
  }
}

export const sectorImage = (sector: string) => {
  switch (sector) {
    case 'poultry_feed':
      return '/images/poultry.jpg'
    case 'industrial':
      return '/images/grains-burlap.jpg'
    default:
      return '/images/cereal.jpg'
  }
}

export const newsImage = '/images/maize-sacks.jpg'
export const contactImage = '/images/maize-sacks.jpg'
export const subsidiaryHeroImage = (slug: string) => subsidiaryImage(slug)
export const productHeroImage = (sector: string) => sectorImage(sector)
