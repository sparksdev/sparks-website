import { DAppProvider, MetamaskConnector } from '@usedapp/core'

const config = {
  autoConnect: true,
  connectors: {
    metamask: new MetamaskConnector(),
  },
}

export default function Provider({ children }) {
  return <DAppProvider config={config}>{children}</DAppProvider>
}
