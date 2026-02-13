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
import donator from './donator'
import perfomance from './perfomance'
import aboutFoundation from './aboutFoundation'
import aboutFounders from './aboutFounders'
import donateOrder from './donateOrder'

export const schemaTypes = [
  donateOrder,
  aboutFounders,
  aboutFoundation,
  perfomance,
  donator,
  collection,
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
