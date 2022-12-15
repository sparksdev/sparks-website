export async function addAttestation({
  publicKey,
  service,
  hash,
  humanId,
  systemId,
}) {
  const result = await fetch('/api/apps/memberStats', {
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
    `/api/apps/memberStats?hash=${encodeURIComponent(hash)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  return result.ok
}
