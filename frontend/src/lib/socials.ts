import type { IconType } from 'react-icons'
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaThreads,
  FaSnapchat,
  FaPinterestP,
  FaTelegram,
  FaGlobe,
} from 'react-icons/fa6'
import type { SiteSettings } from './api'
import { settingValue } from './settingsUtils'

export interface SocialLink {
  platform: string
  url: string
  Icon: IconType
}

interface PlatformIcon {
  matcher: RegExp
  Icon: IconType
}

const platformIcons: PlatformIcon[] = [
  { matcher: /facebook/, Icon: FaFacebookF },
  { matcher: /instagram/, Icon: FaInstagram },
  { matcher: /(^|\W)x($|\W)|twitter/, Icon: FaXTwitter },
  { matcher: /linkedin/, Icon: FaLinkedinIn },
  { matcher: /youtube/, Icon: FaYoutube },
  { matcher: /tiktok/, Icon: FaTiktok },
  { matcher: /whatsapp/, Icon: FaWhatsapp },
  { matcher: /threads/, Icon: FaThreads },
  { matcher: /snapchat/, Icon: FaSnapchat },
  { matcher: /pinterest/, Icon: FaPinterestP },
  { matcher: /telegram/, Icon: FaTelegram },
]

function iconForPlatform(platform: string): IconType {
  const normalized = platform.toLowerCase().trim()
  const match = platformIcons.find((p) => p.matcher.test(normalized))
  return match?.Icon ?? FaGlobe
}

interface SocialRow {
  platform?: string
  url?: string
}

/**
 * Resolve the social links to render.
 *
 * Primary source is the `social_links` JSON array edited in the CMS (Site
 * Settings → Company & Contact → Social media). When that key was never
 * saved yet, falls back to the legacy fixed facebook/instagram/twitter/
 * linkedin keys so existing sites keep showing their icons.
 */
export function getSocialLinks(settings: SiteSettings | null | undefined): SocialLink[] {
  const raw = settings?.['social_links']
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return (parsed as SocialRow[])
          .filter((s) => s.url && s.url.trim())
          .map((s) => ({
            platform: (s.platform || '').trim() || 'Social',
            url: s.url!.trim(),
            Icon: iconForPlatform(s.platform || ''),
          }))
      }
    } catch {
      // fall through to legacy keys
    }
  }

  const legacy = [
    { platform: 'Facebook', url: settingValue(settings, 'facebook_url', 'https://facebook.com') },
    { platform: 'Instagram', url: settingValue(settings, 'instagram_url', 'https://instagram.com') },
    { platform: 'X', url: settingValue(settings, 'twitter_url', 'https://x.com') },
    { platform: 'LinkedIn', url: settingValue(settings, 'linkedin_url', 'https://linkedin.com') },
  ]
  return legacy
    .filter((s) => s.url.trim() !== '')
    .map((s) => ({ platform: s.platform, url: s.url.trim(), Icon: iconForPlatform(s.platform) }))
}
