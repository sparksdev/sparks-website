export default async function ({ humanId, systemId }) {
  return { service: 'email', humanId, systemId }
}
