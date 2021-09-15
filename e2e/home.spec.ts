import { expect, test } from "@playwright/test"

const HOST = `http://localhost:9999`

test("homepage test and navigation", async ({ page }) => {
  // Go to ${HOST}/?__overwriteName=janek
  await page.goto(`${HOST}/?__overwriteName=janek`)
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(5000)

  // expect text=@janek
  await expect(page.isVisible("text=@janek")).resolves.toBe(true)

  // Click a:has-text("Add funds")
  await page.click('a:has-text("Add funds")')
  await page.waitForSelector("text=Add funds to")
  expect(page.url()).toBe(`${HOST}/send`)
  await expect(page.isVisible("text=Add funds to")).resolves.toBe(true)
  await expect(page.isVisible("text=janek.argent.xyz")).resolves.toBe(true)
  await expect(page.isVisible("text=Connect a wallet")).resolves.toBe(true)
  await expect(page.isVisible("text=Pay with card/bank")).resolves.toBe(true)
  await expect(
    page.isVisible("text=Funds are sent to their zkSync account"),
  ).resolves.toBe(true)

  // Click [aria-label="Go back"]
  await page.waitForSelector('a[aria-label="Go back"]')
  await page.click('a[aria-label="Go back"]')
  expect(page.url()).toBe(`${HOST}/`)

  // Click a
  const [argentPopup] = await Promise.all([
    page.waitForEvent("popup"),
    page.click("a"),
  ])

  expect(argentPopup.url()).toBe("https://www.argent.xyz/")

  // Close page
  await argentPopup.close()
})
