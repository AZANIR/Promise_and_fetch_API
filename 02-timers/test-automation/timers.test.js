/**
 * Приклади тестування таймерів з Mocha та Chai
 */

const { expect } = require('chai');

describe('Timers', () => {
    describe('setTimeout', () => {
        it('повинен виконати функцію через затримку', (done) => {
            let executed = false;
            
            setTimeout(() => {
                executed = true;
                expect(executed).to.be.true;
                done();
            }, 100);
        });
        
        it('повинен передати параметри у setTimeout', (done) => {
            function greet(name, message) {
                expect(name).to.equal('Олена');
                expect(message).to.equal('Привіт');
                done();
            }
            
            setTimeout(greet, 50, 'Олена', 'Привіт');
        });
    });
    
    describe('setInterval', () => {
        it('повинен виконувати функцію через інтервали', (done) => {
            let counter = 0;
            
            const intervalId = setInterval(() => {
                counter++;
                
                if (counter >= 3) {
                    clearInterval(intervalId);
                    expect(counter).to.equal(3);
                    done();
                }
            }, 50);
        });
    });
    
    describe('clearTimeout та clearInterval', () => {
        it('повинен очистити setTimeout', (done) => {
            let executed = false;
            
            const timeoutId = setTimeout(() => {
                executed = true;
            }, 200);
            
            clearTimeout(timeoutId);
            
            setTimeout(() => {
                expect(executed).to.be.false;
                done();
            }, 250);
        });
        
        it('повинен очистити setInterval', (done) => {
            let counter = 0;
            
            const intervalId = setInterval(() => {
                counter++;
            }, 50);
            
            setTimeout(() => {
                clearInterval(intervalId);
                const finalCount = counter;
                
                setTimeout(() => {
                    expect(counter).to.equal(finalCount);
                    done();
                }, 100);
            }, 150);
        });
    });
    
    describe('Очікування в тестах', () => {
        it('повинен очікувати виконання умови', (done) => {
            let conditionMet = false;
            
            setTimeout(() => {
                conditionMet = true;
            }, 100);
            
            function waitForCondition(condition, timeout, interval) {
                return new Promise((resolve, reject) => {
                    const startTime = Date.now();
                    
                    function check() {
                        if (condition()) {
                            resolve();
                        } else if (Date.now() - startTime >= timeout) {
                            reject(new Error('Умова не виконалася'));
                        } else {
                            setTimeout(check, interval);
                        }
                    }
                    
                    check();
                });
            }
            
            waitForCondition(() => conditionMet, 500, 50)
                .then(() => {
                    expect(conditionMet).to.be.true;
                    done();
                })
                .catch(done);
        });
    });
});

