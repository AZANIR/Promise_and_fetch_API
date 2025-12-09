/**
 * Приклади тестування async/await з Mocha та Chai
 */

const { expect } = require('chai');

describe('Async/Await', () => {
    describe('Базові async функції', () => {
        it('повинен повернути результат з async функції', async () => {
            async function fetchData() {
                return 'Дані отримано';
            }
            
            const result = await fetchData();
            expect(result).to.equal('Дані отримано');
        });
        
        it('повинен використати await для Promise', async () => {
            async function fetchData() {
                const data = await Promise.resolve('Дані');
                return data;
            }
            
            const result = await fetchData();
            expect(result).to.equal('Дані');
        });
    });
    
    describe('Обробка помилок', () => {
        it('повинен обробити помилку з try-catch', async () => {
            async function operationWithError() {
                try {
                    await Promise.reject(new Error('Помилка'));
                    return 'Успіх';
                } catch (error) {
                    return 'Оброблено помилку';
                }
            }
            
            const result = await operationWithError();
            expect(result).to.equal('Оброблено помилку');
        });
        
        it('повинен викинути помилку з async функції', async () => {
            async function failingOperation() {
                throw new Error('Помилка виконання');
            }
            
            try {
                await failingOperation();
                expect.fail('Повинна бути помилка');
            } catch (error) {
                expect(error.message).to.equal('Помилка виконання');
            }
        });
    });
    
    describe('Послідовні операції', () => {
        it('повинен виконати послідовні операції', async () => {
            async function step1() {
                return await Promise.resolve('Крок 1');
            }
            
            async function step2(data) {
                return await Promise.resolve(`${data} -> Крок 2`);
            }
            
            const result1 = await step1();
            const result2 = await step2(result1);
            
            expect(result1).to.equal('Крок 1');
            expect(result2).to.equal('Крок 1 -> Крок 2');
        });
    });
    
    describe('Паралельні операції', () => {
        it('повинен виконати паралельні операції з Promise.all', async () => {
            async function operation1() {
                return await Promise.resolve('Результат 1');
            }
            
            async function operation2() {
                return await Promise.resolve('Результат 2');
            }
            
            const [result1, result2] = await Promise.all([
                operation1(),
                operation2()
            ]);
            
            expect(result1).to.equal('Результат 1');
            expect(result2).to.equal('Результат 2');
        });
    });
});

