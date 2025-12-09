/**
 * Приклади тестування Fetch API з Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Fetch API тестування', () => {
    test('повинен виконати GET запит', async ({ page }) => {
        // Мокуємо fetch для тестування
        await page.addInitScript(() => {
            global.fetch = async (url) => {
                if (url.includes('/users')) {
                    return {
                        ok: true,
                        status: 200,
                        json: async () => ({ id: 1, name: 'Олена' })
                    };
                }
            };
        });
        
        const result = await page.evaluate(async () => {
            const response = await fetch('https://api.example.com/users');
            return await response.json();
        });
        
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('name', 'Олена');
    });
    
    test('повинен обробити помилку HTTP', async ({ page }) => {
        await page.addInitScript(() => {
            global.fetch = async () => ({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            });
        });
        
        const result = await page.evaluate(async () => {
            const response = await fetch('https://api.example.com/users');
            return {
                ok: response.ok,
                status: response.status
            };
        });
        
        expect(result.ok).toBe(false);
        expect(result.status).toBe(404);
    });
    
    test('повинен виконати POST запит', async ({ page }) => {
        await page.addInitScript(() => {
            global.fetch = async (url, options) => {
                if (options.method === 'POST') {
                    return {
                        ok: true,
                        status: 201,
                        json: async () => ({ id: 1, ...JSON.parse(options.body) })
                    };
                }
            };
        });
        
        const result = await page.evaluate(async () => {
            const response = await fetch('https://api.example.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: 'Олена', email: 'olena@example.com' })
            });
            return await response.json();
        });
        
        expect(result).toHaveProperty('name', 'Олена');
        expect(result).toHaveProperty('email', 'olena@example.com');
    });
});

