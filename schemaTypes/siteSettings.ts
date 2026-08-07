import {defineField, defineType, type Rule} from 'sanity'

const socialHostAllowlists = {
  instagram: ['instagram.com'],
  facebook: ['facebook.com', 'fb.com'],
  twitter: ['twitter.com', 'x.com'],
  telegram: ['t.me', 'telegram.me', 'telegram.org'],
  youtube: ['youtube.com', 'youtu.be'],
} as const

type SocialNetwork = keyof typeof socialHostAllowlists

const hostMatchesAllowlist = (hostname: string, allowedHosts: readonly string[]) => {
  const host = hostname.toLowerCase().replace(/^www\./, '')
  return allowedHosts.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  )
}

const validateSocialUrl =
  (network: SocialNetwork) =>
  (rule: Rule) =>
    rule.uri({scheme: ['https'], allowRelative: false}).custom((value: unknown) => {
      if (value == null || value === '') return true
      if (typeof value !== 'string') return 'Некоректне посилання'
      try {
        const {hostname} = new URL(value)
        if (!hostMatchesAllowlist(hostname, socialHostAllowlists[network])) {
          return `Посилання має бути з домену ${socialHostAllowlists[network].join(', ')}`
        }
        return true
      } catch {
        return 'Некоректне посилання'
      }
    })

export default defineType({
  name: 'siteSettings',
  title: 'Налаштування сайту',
  type: 'document',
  fields: [
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      validation: validateSocialUrl('instagram'),
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
      validation: validateSocialUrl('facebook'),
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter / X',
      type: 'url',
      validation: validateSocialUrl('twitter'),
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram',
      type: 'url',
      validation: validateSocialUrl('telegram'),
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube',
      type: 'url',
      validation: validateSocialUrl('youtube'),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Налаштування сайту',
      }
    },
  },
})
