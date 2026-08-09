/**
 * Extract a Monobank widget longJarId from a raw id or a pasted URL.
 * Accepts:
 * - bare longJarId
 * - widget builder URLs with ?longJarId=
 * - widget links with ?jar= (long id only; not send.monobank.ua/jar/{short})
 */
export const isMonobankLongJarId = (value: string): boolean =>
  /^[A-Za-z0-9_-]{8,64}$/.test(value)

export const extractMonobankLongJarId = (raw: string): string | null => {
  const trimmed = raw.trim()
  if (!trimmed) return null

  if (isMonobankLongJarId(trimmed)) return trimmed

  const fromQueryText = trimmed.match(/[?&#]longJarId=([A-Za-z0-9_-]{8,64})/i)
  if (fromQueryText?.[1] && isMonobankLongJarId(fromQueryText[1])) {
    return fromQueryText[1]
  }

  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(withScheme)
    const longJarId = url.searchParams.get('longJarId')
    if (longJarId && isMonobankLongJarId(longJarId.trim())) {
      return longJarId.trim()
    }

    // Widget “copy” links use ?jar=<longJarId>, not the short share path /jar/{sendId}.
    const isWidgetUrl =
      url.pathname.toLowerCase().includes('widget') ||
      url.searchParams.has('longJarId') ||
      (url.hostname.replace(/^www\./i, '').toLowerCase() === 'send.monobank.ua' &&
        url.searchParams.has('jar') &&
        !/^\/jar\//i.test(url.pathname))

    if (isWidgetUrl) {
      const jarParam = url.searchParams.get('jar')
      if (jarParam && isMonobankLongJarId(jarParam.trim()) && jarParam.trim().length >= 20) {
        return jarParam.trim()
      }
    }
  } catch {
    // Not a URL — fall through.
  }

  return null
}
