/**
 * Promise.any() - виконання кількох Promise з поверненням першого успішного
 * 
 * Promise.any() повертає результат першого Promise, який виконався успішно.
 * Якщо всі Promise відхилилися, повертається AggregateError з усіма помилками.
 */

// ============================================
// Приклад 1: Базове використання Promise.any()
// ============================================

const promise1 = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Помилка 1')), 100);
});

const promise2 = new Promise(resolve => {
    setTimeout(() => resolve('Успіх 2'), 200);
});

const promise3 = new Promise(resolve => {
    setTimeout(() => resolve('Успіх 3'), 300);
});

Promise.any([promise1, promise2, promise3])
    .then(result => {
        console.log('Перший успіх:', result); // 'Успіх 2'
    })
    .catch(error => {
        console.error('Всі Promise відхилилися:', error);
    });

// ============================================
// Приклад 2: Promise.any() коли всі Promise відхилилися
// ============================================

const error1 = Promise.reject(new Error('Помилка 1'));
const error2 = Promise.reject(new Error('Помилка 2'));
const error3 = Promise.reject(new Error('Помилка 3'));

Promise.any([error1, error2, error3])
    .then(result => {
        console.log('Результат:', result);
    })
    .catch(error => {
        // AggregateError містить всі помилки
        console.error('Всі Promise відхилилися');
        if (error instanceof AggregateError) {
            console.error('Помилки:', error.errors.map(e => e.message));
        }
    });

// ============================================
// Приклад 3: Promise.any() для резервних джерел даних
// ============================================

function fetchFromPrimary() {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Primary недоступний')), 100);
    });
}

function fetchFromSecondary() {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Secondary недоступний')), 200);
    });
}

function fetchFromCache() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ source: 'cache', data: 'Дані з кешу' }), 300);
    });
}

Promise.any([
    fetchFromPrimary(),
    fetchFromSecondary(),
    fetchFromCache()
])
.then(result => {
    console.log('Дані отримано з:', result.source);
    // Використовуємо перше успішне джерело
})
.catch(error => {
    console.error('Всі джерела недоступні:', error);
});

// ============================================
// Приклад 4: Promise.any() для вибору найшвидшого успішного API
// ============================================

function fetchFromAPI1() {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API 1 недоступний')), 100);
    });
}

function fetchFromAPI2() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ api: 2, data: 'Дані з API 2' }), 200);
    });
}

function fetchFromAPI3() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ api: 3, data: 'Дані з API 3' }), 300);
    });
}

Promise.any([
    fetchFromAPI1(),
    fetchFromAPI2(),
    fetchFromAPI3()
])
.then(result => {
    console.log('Використано API:', result.api);
    // Використовуємо найшвидший успішний API
});

// ============================================
// Приклад 5: Promise.any() для fallback стратегії
// ============================================

function tryMethod1() {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Метод 1 не вдався')), 150);
    });
}

function tryMethod2() {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Метод 2 не вдався')), 200);
    });
}

function tryMethod3() {
    return new Promise(resolve => {
        setTimeout(() => resolve('Метод 3 успішний'), 250);
    });
}

Promise.any([tryMethod1(), tryMethod2(), tryMethod3()])
    .then(result => {
        console.log('Успішний метод:', result);
        // Використовуємо перший успішний метод
    })
    .catch(error => {
        console.error('Всі методи не вдалися');
        // Використовуємо значення за замовчуванням
    });

// ============================================
// Приклад 6: Promise.any() для валідації з множинними правилами
// ============================================

function validateWithRule1(value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (value.length > 5) {
                resolve({ rule: 1, valid: true });
            } else {
                reject(new Error('Правило 1 не пройдено'));
            }
        }, 100);
    });
}

function validateWithRule2(value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (value.includes('@')) {
                resolve({ rule: 2, valid: true });
            } else {
                reject(new Error('Правило 2 не пройдено'));
            }
        }, 150);
    });
}

function validateWithRule3(value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (value.match(/[0-9]/)) {
                resolve({ rule: 3, valid: true });
            } else {
                reject(new Error('Правило 3 не пройдено'));
            }
        }, 200);
    });
}

Promise.any([
    validateWithRule1('test123'),
    validateWithRule2('test@example.com'),
    validateWithRule3('password123')
])
.then(result => {
    console.log('Валідація пройдена за правилом:', result.rule);
})
.catch(error => {
    console.error('Всі правила не пройдені');
});

// ============================================
// Приклад 7: Порівняння Promise.race() та Promise.any()
// ============================================

const successPromise = new Promise(resolve => {
    setTimeout(() => resolve('Успіх'), 300);
});

const errorPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Помилка')), 100);
});

// Promise.race() - повертає перший результат (навіть помилку)
Promise.race([successPromise, errorPromise])
    .then(result => console.log('Race - успіх:', result))
    .catch(error => console.error('Race - помилка:', error.message));

// Promise.any() - повертає перший успіх (ігнорує помилки)
Promise.any([successPromise, errorPromise])
    .then(result => console.log('Any - успіх:', result))
    .catch(error => console.error('Any - всі помилки:', error));

// ============================================
// Приклад 8: Promise.any() для моніторингу сервісів
// ============================================

function checkService(serviceName, available) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (available) {
                resolve({ service: serviceName, status: 'online' });
            } else {
                reject(new Error(`${serviceName} offline`));
            }
        }, Math.random() * 200);
    });
}

Promise.any([
    checkService('Service A', false),
    checkService('Service B', true),
    checkService('Service C', false)
])
.then(result => {
    console.log('Доступний сервіс:', result.service);
})
.catch(error => {
    console.error('Всі сервіси недоступні');
});

// ============================================
// Приклад 9: Promise.any() у тестах
// ============================================

/**
 * Використання для тестування з множинними стратегіями
 */
async function testWithFallback() {
    const strategies = [
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Стратегія 1 не вдалася')), 100);
        }),
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Стратегія 2 не вдалася')), 200);
        }),
        new Promise(resolve => {
            setTimeout(() => resolve('Стратегія 3 успішна'), 300);
        })
    ];
    
    try {
        const result = await Promise.any(strategies);
        console.log('Тест пройдено:', result);
    } catch (error) {
        console.error('Всі стратегії не вдалися');
    }
}

testWithFallback();

// ============================================
// Висновок
// ============================================

/**
 * Promise.any() корисний для:
 * - Резервних джерел даних (fallback)
 * - Вибору найшвидшого успішного джерела
 * - Стратегій з множинними спробами
 * - Валідації з альтернативними правилами
 * - Моніторингу з резервними сервісами
 * 
 * Особливості:
 * - Повертає перший успішний результат
 * - Ігнорує помилки до першого успіху
 * - Відхиляється тільки якщо всі Promise відхилилися
 * - При відхиленні повертає AggregateError з усіма помилками
 * 
 * Відмінності від Promise.race():
 * - Promise.race() повертає перший результат (успіх або помилку)
 * - Promise.any() повертає тільки перший успіх
 * - Promise.any() ігнорує помилки до першого успіху
 * 
 * Використовуйте коли:
 * - Потрібен перший успішний результат
 * - Є резервні джерела даних
 * - Помилки не критичні до першого успіху
 */

