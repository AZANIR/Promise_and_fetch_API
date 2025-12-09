/**
 * Ланцюжки Promise (Promise Chaining)
 * 
 * Ланцюжки дозволяють послідовно обробляти асинхронні операції,
 * передаючи результат від одного Promise до наступного.
 */

// ============================================
// Приклад 1: Базовий ланцюжок
// ============================================

Promise.resolve('Початок')
    .then(result => {
        console.log('Крок 1:', result);
        return result + ' -> Крок 2';
    })
    .then(result => {
        console.log('Крок 2:', result);
        return result + ' -> Крок 3';
    })
    .then(result => {
        console.log('Крок 3:', result);
        return result + ' -> Кінець';
    })
    .then(result => {
        console.log('Фінальний результат:', result);
    });

// ============================================
// Приклад 2: Ланцюжок з асинхронними операціями
// ============================================

function asyncStep1() {
    return new Promise(resolve => {
        setTimeout(() => resolve('Результат кроку 1'), 500);
    });
}

function asyncStep2(data) {
    return new Promise(resolve => {
        setTimeout(() => resolve(`${data} -> Результат кроку 2`), 500);
    });
}

function asyncStep3(data) {
    return new Promise(resolve => {
        setTimeout(() => resolve(`${data} -> Результат кроку 3`), 500);
    });
}

asyncStep1()
    .then(asyncStep2)
    .then(asyncStep3)
    .then(result => {
        console.log('Всі кроки завершено:', result);
    });

// ============================================
// Приклад 3: Ланцюжок з обробкою помилок
// ============================================

function step1() {
    return Promise.resolve('Крок 1 виконано');
}

function step2(data) {
    return Promise.resolve(`${data} -> Крок 2 виконано`);
}

function step3(data) {
    return Promise.reject(new Error('Помилка на кроці 3'));
}

function step4(data) {
    return Promise.resolve(`${data} -> Крок 4 виконано`);
}

step1()
    .then(step2)
    .then(step3)  // Тут виникне помилка
    .then(step4)  // Це не виконається
    .catch(error => {
        console.error('Помилка в ланцюжку:', error.message);
        return 'Відновлення після помилки';
    })
    .then(result => {
        console.log('Після обробки помилки:', result);
    });

// ============================================
// Приклад 4: Повернення значень у ланцюжку
// ============================================

Promise.resolve(10)
    .then(value => {
        console.log('Початкове значення:', value);
        return value * 2;  // Повертаємо число
    })
    .then(value => {
        console.log('Помножено на 2:', value);
        return value + 5;  // Повертаємо число
    })
    .then(value => {
        console.log('Додано 5:', value);
        return Promise.resolve(value * 3);  // Повертаємо Promise
    })
    .then(value => {
        console.log('Помножено на 3:', value);
    });

// ============================================
// Приклад 5: Ланцюжок з умовами
// ============================================

function processData(data) {
    return Promise.resolve(data)
        .then(value => {
            if (value > 0) {
                return value * 2;
            } else {
                throw new Error('Значення має бути додатним');
            }
        })
        .then(value => {
            if (value > 10) {
                return value - 5;
            }
            return value;
        })
        .catch(error => {
            console.error('Помилка обробки:', error.message);
            return 0;  // Значення за замовчуванням
        });
}

processData(5).then(result => console.log('Результат:', result));
processData(-5).then(result => console.log('Результат:', result));

// ============================================
// Приклад 6: Вкладені ланцюжки
// ============================================

Promise.resolve('Зовнішній ланцюжок')
    .then(outerResult => {
        console.log('Зовнішній крок 1:', outerResult);
        
        // Внутрішній ланцюжок
        return Promise.resolve('Внутрішній ланцюжок')
            .then(innerResult => {
                console.log('Внутрішній крок 1:', innerResult);
                return innerResult + ' -> Внутрішній крок 2';
            })
            .then(innerResult => {
                console.log('Внутрішній крок 2:', innerResult);
                return innerResult;
            });
    })
    .then(finalResult => {
        console.log('Фінальний результат:', finalResult);
    });

// ============================================
// Приклад 7: Ланцюжок з обробкою різних типів даних
// ============================================

Promise.resolve({ name: 'Олена', age: 25 })
    .then(user => {
        console.log('Користувач:', user);
        return user.name;
    })
    .then(name => {
        console.log('Ім\'я:', name);
        return name.toUpperCase();
    })
    .then(upperName => {
        console.log('Великі літери:', upperName);
        return upperName.length;
    })
    .then(length => {
        console.log('Довжина імені:', length);
    });

// ============================================
// Приклад 8: Ланцюжок з паралельними операціями
// ============================================

function fetchUser(id) {
    return Promise.resolve({ id, name: 'Олена' });
}

function fetchPosts(userId) {
    return Promise.resolve([
        { id: 1, title: 'Пост 1' },
        { id: 2, title: 'Пост 2' }
    ]);
}

function fetchComments(userId) {
    return Promise.resolve([
        { id: 1, text: 'Коментар 1' }
    ]);
}

fetchUser(1)
    .then(user => {
        console.log('Користувач отримано:', user);
        // Паралельне виконання
        return Promise.all([
            fetchPosts(user.id),
            fetchComments(user.id)
        ]);
    })
    .then(([posts, comments]) => {
        console.log('Пости:', posts);
        console.log('Коментарі:', comments);
        return { posts, comments };
    })
    .then(data => {
        console.log('Всі дані зібрані:', data);
    });

// ============================================
// Приклад 9: Ланцюжок з finally
// ============================================

Promise.resolve('Початок')
    .then(result => {
        console.log('Крок 1:', result);
        return 'Крок 2';
    })
    .then(result => {
        console.log('Крок 2:', result);
        return 'Крок 3';
    })
    .finally(() => {
        // Виконується завжди, незалежно від успіху чи помилки
        console.log('Очищення ресурсів');
    })
    .then(result => {
        console.log('Після finally:', result);
    });

// ============================================
// Приклад 10: Реальний сценарій - обробка даних користувача
// ============================================

function validateUser(userId) {
    return Promise.resolve({ id: userId, valid: true });
}

function authenticateUser(user) {
    return Promise.resolve({ ...user, authenticated: true });
}

function loadUserProfile(user) {
    return Promise.resolve({ ...user, profile: { name: 'Олена', age: 25 } });
}

function loadUserSettings(user) {
    return Promise.resolve({ ...user, settings: { theme: 'dark' } });
}

validateUser(1)
    .then(authenticateUser)
    .then(loadUserProfile)
    .then(loadUserSettings)
    .then(user => {
        console.log('Користувач повністю завантажений:', user);
    })
    .catch(error => {
        console.error('Помилка завантаження:', error);
    });

// ============================================
// Висновок
// ============================================

/**
 * Ланцюжки Promise дозволяють:
 * 
 * 1. Послідовно обробляти асинхронні операції
 * 2. Передавати дані між кроками
 * 3. Обробляти помилки централізовано
 * 4. Створювати читабельний код
 * 
 * Правила:
 * - .then() повертає новий Promise
 * - Значення передається до наступного .then()
 * - Помилки перехоплюються найближчим .catch()
 * - .finally() виконується завжди
 * - Можна повертати значення або Promise
 * 
 * Переваги над callbacks:
 * - Немає callback hell
 * - Легше обробляти помилки
 * - Краща читабельність
 * - Легше тестувати
 */

