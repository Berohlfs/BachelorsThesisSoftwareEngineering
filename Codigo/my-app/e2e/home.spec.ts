import { test, expect } from '@playwright/test'

test('homepage loads and shows logo', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  await page.waitForTimeout(1000)
  
  const headings = page.getByRole('heading', { name: 'TUSCAN' })
  await expect(headings.nth(0)).toBeVisible()
})
