/**
 * Приклади тестування callback функцій з Mocha та Chai
 */

const { expect } = require('chai');

describe('Callback Functions', () => {
    describe('Базові callbacks', () => {
        it('повинен викликати callback з правильним значенням', (done) => {
            function greetUser(name, callback) {
                const greeting = `Привіт, ${name}!`;
                callback(greeting);
            }
            
            greetUser('Олена', (message) => {
                expect(message).to.equal('Привіт, Олена!');
                done(); // Важливо викликати done() для асинхронних тестів
            });
        });
        
        it('повинен обробити масив через callback', (done) => {
            function processArray(array, callback) {
                const result = [];
                for (let i = 0; i < array.length; i++) {
                    result.push(callback(array[i], i));
                }
                return result;
            }
            
            const numbers = [1, 2, 3];
            const doubled = processArray(numbers, (num) => num * 2);
            
            expect(doubled).to.deep.equal([2, 4, 6]);
            done();
        });
    });
    
    describe('Асинхронні callbacks', () => {
        it('повинен виконати асинхронний callback', (done) => {
            function fetchUserData(userId, callback) {
                setTimeout(() => {
                    const userData = {
                        id: userId,
                        name: 'Олена',
                        email: 'olena@example.com'
                    };
                    callback(null, userData);
                }, 100);
            }
            
            fetchUserData(1, (error, data) => {
                expect(error).to.be.null;
                expect(data).to.have.property('id', 1);
                expect(data).to.have.property('name', 'Олена');
                done();
            });
        });
        
        it('повинен обробити помилку в callback', (done) => {
            function fetchUserData(userId, callback) {
                setTimeout(() => {
                    if (userId <= 0) {
                        callback(new Error('Невірний ID'), null);
                    } else {
                        callback(null, { id: userId, name: 'Олена' });
                    }
                }, 100);
            }
            
            fetchUserData(-1, (error, data) => {
                expect(error).to.be.instanceOf(Error);
                expect(error.message).to.equal('Невірний ID');
                expect(data).to.be.null;
                done();
            });
        });
    });
    
    describe('Error-first callback pattern', () => {
        it('повинен слідувати error-first pattern', (done) => {
            function readFile(filename, callback) {
                setTimeout(() => {
                    if (filename === 'error.txt') {
                        callback(new Error('Файл не знайдено'), null);
                    } else {
                        callback(null, `Вміст файлу ${filename}`);
                    }
                }, 50);
            }
            
            readFile('data.txt', (error, data) => {
                expect(error).to.be.null;
                expect(data).to.include('data.txt');
                done();
            });
        });
    });
});

