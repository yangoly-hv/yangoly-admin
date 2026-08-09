const assert = require('node:assert/strict')
const test = require('node:test')

function isMonobankLongJarId(value) {
  return /^[A-Za-z0-9_-]{8,64}$/.test(value)
}

function extractMonobankLongJarId(raw) {
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

    const isWidgetUrl =
      url.pathname.toLowerCase().includes('widget') ||
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
    return null
  }

  return null
}

test('extracts bare longJarId', () => {
  assert.equal(
    extractMonobankLongJarId('4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6'),
    '4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6',
  )
})

test('extracts longJarId from widget builder URL', () => {
  assert.equal(
    extractMonobankLongJarId(
      'https://send.monobank.ua/widget/builder.html?longJarId=4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6&sendId=AU9jJCLcs8',
    ),
    '4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6',
  )
})

test('rejects short share jar URL', () => {
  assert.equal(extractMonobankLongJarId('https://send.monobank.ua/jar/AU9jJCLcs8'), null)
})
