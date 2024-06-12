import { Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import Hero from './Hero'

runtime.registerComponent(Hero, {
  type: 'Hero',
  label: 'Hero',
  props: {
    className: Style(),
  },
})
