'use client'

import * as React from 'react'

function Label({ style, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: 'var(--text-label)',
        lineHeight: 'var(--text-label--line-height)',
        fontWeight: 600,
        userSelect: 'none',
        ...style,
      }}
      {...props}
    />
  )
}

export { Label }
