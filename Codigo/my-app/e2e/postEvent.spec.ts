import { test, expect } from '@playwright/test'

test('Event created!', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    // Fill inputs using placeholder
    await page.getByPlaceholder('Digite seu e-mail').fill('teste@gmail.com')
    await page.getByPlaceholder('Digite sua senha').fill('password')

    // Click the Entrar button
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveTitle('Dashboard')

    await page.goto('http://localhost:3000/meus-eventos')

    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: /Novo/i }).click()

    // Fill all text inputs
    await page.getByPlaceholder('Digite o nome do evento').fill('Festival da Praia')
    await page.getByPlaceholder('Digite a descrição do evento').fill('Um show inesquecível')
    await page.getByPlaceholder('Digite o endereço do evento').fill('Av. Atlântica, 1000')

    // Date pickers
    await page.getByRole('button', { name: /data de início/i }).click()
    await page.getByRole('gridcell', { name: '5' }).first().click()

    await page.getByRole('button', { name: /data de fim/i }).click()
    await page.getByRole('gridcell', { name: '5' }).first().click()

    // Fill time fields
    await page.locator('input[name="time_start"]').fill('20:00')
    await page.locator('input[name="time_end"]').fill('23:30')

    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: /Criar/i }).click()

    await page.waitForTimeout(3000)
})
