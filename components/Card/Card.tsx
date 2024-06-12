import { ReactNode } from 'react'

import clsx from 'clsx'

interface Props {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: Props) {
  return (
    <div className={clsx(className, 'rounded-md border-white bg-black/50 p-5')}>{children}</div>
  )
}
