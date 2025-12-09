/**
 * Створення Promise в JavaScript
 * 
 * Promise - це об'єкт, який представляє результат асинхронної операції.
 * Він може бути в стані: pending, fulfilled (resolved) або rejected.
 */

// ============================================
// Приклад 1: Базове створення Promise
// ============================================

const myPromise = new Promise((resolve, reject) => {
    // resolve - викликається при успішному виконанні
    // reject - викликається при помилці
    
    setTimeout(() => {
        resolve('Операція виконана успішно');
    }, 1000);
});

myPromise.then((result) => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 2: Promise з помилкою
// ============================================

const errorPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('Щось пішло не так'));
    }, 1000);
});

errorPromise
    .then((result) => {
        console.log('Успіх:', result);
    })
    .catch((error) => {
        console.error('Помилка:', error.message);
    });

// ============================================
// Приклад 3: Promise з умовою
// ============================================

function createConditionalPromise(shouldSucceed) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                resolve('Успіх!');
            } else {
                reject(new Error('Помилка!'));
            }
        }, 500);
    });
}

createConditionalPromise(true)
    .then(result => console.log('Результат:', result))
    .catch(error => console.error('Помилка:', error.message));

createConditionalPromise(false)
    .then(result => console.log('Результат:', result))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 4: Promise з обробкою даних
// ============================================

function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({
                    id: userId,
                    name: 'Олена',
                    email: 'olena@example.com'
                });
            } else {
                reject(new Error('Невірний ID користувача'));
            }
        }, 1000);
    });
}

fetchUserData(1)
    .then(user => {
        console.log('Дані користувача:', user);
    })
    .catch(error => {
        console.error('Помилка:', error.message);
    });

// ============================================
// Приклад 5: Promise.resolve() - швидке створення resolved Promise
// ============================================

// Створення вже вирішеного Promise
const resolvedPromise = Promise.resolve('Готово одразу');

resolvedPromise.then(result => {
    console.log('Результат:', result);
});

// Еквівалентно:
new Promise((resolve) => {
    resolve('Готово одразу');
}).then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 6: Promise.reject() - швидке створення rejected Promise
// ============================================

// Створення вже відхиленого Promise
const rejectedPromise = Promise.reject(new Error('Помилка одразу'));

rejectedPromise.catch(error => {
    console.error('Помилка:', error.message);
});

// ============================================
// Приклад 7: Promise з синхронним виконанням
// ============================================

function synchronousPromise(data) {
    return new Promise((resolve) => {
        // Синхронна операція
        const processed = data.toUpperCase();
        resolve(processed);
    });
}

synchronousPromise('hello')
    .then(result => {
        console.log('Результат:', result); // HELLO
    });

// ============================================
// Приклад 8: Promise з асинхронною операцією
// ============================================

function asyncOperation(data, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Оброблено: ${data}`);
        }, delay);
    });
}

asyncOperation('дані', 1000)
    .then(result => {
        console.log('Результат:', result);
    });

// ============================================
// Приклад 9: Promise з обробкою помилок всередині
// ============================================

function safePromise(operation) {
    return new Promise((resolve, reject) => {
        try {
            const result = operation();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

safePromise(() => {
    return 'Успіх';
})
.then(result => console.log('Результат:', result))
.catch(error => console.error('Помилка:', error));

safePromise(() => {
    throw new Error('Помилка виконання');
})
.then(result => console.log('Результат:', result))
.catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 10: Promise з таймаутом
// ============================================

function promiseWithTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Таймаут'));
        }, timeout);
        
        promise
            .then(result => {
                clearTimeout(timeoutId);
                resolve(result);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}

// Використання
const slowPromise = new Promise(resolve => {
    setTimeout(() => resolve('Готово'), 5000);
});

promiseWithTimeout(slowPromise, 2000)
    .then(result => console.log('Результат:', result))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 11: Обгортка для callback у Promise
// ============================================

/**
 * Перетворення callback-функції у Promise
 */
function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// Приклад використання
function callbackFunction(data, callback) {
    setTimeout(() => {
        if (data) {
            callback(null, `Оброблено: ${data}`);
        } else {
            callback(new Error('Дані відсутні'), null);
        }
    }, 1000);
}

const promiseFunction = promisify(callbackFunction);

promiseFunction('тест')
    .then(result => console.log('Результат:', result))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Висновок
// ============================================

/**
 * Promise створюються через:
 * 1. new Promise((resolve, reject) => { ... })
 * 2. Promise.resolve(value) - швидке створення resolved
 * 3. Promise.reject(error) - швидке створення rejected
 * 
 * Ключові моменти:
 * - resolve/reject викликаються один раз
 * - Promise може бути в одному з трьох станів: pending, fulfilled, rejected
 * - Після resolve/reject стан Promise не змінюється
 * - Promise виконується одразу після створення
 */

