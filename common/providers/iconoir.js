import { IconoirProvider } from 'iconoir-react'

export default function ({ children }) {
  return (
    <IconoirProvider
      iconProps={{
        color: 'currentColor',
        stroke: 'currentColor',
        width: '2.4rem',
        height: '2.4rem',
        strokeWidth: 2,
      }}
    >
      {children}
    </IconoirProvider>
  )
}
