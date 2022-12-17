import { default as memberStats } from './memberStats'
import { default as deployerProfile } from './deployerProfile'

const apps = [
  memberStats,
  deployerProfile,
]

export function getApp(service) {
  return apps.find((application) => application.service === service)
}

export default apps
