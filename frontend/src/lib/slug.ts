export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Fill in the slug field when it's empty, based on the name. */
export function autoSlug(name: string, currentSlug: string | null | undefined): string {
  if (currentSlug && currentSlug.trim().length > 0) return currentSlug
  return slugify(name)
}