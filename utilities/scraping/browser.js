import puppeteer from 'puppeteer'

export async function gotTo(url){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    return page
}