/**
 * Приклади тестування async/await з Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Async/Await тестування', () => {
    test('повинен використати async/await для очікування', async ({ page }) => {
        await page.goto('data:text/html,<html><body><div id="test">Loading...</div></body></html>');
        
        // Використання async/await для очікування зміни тексту
        await page.evaluate(async () => {
            async function updateText() {
                await new Promise(resolve => setTimeout(resolve, 100));
                document.getElementById('test').textContent = 'Loaded';
            }
            
            await updateText();
        });
        
        const text = await page.textContent('#test');
        expect(text).toBe('Loaded');
    });
    
    test('повинен обробити помилку з async/await', async ({ page }) => {
        const result = await page.evaluate(async () => {
            try {
                await Promise.reject(new Error('Помилка'));
                return 'Успіх';
            } catch (error) {
                return error.message;
            }
        });
        
        expect(result).toBe('Помилка');
    });
    
    test('повинен виконати паралельні операції', async ({ page }) => {
        const results = await page.evaluate(async () => {
            async function operation1() {
                await new Promise(resolve => setTimeout(resolve, 50));
                return 'Результат 1';
            }
            
            async function operation2() {
                await new Promise(resolve => setTimeout(resolve, 50));
                return 'Результат 2';
            }
            
            return await Promise.all([operation1(), operation2()]);
        });
        
        expect(results).toEqual(['Результат 1', 'Результат 2']);
    });
});

