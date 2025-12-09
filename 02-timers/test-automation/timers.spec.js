/**
 * Приклади тестування таймерів з Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Timers тестування', () => {
    test('повинен очікувати виконання setTimeout', async ({ page }) => {
        await page.goto('data:text/html,<html><body></body></html>');
        
        const result = await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('Виконано');
                }, 100);
            });
        });
        
        expect(result).toBe('Виконано');
    });
    
    test('повинен очікувати зміни елемента', async ({ page }) => {
        await page.goto('data:text/html,<html><body><div id="status">Waiting</div></body></html>');
        
        // Запускаємо зміну через setTimeout
        await page.evaluate(() => {
            setTimeout(() => {
                document.getElementById('status').textContent = 'Ready';
            }, 100);
        });
        
        // Очікуємо зміни
        await page.waitForFunction(() => {
            return document.getElementById('status').textContent === 'Ready';
        });
        
        const text = await page.textContent('#status');
        expect(text).toBe('Ready');
    });
    
    test('повинен використати waitFor для очікування', async ({ page }) => {
        await page.goto('data:text/html,<html><body><div id="counter">0</div></body></html>');
        
        // Запускаємо лічильник
        await page.evaluate(() => {
            let count = 0;
            const interval = setInterval(() => {
                count++;
                document.getElementById('counter').textContent = count;
                if (count >= 5) {
                    clearInterval(interval);
                }
            }, 50);
        });
        
        // Очікуємо досягнення значення 5
        await page.waitForFunction(() => {
            return parseInt(document.getElementById('counter').textContent) >= 5;
        });
        
        const count = await page.textContent('#counter');
        expect(parseInt(count)).toBeGreaterThanOrEqual(5);
    });
});

