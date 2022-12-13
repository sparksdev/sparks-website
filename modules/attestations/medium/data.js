import puppeteer from "puppeteer"

export default async function (entries) {
  let data = []

  for(let user of entries) {
    try {
      const url = `https://medium.com/@${user.humanId}/about`
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      const followers = await page.$eval('.pw-follower-count a', (element) => element.textContent.replace(' Followers', ''))
      const following = await page.$eval('.pw-follower-count + span + button', (element) => element.textContent.replace('Following ', ''))
      const first_name = await page.$eval('meta property="profile:first_name"', (element) => element.getAttribute('content'))
      const last_name = await page.$eval('meta property="profile:last_name"', (element) => element.getAttribute('content'))
      data.push({ 
        ...user, 
        followers: parseInt(followers), 
        following: parseInt(following), 
        first_name, 
        last_name 
      })
      await browser.close()
    } catch (error) {
      data.push({ 
        ...user, 
        followers: 0, 
        following: 0,
        first_name: 'n/a',
        last_name: 'n/a'
      })
    }
  }
  return { service: 'medium', data }
}
