import { default as memberStats } from './member-stats'

const applications = [
  memberStats,
]

export function getApplication(service) {
  return applications.find((application) => application.service === service)
}

export default applications
