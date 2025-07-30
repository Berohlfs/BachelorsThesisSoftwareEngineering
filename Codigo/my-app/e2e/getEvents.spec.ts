import { test, expect } from '@playwright/test'

test('Events are there!', async ({ page }) => {
  await page.goto('http://localhost:3000/login')

  // Fill inputs using placeholder
  await page.getByPlaceholder('Digite seu e-mail').fill('teste@gmail.com')
  await page.getByPlaceholder('Digite sua senha').fill('password')

  // Click the Entrar button
  await page.getByRole('button', { name: /entrar/i }).click()

  await expect(page).toHaveTitle('Dashboard')

  await page.waitForTimeout(1000)

  await page.goto('http://localhost:3000/meus-eventos')

  const articles = page.locator('article.rounded-md.flex.flex-col')

  await page.waitForTimeout(1000)

  // Make sure at least one card is visible
  await expect(articles.first()).toBeVisible()
})
