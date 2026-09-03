import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'

import inputStyles from './input.module.css'

function Input({ style, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={inputStyles.input}
      style={style}
      {...props}
    />
  )
}

export { Input }
