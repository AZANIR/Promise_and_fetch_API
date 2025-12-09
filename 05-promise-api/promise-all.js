/**
 * Promise.all() - виконання кількох Promise одночасно
 * 
 * Promise.all() чекає виконання всіх Promise і повертає масив результатів.
 * Якщо будь-який Promise відхиляється, весь Promise.all() відхиляється.
 */

// ============================================
// Приклад 1: Базове використання Promise.all()
// ============================================

const promise1 = Promise.resolve('Результат 1');
const promise2 = Promise.resolve('Результат 2');
const promise3 = Promise.resolve('Результат 3');

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log('Всі результати:', results);
        // ['Результат 1', 'Результат 2', 'Результат 3']
    })
    .catch(error => {
        console.error('Помилка:', error);
    });

// ============================================
// Приклад 2: Promise.all() з асинхронними операціями
// ============================================

function fetchUser(id) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ id, name: `Користувач ${id}` }), 100);
    });
}

function fetchPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => resolve([{ id: 1, title: 'Пост 1' }]), 150);
    });
}

function fetchComments(userId) {
    return new Promise(resolve => {
        setTimeout(() => resolve([{ id: 1, text: 'Коментар 1' }]), 200);
    });
}

// Виконання всіх запитів одночасно
Promise.all([
    fetchUser(1),
    fetchPosts(1),
    fetchComments(1)
])
.then(([user, posts, comments]) => {
    console.log('Користувач:', user);
    console.log('Пости:', posts);
    console.log('Коментарі:', comments);
});

// ============================================
// Приклад 3: Promise.all() з помилкою
// ============================================

const successPromise = Promise.resolve('Успіх');
const errorPromise = Promise.reject(new Error('Помилка'));

Promise.all([successPromise, errorPromise])
    .then(results => {
        // Це не виконається
        console.log('Результати:', results);
    })
    .catch(error => {
        // Перехоплює першу помилку
        console.error('Помилка в Promise.all():', error.message);
    });

// ============================================
// Приклад 4: Promise.all() з різними типами значень
// ============================================

Promise.all([
    Promise.resolve(1),
    Promise.resolve('текст'),
    Promise.resolve({ name: 'Олена' }),
    Promise.resolve([1, 2, 3])
])
.then(results => {
    console.log('Результати різних типів:', results);
    // [1, 'текст', { name: 'Олена' }, [1, 2, 3]]
});

// ============================================
// Приклад 5: Promise.all() з таймаутом
// ============================================

function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Таймаут')), timeout);
        })
    ]);
}

// Використання з Promise.all()
Promise.all([
    fetchWithTimeout('/api/user', 2000),
    fetchWithTimeout('/api/posts', 2000),
    fetchWithTimeout('/api/comments', 2000)
])
.then(results => {
    console.log('Всі запити завершено:', results);
})
.catch(error => {
    console.error('Помилка або таймаут:', error.message);
});

// ============================================
// Приклад 6: Promise.all() для валідації даних
// ============================================

function validateEmail(email) {
    return Promise.resolve(email.includes('@'));
}

function validatePassword(password) {
    return Promise.resolve(password.length >= 8);
}

function validateUsername(username) {
    return Promise.resolve(username.length >= 3);
}

function validateForm(email, password, username) {
    return Promise.all([
        validateEmail(email),
        validatePassword(password),
        validateUsername(username)
    ])
    .then(([emailValid, passwordValid, usernameValid]) => {
        return {
            valid: emailValid && passwordValid && usernameValid,
            errors: {
                email: !emailValid ? 'Невірний email' : null,
                password: !passwordValid ? 'Пароль занадто короткий' : null,
                username: !usernameValid ? 'Ім\'я користувача занадто коротке' : null
            }
        };
    });
}

validateForm('test@example.com', 'password123', 'user')
    .then(result => {
        console.log('Валідація:', result);
    });

// ============================================
// Приклад 7: Promise.all() для паралельного обчислення
// ============================================

function calculateSquare(n) {
    return Promise.resolve(n * n);
}

function calculateCube(n) {
    return Promise.resolve(n * n * n);
}

function calculateFactorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return Promise.resolve(result);
}

const number = 5;

Promise.all([
    calculateSquare(number),
    calculateCube(number),
    calculateFactorial(number)
])
.then(([square, cube, factorial]) => {
    console.log(`Число: ${number}`);
    console.log(`Квадрат: ${square}`);
    console.log(`Куб: ${cube}`);
    console.log(`Факторіал: ${factorial}`);
});

// ============================================
// Приклад 8: Promise.all() у тестах
// ============================================

/**
 * Використання Promise.all() для паралельного виконання тестів
 */
async function runTests() {
    const test1 = new Promise(resolve => {
        setTimeout(() => resolve('Тест 1 пройдено'), 100);
    });
    
    const test2 = new Promise(resolve => {
        setTimeout(() => resolve('Тест 2 пройдено'), 150);
    });
    
    const test3 = new Promise(resolve => {
        setTimeout(() => resolve('Тест 3 пройдено'), 200);
    });
    
    try {
        const results = await Promise.all([test1, test2, test3]);
        console.log('Всі тести пройдено:', results);
    } catch (error) {
        console.error('Тест не пройдено:', error);
    }
}

runTests();

// ============================================
// Приклад 9: Promise.all() з динамічним масивом
// ============================================

function createPromises(count) {
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(
            new Promise(resolve => {
                setTimeout(() => resolve(`Результат ${i + 1}`), 100 * (i + 1));
            })
        );
    }
    return promises;
}

Promise.all(createPromises(5))
    .then(results => {
        console.log('Всі результати:', results);
    });

// ============================================
// Висновок
// ============================================

/**
 * Promise.all() корисний для:
 * - Паралельного виконання незалежних операцій
 * - Очікування всіх результатів перед продовженням
 * - Валідації множини даних
 * - Паралельного обчислення
 * 
 * Особливості:
 * - Виконує всі Promise одночасно (паралельно)
 * - Повертає результати в тому ж порядку, що й вхідні Promise
 * - Відхиляється при першій помилці
 * - Ефективніше за послідовне виконання
 * 
 * Використовуйте коли:
 * - Операції незалежні одна від одної
 * - Потрібні всі результати
 * - Потрібна максимальна швидкість
 */

