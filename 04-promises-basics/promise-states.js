/**
 * Стани Promise в JavaScript
 * 
 * Promise може бути в одному з трьох станів:
 * 1. pending - очікування (початковий стан)
 * 2. fulfilled (resolved) - успішно виконано
 * 3. rejected - виконано з помилкою
 */

// ============================================
// Приклад 1: Стан pending
// ============================================

console.log('=== Приклад 1: Стан pending ===');

const pendingPromise = new Promise((resolve, reject) => {
    // Поки не викликано resolve або reject, Promise в стані pending
    console.log('Promise створено, стан: pending');
    
    setTimeout(() => {
        resolve('Виконано');
    }, 2000);
});

console.log('Promise створено:', pendingPromise);
console.log('Стан: pending (очікування)');

pendingPromise.then(result => {
    console.log('Результат:', result);
    console.log('Стан: fulfilled');
});

// ============================================
// Приклад 2: Стан fulfilled (resolved)
// ============================================

console.log('=== Приклад 2: Стан fulfilled ===');

const fulfilledPromise = new Promise((resolve) => {
    resolve('Успішно виконано');
});

fulfilledPromise.then(result => {
    console.log('Promise виконано:', result);
    console.log('Стан: fulfilled');
});

// Або з Promise.resolve()
const quickFulfilled = Promise.resolve('Готово');
quickFulfilled.then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 3: Стан rejected
// ============================================

console.log('=== Приклад 3: Стан rejected ===');

const rejectedPromise = new Promise((resolve, reject) => {
    reject(new Error('Помилка виконання'));
});

rejectedPromise
    .then(result => {
        console.log('Це не виконається');
    })
    .catch(error => {
        console.log('Promise відхилено:', error.message);
        console.log('Стан: rejected');
    });

// Або з Promise.reject()
const quickRejected = Promise.reject(new Error('Швидка помилка'));
quickRejected.catch(error => {
    console.log('Помилка:', error.message);
});

// ============================================
// Приклад 4: Перехід між станами
// ============================================

console.log('=== Приклад 4: Перехід між станами ===');

function demonstrateStates() {
    console.log('1. Створення Promise - стан: pending');
    
    const promise = new Promise((resolve, reject) => {
        console.log('2. Всередині Promise - стан: pending');
        
        setTimeout(() => {
            console.log('3. Виклик resolve - перехід до fulfilled');
            resolve('Успіх');
        }, 1000);
    });
    
    console.log('4. Promise створено - стан: pending');
    
    promise.then(result => {
        console.log('5. Обробка результату - стан: fulfilled');
        console.log('Результат:', result);
    });
    
    return promise;
}

demonstrateStates();

// ============================================
// Приклад 5: Promise не може змінити стан
// ============================================

console.log('=== Приклад 5: Незмінність стану ===');

const immutablePromise = new Promise((resolve, reject) => {
    resolve('Перший resolve');
    
    // Ці виклики ігноруються - Promise вже resolved
    resolve('Другий resolve');
    reject(new Error('Помилка'));
});

immutablePromise.then(result => {
    console.log('Результат:', result); // Тільки "Перший resolve"
});

// ============================================
// Приклад 6: Перевірка стану Promise
// ============================================

console.log('=== Приклад 6: Перевірка стану ===');

/**
 * Примітка: JavaScript не надає прямого способу перевірити стан Promise
 * Але можна використати прапорець
 */
function createTrackablePromise() {
    let state = 'pending';
    let result = null;
    let error = null;
    
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            state = 'fulfilled';
            result = 'Успіх';
            resolve(result);
        }, 1000);
    });
    
    promise.catch(err => {
        state = 'rejected';
        error = err;
    });
    
    return {
        promise,
        getState: () => state,
        getResult: () => result,
        getError: () => error
    };
}

const trackable = createTrackablePromise();

console.log('Початковий стан:', trackable.getState()); // pending

trackable.promise.then(() => {
    console.log('Після виконання:', trackable.getState()); // fulfilled
    console.log('Результат:', trackable.getResult());
});

// ============================================
// Приклад 7: Стани в ланцюжках Promise
// ============================================

console.log('=== Приклад 7: Стани в ланцюжках ===');

Promise.resolve('Крок 1')
    .then(result => {
        console.log('Крок 1 - стан: fulfilled, результат:', result);
        return 'Крок 2';
    })
    .then(result => {
        console.log('Крок 2 - стан: fulfilled, результат:', result);
        return Promise.resolve('Крок 3');
    })
    .then(result => {
        console.log('Крок 3 - стан: fulfilled, результат:', result);
    })
    .catch(error => {
        console.log('Помилка - стан: rejected', error);
    });

// ============================================
// Приклад 8: Стани при помилках
// ============================================

console.log('=== Приклад 8: Стани при помилках ===');

Promise.resolve('Початок')
    .then(result => {
        console.log('Крок 1:', result);
        throw new Error('Помилка на кроці 1');
    })
    .then(result => {
        // Це не виконається - Promise перейшов у стан rejected
        console.log('Крок 2:', result);
    })
    .catch(error => {
        console.log('Обробка помилки - стан: rejected');
        console.log('Помилка:', error.message);
        // Після catch Promise знову стає fulfilled
        return 'Відновлено';
    })
    .then(result => {
        console.log('Після catch - стан: fulfilled, результат:', result);
    });

// ============================================
// Приклад 9: Всі можливі стани
// ============================================

console.log('=== Приклад 9: Всі стани ===');

// Pending
const p1 = new Promise(() => {});
console.log('P1: pending (нескінченно)');

// Fulfilled одразу
const p2 = Promise.resolve('fulfilled');
p2.then(() => console.log('P2: fulfilled'));

// Rejected одразу
const p3 = Promise.reject(new Error('rejected'));
p3.catch(() => console.log('P3: rejected'));

// Pending -> Fulfilled
const p4 = new Promise(resolve => {
    setTimeout(() => resolve('fulfilled'), 500);
});
p4.then(() => console.log('P4: pending -> fulfilled'));

// Pending -> Rejected
const p5 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('rejected')), 500);
});
p5.catch(() => console.log('P5: pending -> rejected'));

// ============================================
// Висновок
// ============================================

/**
 * Стани Promise:
 * 
 * 1. pending - початковий стан, очікування виконання
 * 2. fulfilled (resolved) - успішно виконано, є результат
 * 3. rejected - виконано з помилкою
 * 
 * Важливі особливості:
 * - Promise може бути тільки в одному стані
 * - Стан змінюється тільки один раз (pending -> fulfilled або rejected)
 * - Після зміни стану він більше не змінюється
 * - Неможливо напряму перевірити стан Promise (потрібні обгортки)
 * - .then() обробляє fulfilled
 * - .catch() обробляє rejected
 * - Після .catch() Promise знову стає fulfilled (якщо повертається значення)
 */

