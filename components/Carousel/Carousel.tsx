'use client'

import { Ref, forwardRef, useEffect, useState } from 'react'

import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import debounce from 'lodash.debounce'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'

type Slide = {
  title?: string
  item?: React.ReactNode
  link?: {
    href: string
    target?: '_self' | '_blank'
  }
}

type Props = {
  className?: string
  loop?: boolean
  autoplay?: number
  slides: Slide[]
  itemsShown: number
  showDots: boolean
  showArrows: boolean
}

const fullConfig = resolveConfig(tailwindConfig)

function getMobileBreakpoint() {
  // @ts-expect-error tailwind types are generic
  const breakpoint = fullConfig?.theme?.screens?.sm

  if (breakpoint == null) {
    console.warn('Missing mobile breakpoint, Carousel falling back to 576px.')

    return '(min-width: 576px)'
  }

  return `(min-width: ${breakpoint})`
}

function getTabletBreakpoint() {
  // @ts-expect-error tailwind types are generic
  const breakpoint = fullConfig?.theme?.screens?.lg

  if (breakpoint == null) {
    console.warn('Missing tablet breakpoint, Carousel falling back to 1024px.')

    return '(min-width: 1024px)'
  }

  return `(min-width: ${breakpoint})`
}

export const Carousel = forwardRef(function Carousel(
  {
    className,
    slides,
    itemsShown,
    loop = true,
    autoplay = 0,
    showDots = false,
    showArrows = true,
  }: Props,
  ref: Ref<HTMLDivElement>
) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      slides: { perView: itemsShown, origin: 'auto', spacing: 12 },
      loop,
      selector: ':scope > div',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
    },
    [
      slider => {
        const debouncedUpdate = debounce(() => slider.update(), 100)
        const observer = new ResizeObserver(() => debouncedUpdate())

        slider.on('created', () => observer.observe(slider.container))
        slider.on('destroyed', () => observer.unobserve(slider.container))
      },
    ]
  )

  useEffect(() => {
    if (autoplay > 0) {
      const intervalId = setInterval(() => instanceRef.current?.next(), autoplay * 1000)

      return () => clearInterval(intervalId)
    }
  }, [instanceRef, autoplay])

  function prevSlide() {
    const slider = instanceRef.current
    if (!slider) return
    slider.moveToIdx(slider.track.details.rel - 1)
  }

  function nextSlide() {
    const slider = instanceRef.current
    if (!slider) return
    slider.moveToIdx(slider.track.details.rel + 1)
  }

  return (
    <div className={clsx(className)} ref={ref}>
      {slides.length > 0 ? (
        <div className="flex flex-col">
          <div
            tabIndex={-1}
            onKeyDown={e => {
              switch (e.key) {
                default:
                  break
                case 'Left':
                case 'ArrowLeft':
                  prevSlide()
                  break
                case 'Right':
                case 'ArrowRight':
                  nextSlide()
                  break
              }
            }}
            className="relative focus:outline-0"
          >
            <div
              className="relative flex w-full touch-pan-y select-none items-center overflow-hidden drop-shadow-2xl focus:outline-0"
              ref={sliderRef}
            >
              {slides.map((slide, index) => (
                <div key={index} className="relative">
                  {/* {slide.imageUrl && <Image fill src={slide.imageUrl} alt={slide.imageAlt ?? ''} />} */}
                  {slide?.item}
                </div>
              ))}
            </div>

            {slides.length > itemsShown && showArrows && (
              <div className="mt-6 flex justify-between md:mt-0">
                <div
                  className="-left-7 top-1/2 h-14 w-14 cursor-pointer rounded-md bg-white p-4 shadow-[10px_15px_21px_11px_rgba(0,0,0,0.05)] md:absolute md:-translate-y-1/2"
                  onClick={prevSlide}
                >
                  <svg viewBox="0 0 31.494 31.494" className="h-[26px] w-[26px]">
                    <path
                      d="M10.273 5.009a1.112 1.112 0 011.587 0 1.12 1.12 0 010 1.571l-8.047 8.047h26.554c.619 0 1.127.492 1.127 1.111s-.508 1.127-1.127 1.127H3.813l8.047 8.032c.429.444.429 1.159 0 1.587a1.112 1.112 0 01-1.587 0L.321 16.532a1.12 1.12 0 010-1.571l9.952-9.952z"
                      fill="#1e201d"
                    ></path>
                  </svg>
                </div>

                <div
                  className="-right-7 top-1/2 h-14 w-14 cursor-pointer rounded-md bg-white p-4 shadow-[10px_15px_21px_11px_rgba(0,0,0,0.05)] md:absolute md:-translate-y-1/2"
                  onClick={nextSlide}
                >
                  <svg viewBox="0 0 31.494 31.494" className="h-[26px] w-[26px] rotate-180">
                    <path
                      d="M10.273 5.009a1.112 1.112 0 011.587 0 1.12 1.12 0 010 1.571l-8.047 8.047h26.554c.619 0 1.127.492 1.127 1.111s-.508 1.127-1.127 1.127H3.813l8.047 8.032c.429.444.429 1.159 0 1.587a1.112 1.112 0 01-1.587 0L.321 16.532a1.12 1.12 0 010-1.571l9.952-9.952z"
                      fill="#1e201d"
                    ></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
          {showDots && (
            <div className="flex justify-center py-8">
              {[...Array(slides.length).keys()].map(idx => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx)
                      console.log(currentSlide, idx)
                    }}
                    className={clsx(
                      `mx-[2px] h-2 w-2 rounded-full border border-gray-400 outline-none`,
                      { ['bg-gray-400']: currentSlide === idx }
                    )}
                  ></button>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="text py-4 text-center text-gray-700">There are no slides</p>
      )}
    </div>
  )
})
