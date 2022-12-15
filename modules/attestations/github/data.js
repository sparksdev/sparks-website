import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";


export default async function (entries) {
  let data = []
  for (let entry of entries) {
    const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY })
    const result = await octokit.request('GET /users/{username}', { username: entry.humanId })
    if (result.status !== 200 || result.data.id != entry.systemId) continue;

    const contributions = await getContribs(entry.humanId)

    data.push({
      ...entry,
      hireable: result.data.hireable,
      public_repos: result.data.public_repos,
      public_gists: result.data.public_gists,
      followers: result.data.followers,
      following: result.data.following,
      contributions: contributions,
    })
  }

  return data
}


async function getContribs(username) {
  try {
    const { user } = await graphql(
      `query {
        user(login: "${username}") {
          name
          contributionsCollection {
            contributionCalendar {
              colors
              totalContributions
              weeks {
                contributionDays {
                  color
                  contributionCount
                  date
                  weekday
                }
                firstDay
              }
            }
          }
        }
      }
      `,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    )
    return user.contributionsCollection.contributionCalendar.totalContributions
  } catch(e) {
    return 0;
  }
}