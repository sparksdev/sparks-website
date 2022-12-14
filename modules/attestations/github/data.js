import { Octokit } from "@octokit/rest";

export default async function (entries) {
  let data = []
  for(let entry of entries) {
    const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY })
    const result = await octokit.request('GET /users/{username}', { username: entry.humanId })
    if (result.status !== 200 || result.data.id != entry.systemId) continue;
    
    data.push({
      ...entry,
      hireable: result.data.hireable,
      public_repos: result.data.public_repos,
      public_gists: result.data.public_gists,
      followers: result.data.followers,
      following: result.data.following,
    })
  }

  return { service: 'medium', data }
}
