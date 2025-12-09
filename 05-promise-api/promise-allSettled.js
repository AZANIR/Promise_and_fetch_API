/**
 * Promise.allSettled() - виконання всіх Promise незалежно від результатів
 * 
 * Promise.allSettled() чекає виконання всіх Promise і повертає масив результатів,
 * навіть якщо деякі Promise відхилилися. Кожен результат містить статус та значення/помилку.
 */

// ============================================
// Приклад 1: Базове використання Promise.allSettled()
// ============================================

const promise1 = Promise.resolve('Успіх 1');
const promise2 = Promise.reject(new Error('Помилка 2'));
const promise3 = Promise.resolve('Успіх 3');

Promise.allSettled([promise1, promise2, promise3])
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index + 1}: успіх -`, result.value);
            } else {
                console.error(`Promise ${index + 1}: помилка -`, result.reason.message);
            }
        });
    });

// ============================================
// Приклад 2: Структура результатів Promise.allSettled()
// ============================================

Promise.allSettled([
    Promise.resolve('Успіх'),
    Promise.reject(new Error('Помилка'))
])
.then(results => {
    console.log('Структура результатів:', results);
    // [
    //   { status: 'fulfilled', value: 'Успіх' },
    //   { status: 'rejected', reason: Error('Помилка') }
    // ]
});

// ============================================
// Приклад 3: Обробка результатів з Promise.allSettled()
// ============================================

function fetchUser(id) {
    if (id === 999) {
        return Promise.reject(new Error('Користувач не знайдений'));
    }
    return Promise.resolve({ id, name: `Користувач ${id}` });
}

Promise.allSettled([
    fetchUser(1),
    fetchUser(2),
    fetchUser(999),
    fetchUser(3)
])
.then(results => {
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    const failed = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason);
    
    console.log('Успішні:', successful);
    console.log('Помилки:', failed.map(e => e.message));
});

// ============================================
// Приклад 4: Promise.allSettled() для збору даних з кількох джерел
// ============================================

function fetchFromSource1() {
    return Promise.resolve({ source: 1, data: 'Дані 1' });
}

function fetchFromSource2() {
    return Promise.reject(new Error('Джерело 2 недоступне'));
}

function fetchFromSource3() {
    return Promise.resolve({ source: 3, data: 'Дані 3' });
}

Promise.allSettled([
    fetchFromSource1(),
    fetchFromSource2(),
    fetchFromSource3()
])
.then(results => {
    const data = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    console.log('Отримані дані:', data);
    // Використовуємо тільки успішні результати
});

// ============================================
// Приклад 5: Promise.allSettled() для валідації форми
// ============================================

function validateField(fieldName, value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (value && value.length > 0) {
                resolve({ field: fieldName, valid: true });
            } else {
                reject(new Error(`${fieldName} порожнє`));
            }
        }, 100);
    });
}

Promise.allSettled([
    validateField('email', 'test@example.com'),
    validateField('password', ''),
    validateField('username', 'user123')
])
.then(results => {
    const errors = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason.message);
    
    if (errors.length === 0) {
        console.log('Всі поля валідні');
    } else {
        console.log('Помилки валідації:', errors);
    }
});

// ============================================
// Приклад 6: Promise.allSettled() для моніторингу сервісів
// ============================================

function checkService(serviceName) {
    return new Promise((resolve, reject) => {
        const isAvailable = Math.random() > 0.3; // 70% шанс доступності
        
        setTimeout(() => {
            if (isAvailable) {
                resolve({ service: serviceName, status: 'online' });
            } else {
                reject(new Error(`${serviceName} недоступний`));
            }
        }, 100);
    });
}

Promise.allSettled([
    checkService('API'),
    checkService('Database'),
    checkService('Cache'),
    checkService('Queue')
])
.then(results => {
    const status = {
        online: [],
        offline: []
    };
    
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            status.online.push(result.value.service);
        } else {
            status.offline.push(result.reason.message);
        }
    });
    
    console.log('Статус сервісів:');
    console.log('Онлайн:', status.online);
    console.log('Офлайн:', status.offline);
});

// ============================================
// Приклад 7: Promise.allSettled() для обробки батчу операцій
// ============================================

function processItem(item) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (item.id % 2 === 0) {
                resolve({ ...item, processed: true });
            } else {
                reject(new Error(`Помилка обробки ${item.id}`));
            }
        }, 50);
    });
}

const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' }
];

Promise.allSettled(items.map(processItem))
    .then(results => {
        const processed = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);
        
        const failed = results
            .filter(r => r.status === 'rejected')
            .map(r => r.reason.message);
        
        console.log('Оброблено:', processed);
        console.log('Помилки:', failed);
    });

// ============================================
// Приклад 8: Порівняння Promise.all() та Promise.allSettled()
// ============================================

const promises = [
    Promise.resolve('Успіх 1'),
    Promise.reject(new Error('Помилка')),
    Promise.resolve('Успіх 2')
];

// Promise.all() - зупиняється на першій помилці
Promise.all(promises)
    .then(results => console.log('Promise.all - успіх:', results))
    .catch(error => console.error('Promise.all - помилка:', error.message));

// Promise.allSettled() - обробляє всі результати
Promise.allSettled(promises)
    .then(results => {
        console.log('Promise.allSettled - всі результати:', results);
    });

// ============================================
// Приклад 9: Promise.allSettled() у тестах
// ============================================

/**
 * Використання для паралельного виконання тестів
 * з обробкою всіх результатів
 */
async function runTestSuite() {
    const tests = [
        Promise.resolve('Тест 1: пройдено'),
        Promise.reject(new Error('Тест 2: не пройдено')),
        Promise.resolve('Тест 3: пройдено')
    ];
    
    const results = await Promise.allSettled(tests);
    
    const passed = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`Тести: ${passed} пройдено, ${failed} не пройдено`);
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`✓ ${result.value}`);
        } else {
            console.error(`✗ Тест ${index + 1}: ${result.reason.message}`);
        }
    });
}

runTestSuite();

// ============================================
// Висновок
// ============================================

/**
 * Promise.allSettled() корисний для:
 * - Обробки множини операцій, де важливі всі результати
 * - Моніторингу кількох сервісів
 * - Валідації форми з обробкою всіх помилок
 * - Обробки батчів з можливими помилками
 * - Тестування, де потрібні всі результати
 * 
 * Переваги над Promise.all():
 * - Не зупиняється на помилках
 * - Повертає всі результати
 * - Дозволяє обробити успішні та невдалі операції окремо
 * 
 * Використовуйте коли:
 * - Потрібні результати всіх операцій
 * - Помилки не повинні зупиняти обробку інших
 * - Потрібна детальна інформація про всі операції
 */

