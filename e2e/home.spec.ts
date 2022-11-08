import { expect, test } from "@playwright/test"

const HOST = `http://localhost:9999`

test("homepage test and navigation", async ({ page }) => {
  // Go to ${HOST}/?__overwriteName=graeme-goerli1
  await page.goto(`${HOST}/?__overwriteName=graeme-goerli1`)
  await page.waitForLoadState("networkidle")

  await page.waitForSelector("text=@graeme-goerli1")
  // expect text=@graeme-goerli1
  await expect(page.isVisible("text=@graeme-goerli1")).resolves.toBe(true)

  // Click a:has-text("Add funds")
  await page.click('a:has-text("Add funds")')
  await page.waitForSelector("text=Add funds to")
  expect(page.url()).toBe(`${HOST}/send`)
  await expect(page.isVisible("text=Add funds to")).resolves.toBe(true)
  await expect(page.isVisible("text=graeme-goerli1")).resolves.toBe(true)
  await expect(page.isVisible("text=Connect wallet")).resolves.toBe(true)
  await expect(page.isVisible("text=Use a card/bank transfer")).resolves.toBe(
    true,
  )
  await expect(
    page.isVisible("text=Funds are bridged to zkSync"),
  ).resolves.toBe(true)

  // Click [aria-label="Go back"]
  await page.waitForSelector('a[aria-label="Go back"]')
  await page.click('a[aria-label="Go back"]')
  expect(page.url()).toBe(`${HOST}/`)

  // Click a
  const [argentPopup] = await Promise.all([
    page.waitForEvent("popup"),
    page.click('a[title="Argent Logo Link"]'),
  ])

  expect(argentPopup.url()).toBe("https://www.argent.xyz/")

  // Close page
  await argentPopup.close()
})
