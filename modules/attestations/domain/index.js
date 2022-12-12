import metadata from './metadata'
import { challenge, verify } from './verification'
import Dialog from './Dialog'
import data from './data'

export default {
  ...metadata,
  challenge,
  verify,
  Dialog,
  data,
}
