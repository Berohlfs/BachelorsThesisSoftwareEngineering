import { test, expect } from '@playwright/test'

test('login works!', async ({ page }) => {
  await page.goto('http://localhost:3000/login')

  // Fill inputs using placeholder
  await page.getByPlaceholder('Digite seu e-mail').fill('teste@gmail.com')
  await page.getByPlaceholder('Digite sua senha').fill('password')

  await page.waitForTimeout(1000)

  // Click the Entrar button
  await page.getByRole('button', { name: /entrar/i }).click()

  await expect(page).toHaveTitle('Dashboard')

  await page.waitForTimeout(1000)
})
