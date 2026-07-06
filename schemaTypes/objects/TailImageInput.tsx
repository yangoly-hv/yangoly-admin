import React, {useMemo} from 'react'
import imageUrlBuilder from '@sanity/image-url'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {ObjectInputProps, set, useClient} from 'sanity'
import {
  createFixedAspectCrop,
  getCropAspect,
  isTailImageCropValid,
  TAIL_IMAGE_TARGET_ASPECT,
  TailImageValue,
} from './tailImageCrop'

const previewSize = {
  width: 592,
  height: 492,
}

export function TailImageInput(props: ObjectInputProps) {
  const {onChange, renderDefault, value} = props
  const client = useClient({apiVersion: '2025-01-01'})
  const builder = useMemo(() => imageUrlBuilder(client), [client])
  const imageValue = value as TailImageValue | undefined
  const hasImage = Boolean(imageValue?.asset?._ref)
  const aspect = getCropAspect(imageValue)
  const isValid = hasImage && isTailImageCropValid(imageValue)
  const previewUrl = hasImage
    ? builder
        .image(imageValue as any)
        .width(previewSize.width)
        .height(previewSize.height)
        .fit('crop')
        .auto('format')
        .url()
    : null

  const handleApplyFixedCrop = () => {
    const nextCrop = createFixedAspectCrop(imageValue)

    if (!nextCrop) return

    onChange([set(nextCrop.crop, ['crop']), set(nextCrop.hotspot, ['hotspot'])])
  }

  return (
    <Stack space={3}>
      {renderDefault(props)}

      <Card padding={3} radius={2} border tone={isValid || !hasImage ? 'default' : 'critical'}>
        <Stack space={3}>
          <Flex align="center" justify="space-between" gap={3}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Кадр для фронтенда
              </Text>
              <Text size={1} muted>
                Потрібен горизонтальний кадр {TAIL_IMAGE_TARGET_ASPECT}:1 для картки та сторінки
                хвостика.
              </Text>
            </Stack>

            <Button
              mode="ghost"
              tone="primary"
              text="Застосувати кадр 1.2:1"
              disabled={!hasImage}
              onClick={handleApplyFixedCrop}
            />
          </Flex>

          {hasImage && (
            <Stack space={3}>
              <Card padding={2} radius={2} tone={isValid ? 'positive' : 'critical'}>
                <Text size={1}>
                  {isValid
                    ? `Кадр підходить: ${aspect}:1`
                    : `Кадр не підходить: ${aspect || 'невідомо'}:1. Натисніть кнопку вище.`}
                </Text>
              </Card>

              {previewUrl && (
                <Box>
                  <div
                    style={{
                      aspectRatio: `${previewSize.width} / ${previewSize.height}`,
                      background: '#f1f3f4',
                      borderRadius: 8,
                      overflow: 'hidden',
                      width: '100%',
                      maxWidth: previewSize.width,
                    }}
                  >
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
                  </div>
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
