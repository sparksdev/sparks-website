import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'

export default function useMetamask() {
  const { account, active, error, library, activateBrowserWallet, deactivate } =
    useEthers()

  async function sign(message) {
    if (!account) {
      await activateBrowserWallet()
    }
    const signer = library.getSigner()
    return await signer.signMessage(message)
  }

  async function verify(message, signature) {
    const address = ethers.utils.verifyMessage(message, signature)
    return address === address
  }

  return {
    address: account,
    active: active,
    error: error,
    connect: activateBrowserWallet,
    disconnect: deactivate,
    sign: sign,
    verify: verify,
  }
}
