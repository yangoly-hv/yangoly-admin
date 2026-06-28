import {useCallback, useRef} from 'react'
import {ObjectInputProps, StringInputProps, useClient, useFormValue} from 'sanity'

type LocalizedString = {
  en?: string
  uk?: string
}

type ReportDate = {
  month?: number
  year?: number
}

const reportMonths = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

const transliterationMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ye',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'yi',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'yu',
  я: 'ya',
  ё: 'yo',
  ы: 'y',
  э: 'e',
  ъ: '',
}

export function slugifyDocumentValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .split('')
    .map((char) => transliterationMap[char] ?? char)
    .join('')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sourceFromLocalizedString(value?: LocalizedString) {
  return value?.en || value?.uk || ''
}

export function sourceFromReportDate(value?: ReportDate) {
  const {month, year} = value || {}

  if (!month || !year) return ''

  return `${reportMonths[month - 1]}-${year}`
}

function getPublishedId(documentId?: string) {
  return documentId?.replace(/^drafts\./, '')
}

async function isSlugAvailable(client: any, slug: string, documentType: string, documentId?: string) {
  const publishedId = getPublishedId(documentId) ?? ''
  const draftId = publishedId ? `drafts.${publishedId}` : ''

  return client.fetch(
    `!defined(*[
      _type == $documentType &&
      slug.current == $slug &&
      !(_id in [$publishedId, $draftId])
    ][0]._id)`,
    {documentType, slug, publishedId, draftId}
  )
}

async function getUniqueSlug(
  client: any,
  baseSlug: string,
  documentType: string,
  documentId?: string
) {
  for (let index = 0; index < 100; index += 1) {
    const candidate = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`

    if (await isSlugAvailable(client, candidate, documentType, documentId)) {
      return candidate
    }
  }

  return `${baseSlug}-${Date.now()}`
}

export async function isUniqueDocumentSlug(slug: string, context: any) {
  const documentType = context.document?._type

  if (!documentType) return true

  const client = context.getClient({apiVersion: '2025-05-15'})

  return isSlugAvailable(client, slug, documentType, context.document?._id)
}

function useAutoSlug(sourceValue: string) {
  const client = useClient({apiVersion: '2025-05-15'})
  const documentId = useFormValue(['_id']) as string | undefined
  const documentType = useFormValue(['_type']) as string | undefined
  const currentSlug = useFormValue(['slug', 'current']) as string | undefined
  const isGenerating = useRef(false)

  return useCallback(() => {
    if (isGenerating.current || currentSlug || !documentId || !documentType) return

    const baseSlug = slugifyDocumentValue(sourceValue)

    if (!baseSlug) return

    isGenerating.current = true

    getUniqueSlug(client, baseSlug, documentType, documentId)
      .then((slug) =>
        client
          .patch(documentId)
          .set({slug: {_type: 'slug', current: slug}})
          .commit()
      )
      .finally(() => {
        isGenerating.current = false
      })
  }, [client, currentSlug, documentId, documentType, sourceValue])
}

export function AutoSlugFromLocalizedStringInput(props: ObjectInputProps<LocalizedString>) {
  const handleBlur = useAutoSlug(sourceFromLocalizedString(props.value))

  return <div onBlur={handleBlur}>{props.renderDefault(props)}</div>
}

export function AutoSlugFromStringInput(props: StringInputProps) {
  const handleBlur = useAutoSlug(props.value || '')

  return <div onBlur={handleBlur}>{props.renderDefault(props)}</div>
}

export function AutoSlugFromReportDateInput(props: ObjectInputProps<ReportDate>) {
  const handleBlur = useAutoSlug(sourceFromReportDate(props.value))

  return <div onBlur={handleBlur}>{props.renderDefault(props)}</div>
}
