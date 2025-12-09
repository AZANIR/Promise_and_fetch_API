/**
 * Обробка помилок у Promise
 * 
 * Правильна обробка помилок критично важлива для надійного коду.
 * Promise надає кілька способів обробки помилок.
 */

// ============================================
// Приклад 1: Базовий catch
// ============================================

Promise.reject(new Error('Помилка виконання'))
    .then(result => {
        console.log('Це не виконається');
    })
    .catch(error => {
        console.error('Помилка перехоплена:', error.message);
    });

// ============================================
// Приклад 2: catch в ланцюжку
// ============================================

Promise.resolve('Початок')
    .then(result => {
        console.log('Крок 1:', result);
        throw new Error('Помилка на кроці 1');
    })
    .then(result => {
        // Це не виконається
        console.log('Крок 2:', result);
    })
    .catch(error => {
        console.error('Помилка в ланцюжку:', error.message);
        return 'Відновлення';
    })
    .then(result => {
        console.log('Після catch:', result);
    });

// ============================================
// Приклад 3: Множинні catch
// ============================================

Promise.resolve('Початок')
    .then(result => {
        throw new Error('Помилка 1');
    })
    .catch(error => {
        console.error('Перший catch:', error.message);
        throw new Error('Помилка 2');
    })
    .catch(error => {
        console.error('Другий catch:', error.message);
        return 'Відновлено';
    })
    .then(result => {
        console.log('Результат:', result);
    });

// ============================================
// Приклад 4: Обробка помилок у вкладених Promise
// ============================================

Promise.resolve('Зовнішній')
    .then(outer => {
        return Promise.resolve('Внутрішній')
            .then(inner => {
                throw new Error('Помилка всередині');
            });
    })
    .catch(error => {
        // Перехоплює помилку з внутрішнього Promise
        console.error('Помилка перехоплена:', error.message);
    });

// ============================================
// Приклад 5: try-catch з async/await (буде детальніше в наступних уроках)
// ============================================

async function handleErrors() {
    try {
        await Promise.reject(new Error('Помилка в async функції'));
    } catch (error) {
        console.error('Помилка в try-catch:', error.message);
    }
}

handleErrors();

// ============================================
// Приклад 6: Обробка різних типів помилок
// ============================================

function processData(data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            reject(new Error('Дані відсутні'));
        } else if (typeof data !== 'string') {
            reject(new TypeError('Дані мають бути рядком'));
        } else if (data.length === 0) {
            reject(new Error('Дані порожні'));
        } else {
            resolve(data.toUpperCase());
        }
    });
}

processData(null)
    .catch(error => {
        if (error instanceof TypeError) {
            console.error('Помилка типу:', error.message);
        } else {
            console.error('Загальна помилка:', error.message);
        }
    });

processData(123)
    .catch(error => {
        if (error instanceof TypeError) {
            console.error('Помилка типу:', error.message);
        } else {
            console.error('Загальна помилка:', error.message);
        }
    });

// ============================================
// Приклад 7: Обробка помилок у Promise.all
// ============================================

const promise1 = Promise.resolve('Успіх 1');
const promise2 = Promise.reject(new Error('Помилка 2'));
const promise3 = Promise.resolve('Успіх 3');

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log('Результати:', results);
    })
    .catch(error => {
        // Перехоплює першу помилку
        console.error('Помилка в Promise.all:', error.message);
    });

// ============================================
// Приклад 8: Обробка помилок у Promise.allSettled
// ============================================

Promise.allSettled([promise1, promise2, promise3])
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index + 1}: успіх`, result.value);
            } else {
                console.error(`Promise ${index + 1}: помилка`, result.reason.message);
            }
        });
    });

// ============================================
// Приклад 9: Відновлення після помилки
// ============================================

function riskyOperation() {
    return Promise.reject(new Error('Операція не вдалася'));
}

riskyOperation()
    .catch(error => {
        console.error('Спроба 1 не вдалася:', error.message);
        // Повторна спроба
        return riskyOperation();
    })
    .catch(error => {
        console.error('Спроба 2 не вдалася:', error.message);
        // Повертаємо значення за замовчуванням
        return 'Значення за замовчуванням';
    })
    .then(result => {
        console.log('Фінальний результат:', result);
    });

// ============================================
// Приклад 10: Обробка помилок з таймаутом
// ============================================

function operationWithTimeout(operation, timeout) {
    return Promise.race([
        operation(),
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Таймаут')), timeout);
        })
    ]);
}

operationWithTimeout(
    () => new Promise(resolve => setTimeout(() => resolve('Готово'), 5000)),
    2000
)
.then(result => console.log('Результат:', result))
.catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 11: Глобальна обробка необроблених помилок
// ============================================

// У браузері
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Необроблена помилка Promise:', event.reason);
        event.preventDefault(); // Запобігає виведенню в консоль
    });
}

// У Node.js
if (typeof process !== 'undefined') {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Необроблена помилка Promise:', reason);
    });
}

// Приклад необробленої помилки
Promise.reject(new Error('Необроблена помилка'));

// ============================================
// Приклад 12: Обробка помилок у реальному сценарії
// ============================================

function fetchUser(userId) {
    return new Promise((resolve, reject) => {
        if (userId <= 0) {
            reject(new Error('Невірний ID користувача'));
        } else {
            resolve({ id: userId, name: 'Олена' });
        }
    });
}

function fetchUserPosts(userId) {
    return new Promise((resolve, reject) => {
        if (userId === 999) {
            reject(new Error('Користувач не знайдений'));
        } else {
            resolve([{ id: 1, title: 'Пост 1' }]);
        }
    });
}

fetchUser(1)
    .then(user => {
        console.log('Користувач:', user);
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log('Пости:', posts);
    })
    .catch(error => {
        // Обробляє помилки з обох операцій
        console.error('Помилка завантаження даних:', error.message);
        // Можна показати повідомлення користувачу
        // або використати значення за замовчуванням
    });

// ============================================
// Висновок
// ============================================

/**
 * Способи обробки помилок у Promise:
 * 
 * 1. .catch() - обробка помилок у ланцюжку
 * 2. try-catch з async/await - синхронний стиль
 * 3. Другий параметр .then() - застарілий спосіб
 * 4. Глобальні обробники - для необроблених помилок
 * 
 * Правила:
 * - Помилки перехоплюються найближчим .catch()
 * - Після .catch() ланцюжок продовжується
 * - Можна викинути нову помилку з .catch()
 * - Promise.all() відхиляється при першій помилці
 * - Promise.allSettled() обробляє всі результати
 * 
 * Найкращі практики:
 * - Завжди обробляйте помилки
 * - Використовуйте конкретні типи помилок
 * - Логуйте помилки для налагодження
 * - Надавайте значення за замовчуванням
 * - Не ігноруйте необроблені помилки
 */

