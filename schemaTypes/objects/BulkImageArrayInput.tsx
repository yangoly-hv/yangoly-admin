import React, {useRef, useState} from 'react'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {ArrayOfObjectsInputProps, insert, setIfMissing, useClient} from 'sanity'
import {randomKey} from '@sanity/util/content'
import {createReportImageCrop} from './reportImageCrop'
import type {ReportImageValue} from './reportImageCrop'

type ImageArrayItem = ReportImageValue & {
  _key: string
  _type: 'image'
  asset?: {
    _type: 'reference'
    _ref: string
  }
}

export function BulkImageArrayInput(props: ArrayOfObjectsInputProps<ImageArrayItem>) {
  const {onChange, renderDefault} = props
  const client = useClient({apiVersion: '2025-01-01'})
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePickFiles = () => {
    inputRef.current?.click()
  }

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setUploading(true)
    setError(null)

    try {
      const uploadedItems: ImageArrayItem[] = []

      for (const file of files) {
        const asset = await client.assets.upload('image', file, {
          filename: file.name,
        })

        const nextImage: ImageArrayItem = {
          _type: 'image',
          _key: randomKey(),
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        }
        const nextCrop = createReportImageCrop(nextImage, {focusX: 0.5, focusY: 0.5, zoom: 1})

        uploadedItems.push({...nextImage, ...(nextCrop || {})})
      }

      onChange([setIfMissing([]), insert(uploadedItems, 'after', [-1])])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не вдалося завантажити файли')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone="transparent" border>
        <Stack space={3}>
          <Flex gap={2} align="center">
            <Button
              text={uploading ? 'Завантаження...' : 'Завантажити декілька зображень'}
              onClick={handlePickFiles}
              disabled={uploading}
            />
            <Text size={1} muted>
              Можна завантажити декілька файлів
            </Text>
          </Flex>

          {error && (
            <Card padding={2} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{display: 'none'}}
            onChange={handleFilesSelected}
          />
        </Stack>
      </Card>

      {renderDefault(props)}
    </Stack>
  )
}
