export async function addAttestation({
  publicKey,
  service,
  hash,
  humanId,
  systemId,
}) {
  // save this to db { publicKey, data: [{ service, hash, systemId, humanId }]}
  const result = await fetch('/api/application/member-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publicKey,
      data: [
        {
          service,
          hash,
          humanId,
          systemId,
        },
      ],
    }),
  })
  return result.ok
}

export async function removeAttestation({ hash }) {
  const result = await fetch(
    `/api/application/member-stats?hash=${encodeURIComponent(hash)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  return result.ok
}
