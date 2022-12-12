import metadata from './metadata'
import { enable, disable } from './register'
import { addAttestation, removeAttestation } from './update'
import Dialog from './Dialog'

export default {
  ...metadata,
  enable,
  disable,
  addAttestation,
  removeAttestation,
  Dialog,
}
