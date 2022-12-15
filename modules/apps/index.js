import { default as memberStats } from './memberStats'

const apps = [memberStats]

export function getApp(service) {
  return apps.find((application) => application.service === service)
}

export default apps
