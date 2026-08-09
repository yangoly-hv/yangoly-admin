import {useCallback, useState} from 'react'
import {Box, Button, Dialog, Flex, Stack, Text, TextArea, TextInput} from '@sanity/ui'
import {set, unset, type StringInputProps} from 'sanity'

import {extractMonobankLongJarId} from './monobankLongJarId'

export function MonobankLongJarIdInput(props: StringInputProps) {
  const {value, onChange, readOnly, elementProps} = props
  const [open, setOpen] = useState(false)
  const [pasteValue, setPasteValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const applyExtracted = useCallback(
    (raw: string) => {
      const extracted = extractMonobankLongJarId(raw)
      if (!extracted) {
        setError(
          'Не вдалося знайти longJarId. Вставте URL віджета з параметром longJarId=… або сам ідентифікатор.',
        )
        return false
      }
      onChange(set(extracted))
      setError(null)
      return true
    },
    [onChange],
  )

  const handleFieldChange = useCallback(
    (event: {currentTarget: {value: string}}) => {
      const next = event.currentTarget.value
      if (!next.trim()) {
        onChange(unset())
        setError(null)
        return
      }
      const extracted = extractMonobankLongJarId(next)
      if (extracted && extracted !== next.trim()) {
        onChange(set(extracted))
        setError(null)
        return
      }
      onChange(set(next))
      setError(null)
    },
    [onChange],
  )

  const handleApplyPaste = useCallback(() => {
    if (applyExtracted(pasteValue)) {
      setOpen(false)
      setPasteValue('')
    }
  }, [applyExtracted, pasteValue])

  return (
    <Stack space={3}>
      <Flex gap={2} align="flex-end">
        <Box flex={1}>
          <TextInput
            {...elementProps}
            value={value ?? ''}
            readOnly={readOnly}
            onChange={handleFieldChange}
            placeholder="4Spjosp6Hv79FHD52mw49Hjb4ydFJ8z6"
          />
        </Box>
        <Button
          mode="ghost"
          text="Вставити URL"
          disabled={readOnly}
          onClick={() => {
            setError(null)
            setPasteValue('')
            setOpen(true)
          }}
        />
      </Flex>

      {error ? (
        <Text size={1} style={{color: 'var(--card-badge-critical-fg-color)'}}>
          {error}
        </Text>
      ) : null}

      {open ? (
        <Dialog
          header="Вставити посилання віджета Monobank"
          id="monobank-long-jar-id-paste"
          onClose={() => {
            setOpen(false)
            setPasteValue('')
            setError(null)
          }}
          width={1}
          footer={
            <Flex gap={2} justify="flex-end" padding={3}>
              <Button
                mode="ghost"
                text="Скасувати"
                onClick={() => {
                  setOpen(false)
                  setPasteValue('')
                  setError(null)
                }}
              />
              <Button text="Витягти longJarId" tone="primary" onClick={handleApplyPaste} />
            </Flex>
          }
        >
          <Box padding={4}>
            <Stack space={3}>
              <Text size={1} muted>
                Вставте повне посилання з «Віджет для стрімів», наприклад builder.html?longJarId=…
                Поле збереже лише longJarId.
              </Text>
              <TextArea
                rows={4}
                value={pasteValue}
                onChange={(event) => {
                  setPasteValue(event.currentTarget.value)
                  setError(null)
                }}
                placeholder="https://send.monobank.ua/widget/builder.html?longJarId=…&sendId=…"
              />
              {error ? (
                <Text size={1} style={{color: 'var(--card-badge-critical-fg-color)'}}>
                  {error}
                </Text>
              ) : null}
            </Stack>
          </Box>
        </Dialog>
      ) : null}
    </Stack>
  )
}
