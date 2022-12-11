import nacl from 'tweetnacl'
import util from 'tweetnacl-util'
nacl.util = util

/**
 * @description asymmetric encryption of message given public & secret keys
 * @param {string} unencrypted utf8 unencrypted message
 * @param {string} publicKey base64 publicKey of receiver
 * @param {string} secretKey base64 secreKey of sender
 * @returns {string} encrypted base64 locked box + nonce
 */
export function encrypt(unencrypted, secretKey, publicKey) {
  const sharedKey = nacl.box.before(
    nacl.util.decodeBase64(publicKey),
    nacl.util.decodeBase64(secretKey)
  )

  const nonce = nacl.randomBytes(nacl.box.nonceLength)

  const box = nacl.box.after(
    nacl.util.decodeUTF8(unencrypted),
    nonce,
    sharedKey
  )

  const encrypted = new Uint8Array(nonce.length + box.length)
  encrypted.set(nonce)
  encrypted.set(box, nonce.length)

  return nacl.util.encodeBase64(encrypted)
}

/**
 * @description asymmetric decryption of base64 message given base64 public & secret keys
 * @param {string} encrypted base64 encrypted message
 * @param {string} publicKey base64 publicKey of receiver
 * @param {string} secretKey base64 secreKey of sender
 * @returns {string} unencrypted utf8 message
 */
export function decrypt(encrypted, secretKey, publicKey) {
  const messageAndNonce = nacl.util.decodeBase64(encrypted)
  const nonce = messageAndNonce.slice(0, nacl.box.nonceLength)
  const message = messageAndNonce.slice(
    nacl.box.nonceLength,
    messageAndNonce.length
  )

  const sharedKey = nacl.box.before(
    nacl.util.decodeBase64(publicKey),
    nacl.util.decodeBase64(secretKey)
  )

  const payload = nacl.box.open.after(message, nonce, sharedKey)

  return nacl.util.encodeUTF8(payload)
}

export default {
  encrypt,
  decrypt,
}
