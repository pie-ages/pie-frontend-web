import { Button as ButtonPrimitive } from '@base-ui/react/button'

import buttonStyles from './button.module.css'

type ButtonVariant = 'default' | 'ghost'
type ButtonSize = 'default' | 'icon-sm'

type ButtonProps = ButtonPrimitive.Props & {
  variant?: ButtonVariant
  size?: ButtonSize
}

function Button({ variant = 'default', size = 'default', style, ...props }: ButtonProps) {
  const classes = [
    buttonStyles.button,
    variant === 'ghost' ? buttonStyles.ghost : '',
    size === 'icon-sm' ? buttonStyles.iconSm : '',
  ].filter(Boolean).join(' ')

  return (
    <ButtonPrimitive
      data-slot="button"
      className={classes}
      style={style}
      {...props}
    />
  )
}

export { Button }
