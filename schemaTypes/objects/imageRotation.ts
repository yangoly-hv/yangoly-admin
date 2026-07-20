import type {SanityClient} from 'sanity'

type ImageValue = {
  asset?: {
    _ref?: string
  }
}

type SanityImageAssetDocument = {
  _id?: string
  url?: string
  mimeType?: string
  originalFilename?: string
  extension?: string
}

const supportedOutputTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const loadImage = async (blob: Blob) => {
  const objectUrl = URL.createObjectURL(blob)
  const image = new Image()

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Could not read image for rotation.'))
      image.src = objectUrl
    })

    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

const canvasToBlob = async (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error('Could not export rotated image.'))
      },
      type,
      0.92,
    )
  })

const getOutputType = (sourceType?: string) =>
  sourceType && supportedOutputTypes.has(sourceType) ? sourceType : 'image/jpeg'

const getExtensionForType = (type: string) => {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'

  return 'jpg'
}

const getRotatedFilename = (asset: SanityImageAssetDocument, outputType: string) => {
  const extension = asset.extension || getExtensionForType(outputType)
  const originalName = asset.originalFilename || `image.${extension}`
  const basename = originalName.replace(/\.[^.]+$/, '')

  return `${basename}-rotated-90.${extension}`
}

const rotateBlobClockwise = async (sourceBlob: Blob) => {
  const image = await loadImage(sourceBlob)
  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!sourceWidth || !sourceHeight || !context) {
    throw new Error('Could not prepare image for rotation.')
  }

  canvas.width = sourceHeight
  canvas.height = sourceWidth

  context.translate(sourceHeight, 0)
  context.rotate(Math.PI / 2)
  context.drawImage(image, 0, 0, sourceWidth, sourceHeight)

  return canvasToBlob(canvas, getOutputType(sourceBlob.type))
}

export const uploadRotatedImageAsset = async (client: SanityClient, value?: ImageValue) => {
  const assetRef = value?.asset?._ref

  if (!assetRef) {
    throw new Error('Image asset is missing.')
  }

  const asset = await client.getDocument<SanityImageAssetDocument>(assetRef)

  if (!asset?.url) {
    throw new Error('Could not find original image URL.')
  }

  const response = await fetch(asset.url)

  if (!response.ok) {
    throw new Error('Could not download original image.')
  }

  const sourceBlob = await response.blob()
  const rotatedBlob = await rotateBlobClockwise(sourceBlob)
  const file = new File([rotatedBlob], getRotatedFilename(asset, rotatedBlob.type), {
    type: rotatedBlob.type,
  })

  return client.assets.upload('image', file, {filename: file.name})
}
