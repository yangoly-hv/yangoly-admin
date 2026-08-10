import type {DocumentBadgeComponent} from 'sanity'

export const TailDonationBadge: DocumentBadgeComponent = (props) => {
  const amountCollected =
    (props.draft as {amountCollected?: number} | null)?.amountCollected ??
    (props.published as {amountCollected?: number} | null)?.amountCollected ??
    0

  if (!(typeof amountCollected === 'number' && amountCollected > 0)) {
    return null
  }

  return {
    label: 'Цільовий донат',
    title: `Зібрано ${amountCollected} грн. Встановіть 0 після опрацювання.`,
    color: 'warning',
  }
}
