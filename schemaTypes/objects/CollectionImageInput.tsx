import React, {useEffect, useMemo, useRef, useState} from 'react'
import imageUrlBuilder from '@sanity/image-url'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {ObjectInputProps, set, unset, useClient} from 'sanity'
import {
  COLLECTION_IMAGE_TARGET_ASPECT,
  createCollectionImageCrop,
  isCollectionImageCropValid,
} from './collectionImageCrop'
import type {CollectionImageValue} from './collectionImageCrop'
import {getCropAspect, parseImageAssetDimensions} from './tailImageCrop'
import {uploadRotatedImageAsset} from './imageRotation'

type CollectionImageInputProps = ObjectInputProps & {
  onClose?: () => void
  onPathBlur?: (path: unknown[]) => void
  path?: unknown[]
}

const frameSize = {
  width: 705,
  height: 580,
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const getZoomFromCrop = (value?: CollectionImageValue) => {
  const dimensions = parseImageAssetDimensions(value?.asset?._ref)
  const crop = value?.crop

  if (!dimensions || !crop) return 1

  const imageAspect = dimensions.width / dimensions.height
  const baseWidth =
    imageAspect > COLLECTION_IMAGE_TARGET_ASPECT ? COLLECTION_IMAGE_TARGET_ASPECT / imageAspect : 1
  const baseHeight =
    imageAspect > COLLECTION_IMAGE_TARGET_ASPECT ? 1 : imageAspect / COLLECTION_IMAGE_TARGET_ASPECT
  const visibleWidth = 1 - (crop.left || 0) - (crop.right || 0)
  const visibleHeight = 1 - (crop.top || 0) - (crop.bottom || 0)

  if (visibleWidth <= 0 || visibleHeight <= 0) return 1

  return clamp(Math.max(baseWidth / visibleWidth, baseHeight / visibleHeight), 1, 4)
}

export function CollectionImageInput(props: ObjectInputProps) {
  const {onChange, value} = props
  const {onClose, onPathBlur, path} = props as CollectionImageInputProps
  const client = useClient({apiVersion: '2025-01-01'})
  const builder = useMemo(() => imageUrlBuilder(client), [client])
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const imageValue = value as CollectionImageValue | undefined
  const assetRef = imageValue?.asset?._ref
  const hasImage = Boolean(assetRef)
  const aspect = getCropAspect(imageValue)
  const isValid = hasImage && isCollectionImageCropValid(imageValue)
  const [focusX, setFocusX] = useState(0.5)
  const [focusY, setFocusY] = useState(0.5)
  const [zoom, setZoom] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [rotating, setRotating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = hasImage
    ? builder
        .image(imageValue as any)
        .width(frameSize.width)
        .height(frameSize.height)
        .fit('crop')
        .auto('format')
        .url()
    : null

  useEffect(() => {
    setFocusX(clamp(imageValue?.hotspot?.x ?? 0.5, 0, 1))
    setFocusY(clamp(imageValue?.hotspot?.y ?? 0.5, 0, 1))
    setZoom(getZoomFromCrop(imageValue))
  }, [assetRef])

  const applyCrop = (nextFocusX = focusX, nextFocusY = focusY, nextZoom = zoom) => {
    const nextCrop = createCollectionImageCrop(imageValue, {
      focusX: nextFocusX,
      focusY: nextFocusY,
      zoom: nextZoom,
    })

    if (!nextCrop) return false

    onChange([set(nextCrop.crop, ['crop']), set(nextCrop.hotspot, ['hotspot'])])
    return true
  }

  const closeEditor = () => {
    window.setTimeout(() => {
      if (typeof onClose === 'function') {
        onClose()
        return
      }

      if (typeof onPathBlur === 'function' && Array.isArray(path)) {
        onPathBlur(path)
        return
      }

      const dialog = rootRef.current?.closest('[role="dialog"]')
      const closeButton = dialog?.querySelector<HTMLButtonElement>(
        [
          'button[aria-label*="Close"]',
          'button[aria-label*="close"]',
          'button[aria-label*="Закр"]',
          'button[aria-label*="Зачин"]',
          'button[aria-label*="Закры"]',
          'button[data-ui="DialogCloseButton"]',
        ].join(','),
      )

      if (closeButton) {
        closeButton.click()
        return
      }

      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true,
        cancelable: true,
      })

      rootRef.current?.dispatchEvent(escapeEvent)
      document.dispatchEvent(escapeEvent)
    }, 50)
  }

  const saveAndCloseCrop = () => {
    if (applyCrop()) {
      closeEditor()
    }
  }

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  const handleRotateClockwise = async () => {
    if (!hasImage) return

    setRotating(true)
    setError(null)

    try {
      const asset = await uploadRotatedImageAsset(client, imageValue)
      const nextImage: CollectionImageValue & {_type: 'image'} = {
        ...(imageValue || {}),
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        } as CollectionImageValue['asset'],
      }
      const nextCrop = createCollectionImageCrop(nextImage, {focusX: 0.5, focusY: 0.5, zoom: 1})

      setFocusX(0.5)
      setFocusY(0.5)
      setZoom(1)
      onChange(set({...nextImage, ...(nextCrop || {})}))
    } catch (rotateError) {
      setError(rotateError instanceof Error ? rotateError.message : 'Не вдалося повернути фото')
    } finally {
      setRotating(false)
    }
  }

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const asset = await client.assets.upload('image', file, {filename: file.name})
      const nextImage: CollectionImageValue & {_type: 'image'} = {
        ...(imageValue || {}),
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        } as CollectionImageValue['asset'],
      }
      const nextCrop = createCollectionImageCrop(nextImage, {focusX: 0.5, focusY: 0.5, zoom: 1})

      onChange(set({...nextImage, ...(nextCrop || {})}))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Не вдалося завантажити фото')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleFocusXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value)
    setFocusX(nextValue)
    applyCrop(nextValue, focusY, zoom)
  }

  const handleFocusYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value)
    setFocusY(nextValue)
    applyCrop(focusX, nextValue, zoom)
  }

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value)
    setZoom(nextValue)
    applyCrop(focusX, focusY, nextValue)
  }

  return (
    <div ref={rootRef}>
      <Card padding={3} radius={2} border>
        <Stack space={4}>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Фіксований кадр 705:580
              </Text>
              <Text size={1} muted>
                Фото збору на головній сторінці показується у цій горизонтальній рамці.
              </Text>
            </Stack>

            <Flex gap={2}>
              <Button
                mode="ghost"
                tone="primary"
                text={hasImage ? 'Замінити фото' : 'Завантажити фото'}
                disabled={uploading || rotating}
                onClick={handleUploadClick}
              />
              {hasImage && (
                <Button
                  mode="ghost"
                  tone="primary"
                  text={rotating ? 'Повертаємо...' : 'Повернути на 90°'}
                  disabled={uploading || rotating}
                  onClick={handleRotateClockwise}
                />
              )}
              {hasImage && (
                <Button
                  mode="ghost"
                  tone="critical"
                  text="Прибрати"
                  disabled={uploading || rotating}
                  onClick={() => onChange(unset())}
                />
              )}
            </Flex>
          </Flex>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{display: 'none'}}
            onChange={handleFileSelected}
          />

          {error && (
            <Card padding={2} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {hasImage && (
            <Stack space={3}>
              <Box>
                <div
                  style={{
                    aspectRatio: `${frameSize.width} / ${frameSize.height}`,
                    background: '#f1f3f4',
                    borderRadius: 8,
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: frameSize.width,
                  }}
                >
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt=""
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </div>
              </Box>

              <Card padding={2} radius={2} tone={isValid ? 'positive' : 'critical'}>
                <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                  <Text size={1}>
                    {isValid
                      ? `Кадр підходить: ${aspect}:1`
                      : `Кадр не підходить: ${aspect || 'невідомо'}:1. Налаштуйте рамку нижче.`}
                  </Text>
                  <Button mode="ghost" tone="primary" text="Зберегти кадр" onClick={saveAndCloseCrop} />
                </Flex>
              </Card>

              <Stack space={3}>
                <Stack space={2}>
                  <Text size={1}>Фокус по горизонталі</Text>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={focusX}
                    onChange={handleFocusXChange}
                  />
                </Stack>

                <Stack space={2}>
                  <Text size={1}>Фокус по вертикалі</Text>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={focusY}
                    onChange={handleFocusYChange}
                  />
                </Stack>

                <Stack space={2}>
                  <Text size={1}>Масштаб кадру</Text>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.05"
                    value={zoom}
                    onChange={handleZoomChange}
                  />
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Card>
    </div>
  )
}
