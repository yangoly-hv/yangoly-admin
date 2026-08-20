const JAR_HOST = 'send.monobank.ua'
const SEND_ID_PATTERN = /^[A-Za-z0-9_-]{6,16}$/

const isMonobankSendId = (value: string): boolean => SEND_ID_PATTERN.test(value)

/**
 * Normalize a public Monobank jar share link from CMS.
 * Accepts http(s) send.monobank.ua/jar/{sendId} or a bare sendId.
 */
export const parseMonobankJarUrl = (raw: unknown): string | null => {
  if (typeof raw !== 'string') return null

  const trimmed = raw.trim()
  if (!trimmed) return null

  if (isMonobankSendId(trimmed)) {
    return `https://${JAR_HOST}/jar/${trimmed}`
  }

  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(withScheme)
    const host = url.hostname.replace(/^www\./i, '').toLowerCase()
    if (host !== JAR_HOST) return null

    const match = url.pathname.match(/^\/jar\/([A-Za-z0-9_-]{6,16})\/?$/)
    const sendId = match?.[1]
    if (!sendId || !isMonobankSendId(sendId)) return null

    return `https://${JAR_HOST}/jar/${sendId}`
  } catch {
    return null
  }
}
