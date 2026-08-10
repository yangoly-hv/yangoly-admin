import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {paymentSchemaTypes} from './schemaTypes'
import {myStructure} from './deskStructure'
import {paymentsStructure} from './paymentsDeskStructure'
import {TailDonationBadge} from './schemaTypes/tailDonationBadge'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'vintpwoh'

const contributionTypes = new Set(['collectionContribution', 'tailContribution'])

export default defineConfig([
  {
    name: 'content',
    title: 'Yangoly admin',
    basePath: '/content',
    projectId,
    dataset: process.env.SANITY_STUDIO_CONTENT_DATASET || 'production',
    plugins: [structureTool({structure: myStructure}), visionTool()],
    document: {
      actions: (previousActions, context) =>
        contributionTypes.has(context.schemaType) ? [] : previousActions,
      badges: (previousBadges, context) =>
        context.schemaType === 'tail'
          ? [TailDonationBadge, ...previousBadges]
          : previousBadges,
    },
    schema: {types: schemaTypes},
  },
  {
    name: 'payments',
    title: 'Yangoly payments',
    basePath: '/payments',
    projectId,
    dataset: process.env.SANITY_STUDIO_PAYMENTS_DATASET || 'payments',
    plugins: [structureTool({structure: paymentsStructure})],
    document: {
      actions: () => [],
    },
    schema: {types: paymentSchemaTypes},
  },
])
