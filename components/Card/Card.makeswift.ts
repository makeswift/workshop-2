import { Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { Card } from './Card'

runtime.registerComponent(Card, {
  type: 'Card',
  label: 'Card',
  props: {
    className: Style(),
    children: Slot(),
  },
})
