import { test, expect } from '@playwright/test'

test('Product created!', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    // Fill inputs using placeholder
    await page.getByPlaceholder('Digite seu e-mail').fill('teste@gmail.com')
    await page.getByPlaceholder('Digite sua senha').fill('password')

    // Click the Entrar button
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveTitle('Dashboard')

    await page.goto('http://localhost:3000/meus-produtos')

    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: /Novo/i }).click()

    // Fill all text inputs
    await page.getByPlaceholder('Digite o nome do produto').fill('Coxinha de frango')
    await page.getByPlaceholder('Digite a descrição do produto').fill('Muito gostosa essa coxinha')
    await page.getByPlaceholder('Digite o preço do produto').fill('20')
    
    // Click the select trigger
    await page.getByRole('combobox', { name: /categoria/i }).click()
    await page.getByRole('option', { name: 'comida' }).click()

    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: /Criar/i }).click()

    await page.waitForTimeout(3000)
})
