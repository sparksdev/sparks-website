import '@styles/global/reset.css'
import '@styles/global/fonts.css'
import '@styles/global/themes.css'
import '@styles/global/sparks.css'
import WalletsProvider from '@providers/wallets'
import IconoirProvider from '@providers/iconoir'
import Dialog, { DialogProvider } from '@providers/dialog'
import { ThemeProvider } from '@providers/theme'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <WalletsProvider>
        <IconoirProvider>
          <DialogProvider>
            <Component {...pageProps} />
            <Dialog />
          </DialogProvider>
        </IconoirProvider>
      </WalletsProvider>
    </ThemeProvider>
  )
}

export default MyApp
