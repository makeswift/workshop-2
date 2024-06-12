import dynamic from 'next/dynamic'

import { MakeswiftComponentType } from '@makeswift/runtime'
import {
  Checkbox,
  Link,
  List,
  Number,
  Shape,
  Slot,
  Style,
  TextInput,
} from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { Carousel } from './Carousel'

runtime.registerComponent(Carousel, {
  type: MakeswiftComponentType.Carousel,
  label: 'Carousel',
  icon: 'carousel',
  props: {
    slides: List({
      type: Shape({
        type: {
          title: TextInput({ label: 'Title', defaultValue: '' }),
          item: Slot(),
          link: Link({ label: 'Link' }),
        },
      }),
      getItemLabel(slide) {
        return slide?.title || 'Slide'
      },
    }),
    itemsShown: Number({ label: 'Items Shown', defaultValue: 1 }),
    className: Style(),
    autoplay: Number({
      label: 'Autoplay',
      defaultValue: 0,
      step: 0.1,
      suffix: 's',
      selectAll: true,
    }),
    showDots: Checkbox({ label: 'Show Dots', defaultValue: false }),
    showArrows: Checkbox({ label: 'Show Arrows', defaultValue: true }),
  },
})
