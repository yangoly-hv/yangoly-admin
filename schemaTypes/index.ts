import blockContent from './blockContent'
import blogBlockContent from './blogBlockContent'
import localizedString from './objects/localizedString'
import localizedBlockContent from './objects/localizedBlockContent'
import localizedBlogBlockContent from './objects/localizedBlogBlockContent'
import blogPlainTextBlock from './objects/blogPlainTextBlock'
import blogTextWithImageBlock from './objects/blogTextWithImageBlock'
import blogSingleImageBlock from './objects/blogSingleImageBlock'
import blogGalleryBlock from './objects/blogGalleryBlock'
import tail from './tail'
import post from './post'
import report from './reports'
import events from './events'
import collection from './collection'
import collectionContribution from './collectionContribution'
import donator from './donator'
import perfomance from './perfomance'
import aboutFoundation from './aboutFoundation'
import partner from './partner'
import reportMonthYear from './objects/reportMonthYear'
import donateOrder from './donateOrder'
import encryptedValue from './encryptedValue'
import wayforpayCallback from './wayforpayCallback'
import paymentEffect from './paymentEffect'
import paymentOccurrence from './paymentOccurrence'

export const schemaTypes = [
  reportMonthYear,
  aboutFoundation,
  perfomance,
  partner,
  donator,
  collection,
  collectionContribution,
  events,
  tail,
  post,
  report,
  blockContent,
  blogBlockContent,
  localizedString,
  localizedBlockContent,
  localizedBlogBlockContent,
  blogPlainTextBlock,
  blogTextWithImageBlock,
  blogSingleImageBlock,
  blogGalleryBlock,
]

export const paymentSchemaTypes = [
  encryptedValue,
  donateOrder,
  paymentOccurrence,
  wayforpayCallback,
  paymentEffect,
]
