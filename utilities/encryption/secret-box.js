import nacl from 'tweetnacl'
import util from 'tweetnacl-util'
nacl.util = util

/**
 * @description symmetric encryption of string using secretKey
 * @param {string} unencrypted utf8 unencrypted message
 * @param {string} secretKey base64 secret key of owner
 * @returns {string} encrypted base64 locked box + nonce
 */
export const encrypt = (unencrypted, secretKey) => {
  const secreKeyUint = nacl.util.decodeBase64(secretKey)

  const nonce = nacl.randomBytes(nacl.box.nonceLength)
  const message = nacl.util.decodeUTF8(unencrypted)
  const box = nacl.secretbox(message, nonce, secreKeyUint)

  const encrypted = new Uint8Array(nonce.length + box.length)
  encrypted.set(nonce)
  encrypted.set(box, nonce.length)

  return nacl.util.encodeBase64(encrypted)
}

/**
 * @description symmetric decryption of base64 message given base64 public & secret keys
 * @param {string} encrypted base64 encrypted message
 * @param {string} secretKey base64 secreKey of owner
 * @returns {string} unencrypted utf8 message
 */
export const decrypt = (encrypted, secretKey) => {
  const secretKeyUint = nacl.util.decodeBase64(secretKey)

  const messageAndNonce = nacl.util.decodeBase64(encrypted)

  const nonce = messageAndNonce.slice(0, nacl.box.nonceLength)
  const message = messageAndNonce.slice(
    nacl.box.nonceLength,
    messageAndNonce.length
  )

  const payload = nacl.secretbox.open(message, nonce, secretKeyUint)

  return nacl.util.encodeUTF8(payload)
}

export default {
  encrypt,
  decrypt,
}
