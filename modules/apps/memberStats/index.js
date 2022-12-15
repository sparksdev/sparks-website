import metadata from './metadata'
import { enable, disable } from './register'
import { addAttestation, removeAttestation } from './update'
import Signup from './Signup'
import App from './App'

export default {
  ...metadata,
  enable,
  disable,
  addAttestation,
  removeAttestation,
  Signup,
  App,
}
