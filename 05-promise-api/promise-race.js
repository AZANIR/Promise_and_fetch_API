/**
 * Promise.race() - виконання кількох Promise з поверненням першого результату
 * 
 * Promise.race() повертає результат того Promise, який виконався першим
 * (незалежно від того, успішно чи з помилкою).
 */

// ============================================
// Приклад 1: Базове використання Promise.race()
// ============================================

const fastPromise = new Promise(resolve => {
    setTimeout(() => resolve('Швидкий результат'), 100);
});

const slowPromise = new Promise(resolve => {
    setTimeout(() => resolve('Повільний результат'), 500);
});

Promise.race([fastPromise, slowPromise])
    .then(result => {
        console.log('Перший результат:', result); // 'Швидкий результат'
    });

// ============================================
// Приклад 2: Promise.race() з таймаутом
// ============================================

function fetchWithTimeout(url, timeout) {
    const fetchPromise = fetch(url); // Симуляція запиту
    
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Таймаут')), timeout);
    });
    
    return Promise.race([fetchPromise, timeoutPromise]);
}

// Використання
fetchWithTimeout('/api/data', 2000)
    .then(data => console.log('Дані отримано:', data))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 3: Promise.race() з кількома джерелами
// ============================================

function fetchFromPrimary() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ source: 'primary', data: 'Дані 1' }), 300);
    });
}

function fetchFromSecondary() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ source: 'secondary', data: 'Дані 2' }), 200);
    });
}

function fetchFromCache() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ source: 'cache', data: 'Дані 3' }), 100);
    });
}

Promise.race([
    fetchFromPrimary(),
    fetchFromSecondary(),
    fetchFromCache()
])
.then(result => {
    console.log('Перше джерело відповіло:', result);
    // Використовуємо дані з найшвидшого джерела
});

// ============================================
// Приклад 4: Promise.race() з помилкою
// ============================================

const successPromise = new Promise(resolve => {
    setTimeout(() => resolve('Успіх'), 500);
});

const errorPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Помилка')), 200);
});

Promise.race([successPromise, errorPromise])
    .then(result => {
        console.log('Результат:', result);
    })
    .catch(error => {
        // Якщо помилка виникла першою, вона перехоплюється
        console.error('Помилка:', error.message);
    });

// ============================================
// Приклад 5: Promise.race() для обмеження часу виконання
// ============================================

function longRunningOperation() {
    return new Promise(resolve => {
        setTimeout(() => resolve('Операція завершена'), 5000);
    });
}

function createTimeout(timeout) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Операція перевищила ${timeout}мс`)), timeout);
    });
}

Promise.race([
    longRunningOperation(),
    createTimeout(2000)
])
.then(result => {
    console.log('Результат:', result);
})
.catch(error => {
    console.error('Помилка:', error.message);
});

// ============================================
// Приклад 6: Promise.race() для вибору найшвидшого API
// ============================================

function fetchFromAPI1() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ api: 1, data: 'Дані з API 1' }), 400);
    });
}

function fetchFromAPI2() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ api: 2, data: 'Дані з API 2' }), 300);
    });
}

function fetchFromAPI3() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ api: 3, data: 'Дані з API 3' }), 200);
    });
}

Promise.race([
    fetchFromAPI1(),
    fetchFromAPI2(),
    fetchFromAPI3()
])
.then(result => {
    console.log('Використано найшвидший API:', result);
    // Використовуємо дані з найшвидшого API
});

// ============================================
// Приклад 7: Promise.race() для кешування з fallback
// ============================================

function fetchFromCache() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ source: 'cache', data: 'Кешовані дані' }), 50);
    });
}

function fetchFromNetwork() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ source: 'network', data: 'Мережеві дані' }), 500);
    });
}

Promise.race([
    fetchFromCache(),
    fetchFromNetwork()
])
.then(result => {
    console.log('Дані отримано з:', result.source);
    if (result.source === 'cache') {
        // Використовуємо кеш, але продовжуємо завантаження з мережі
        fetchFromNetwork().then(networkData => {
            console.log('Оновлені дані з мережі:', networkData);
        });
    }
});

// ============================================
// Приклад 8: Promise.race() для конкурентних обчислень
// ============================================

function calculateWithMethod1(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ method: 1, result: n * 2 }), 300);
    });
}

function calculateWithMethod2(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ method: 2, result: n * 3 }), 200);
    });
}

function calculateWithMethod3(n) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ method: 3, result: n * 4 }), 400);
    });
}

Promise.race([
    calculateWithMethod1(10),
    calculateWithMethod2(10),
    calculateWithMethod3(10)
])
.then(result => {
    console.log('Найшвидший метод:', result.method, 'Результат:', result.result);
});

// ============================================
// Приклад 9: Promise.race() у тестах для таймаутів
// ============================================

/**
 * Використання Promise.race() для обмеження часу тесту
 */
async function runTestWithTimeout(testFunction, timeout) {
    const testPromise = testFunction();
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Тест перевищив ${timeout}мс`)), timeout);
    });
    
    try {
        const result = await Promise.race([testPromise, timeoutPromise]);
        console.log('Тест завершено:', result);
    } catch (error) {
        console.error('Тест не пройдено:', error.message);
    }
}

// Використання
runTestWithTimeout(
    () => new Promise(resolve => setTimeout(() => resolve('Тест пройдено'), 1000)),
    2000
);

// ============================================
// Висновок
// ============================================

/**
 * Promise.race() корисний для:
 * - Таймаутів операцій
 * - Вибору найшвидшого джерела даних
 * - Конкурентних обчислень
 * - Кешування з fallback
 * - Обмеження часу виконання
 * 
 * Особливості:
 * - Повертає результат першого виконаного Promise
 * - Може повернути як успіх, так і помилку
 * - Інші Promise продовжують виконуватися
 * - Корисний для оптимізації продуктивності
 * 
 * Використовуйте коли:
 * - Потрібен результат першого виконаного Promise
 * - Потрібно обмежити час виконання
 * - Є кілька джерел даних і потрібне найшвидше
 * - Потрібна конкуренція між операціями
 */

