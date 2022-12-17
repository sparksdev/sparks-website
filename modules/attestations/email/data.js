import universities from "./categories/universities.json" 

export default async function (entries) {
  let data = []
  entries.forEach(entry => {
    data.push({
      ...entry,
      academic: universities.includes(entry.humanId.split('@')[1])
    })
  })
  return entries
}
