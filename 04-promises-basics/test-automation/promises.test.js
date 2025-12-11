/**
 * Приклади тестування Promise з Mocha та Chai
 */

const { expect } = require('chai');

describe('Promises', () => {
    describe('Створення Promise', () => {
        it('повинен створити resolved Promise', () => {
            const promise = Promise.resolve('Успіх');
            
            return promise.then(result => {
                expect(result).to.equal('Успіх');
            });
            done();
        });
        
        it('повинен створити rejected Promise', () => {
            const promise = Promise.reject(new Error('Помилка'));
            
            return promise
                .then(() => {
                    throw new Error('Не повинен виконатися');
                })
                .catch(error => {
                    expect(error.message).to.equal('Помилка');
                });
        });
    });
    
    describe('Ланцюжки Promise', () => {
        it('повинен передавати дані через ланцюжок', () => {
            return Promise.resolve('Початок')
                .then(result => {
                    expect(result).to.equal('Початок');
                    return result + ' -> Крок 2';
                })
                .then(result => {
                    expect(result).to.equal('Початок -> Крок 2');
                    return result + ' -> Кінець';
                })
                .then(result => {
                    expect(result).to.equal('Початок -> Крок 2 -> Кінець');
                });
        });
        
        it('повинен обробити помилку в ланцюжку', () => {
            return Promise.resolve('Початок')
                .then(() => {
                    throw new Error('Помилка');
                })
                .then(() => {
                    throw new Error('Не повинен виконатися');
                })
                .catch(error => {
                    expect(error.message).to.equal('Помилка');
                    return 'Відновлено';
                })
                .then(result => {
                    expect(result).to.equal('Відновлено');
                });
        });
    });
    
    describe('Асинхронні операції', () => {
        it('повинен виконати асинхронну операцію', () => {
            function asyncOperation() {
                return new Promise(resolve => {
                    setTimeout(() => resolve('Готово'), 1000);
                });
            }
            
            return asyncOperation().then(result => {
                expect(result).to.equal('Готово');
            });
        });
    });
});

