import nacl from 'tweetnacl'
import util from 'tweetnacl-util'
nacl.util = util

export const nonce = () =>
  nacl.util.encodeBase64(nacl.randomBytes(nacl.box.nonceLength))

/**
 * @description creates a base6 hash of an inbound message
 * @param {string} message a string message to hash
 * @returns {string} base64 encoded hash of the original message
 */
export function hash(message) {
  return nacl.util.encodeBase64(nacl.hash(nacl.util.decodeUTF8(message)))
}

/**
 * @description covenience function for nacl.box.keyPair
 * @returns {object} base64 encoded public & secret key pair
 */
export function keyPair() {
  const keyPair = nacl.box.keyPair()
  return {
    publicKey: nacl.util.encodeBase64(keyPair.publicKey),
    secretKey: nacl.util.encodeBase64(keyPair.secretKey),
  }
}

/**
 * @description returns a public secret key pair given a signature derived from a challenge
 * @param {string} signature string obtained from signing challenge w/connection provider
 * @returns {object} base64 encoded public & secret key pair
 */
export function keyPairFromSignature(signature) {
  const secretKey = signature.replace(/[^0-9a-zA-Z]/g, '').slice(0, 32)
  const keyPair = nacl.box.keyPair.fromSecretKey(
    nacl.util.decodeUTF8(secretKey)
  )
  return {
    publicKey: nacl.util.encodeBase64(keyPair.publicKey),
    secretKey: nacl.util.encodeBase64(keyPair.secretKey),
  }
}
