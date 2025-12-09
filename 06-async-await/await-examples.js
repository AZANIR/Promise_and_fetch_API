/**
 * Використання await в JavaScript
 * 
 * await призупиняє виконання async функції до завершення Promise.
 * Він дозволяє писати асинхронний код у синхронному стилі.
 */

// ============================================
// Приклад 1: Базове використання await
// ============================================

async function basicAwait() {
    const result = await Promise.resolve('Результат');
    console.log('Результат:', result);
    return result;
}

basicAwait();

// ============================================
// Приклад 2: await з різними типами Promise
// ============================================

async function differentPromises() {
    // Resolved Promise
    const value1 = await Promise.resolve(42);
    console.log('Значення 1:', value1);
    
    // Promise з затримкою
    const value2 = await new Promise(resolve => {
        setTimeout(() => resolve('Готово'), 500);
    });
    console.log('Значення 2:', value2);
    
    // Promise з об'єктом
    const value3 = await Promise.resolve({ name: 'Олена', age: 25 });
    console.log('Значення 3:', value3);
    
    return { value1, value2, value3 };
}

differentPromises();

// ============================================
// Приклад 3: Послідовне виконання з await
// ============================================

async function sequentialAwait() {
    console.log('Початок');
    
    const step1 = await new Promise(resolve => {
        setTimeout(() => resolve('Крок 1 виконано'), 300);
    });
    console.log(step1);
    
    const step2 = await new Promise(resolve => {
        setTimeout(() => resolve('Крок 2 виконано'), 200);
    });
    console.log(step2);
    
    const step3 = await new Promise(resolve => {
        setTimeout(() => resolve('Крок 3 виконано'), 100);
    });
    console.log(step3);
    
    console.log('Всі кроки завершено');
}

sequentialAwait();

// ============================================
// Приклад 4: await з функціями, що повертають Promise
// ============================================

function fetchUser(id) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ id, name: 'Олена' }), 500);
    });
}

function fetchPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => resolve([{ id: 1, title: 'Пост 1' }]), 300);
    });
}

async function loadUserData(userId) {
    const user = await fetchUser(userId);
    console.log('Користувач:', user);
    
    const posts = await fetchPosts(userId);
    console.log('Пости:', posts);
    
    return { user, posts };
}

loadUserData(1).then(data => {
    console.log('Всі дані:', data);
});

// ============================================
// Приклад 5: await з обробкою помилок
// ============================================

async function awaitWithErrorHandling() {
    try {
        const result = await Promise.reject(new Error('Помилка виконання'));
        return result;
    } catch (error) {
        console.error('Помилка перехоплена:', error.message);
        return 'Значення за замовчуванням';
    }
}

awaitWithErrorHandling().then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 6: await з умовами
// ============================================

async function conditionalAwait(shouldWait) {
    if (shouldWait) {
        const result = await new Promise(resolve => {
            setTimeout(() => resolve('Очікування завершено'), 1000);
        });
        return result;
    } else {
        return 'Очікування пропущено';
    }
}

conditionalAwait(true).then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 7: await в циклах
// ============================================

async function awaitInLoop() {
    const items = [1, 2, 3, 4, 5];
    const results = [];
    
    for (const item of items) {
        const result = await new Promise(resolve => {
            setTimeout(() => resolve(`Оброблено ${item}`), 100);
        });
        results.push(result);
        console.log(result);
    }
    
    return results;
}

awaitInLoop().then(results => {
    console.log('Всі результати:', results);
});

// ============================================
// Приклад 8: await з Promise.all() для паралельного виконання
// ============================================

async function parallelWithAwait() {
    const promise1 = new Promise(resolve => {
        setTimeout(() => resolve('Результат 1'), 300);
    });
    
    const promise2 = new Promise(resolve => {
        setTimeout(() => resolve('Результат 2'), 200);
    });
    
    const promise3 = new Promise(resolve => {
        setTimeout(() => resolve('Результат 3'), 100);
    });
    
    // Паралельне виконання
    const results = await Promise.all([promise1, promise2, promise3]);
    console.log('Всі результати:', results);
    
    return results;
}

parallelWithAwait();

// ============================================
// Приклад 9: await з деструктуризацією
// ============================================

async function awaitWithDestructuring() {
    const { name, age } = await Promise.resolve({
        name: 'Олена',
        age: 25
    });
    
    console.log('Ім\'я:', name);
    console.log('Вік:', age);
}

awaitWithDestructuring();

// ============================================
// Приклад 10: await з вкладеними викликами
// ============================================

async function nestedAwait() {
    const outer = await new Promise(resolve => {
        setTimeout(() => resolve('Зовнішній'), 200);
    });
    
    console.log('Зовнішній результат:', outer);
    
    const inner = await new Promise(resolve => {
        setTimeout(() => resolve('Внутрішній'), 100);
    });
    
    console.log('Внутрішній результат:', inner);
    
    return { outer, inner };
}

nestedAwait();

// ============================================
// Приклад 11: await з обробкою таймаутів
// ============================================

async function awaitWithTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Таймаут')), timeout);
    });
    
    try {
        const result = await Promise.race([promise, timeoutPromise]);
        return result;
    } catch (error) {
        console.error('Помилка або таймаут:', error.message);
        throw error;
    }
}

awaitWithTimeout(
    new Promise(resolve => setTimeout(() => resolve('Готово'), 5000)),
    2000
)
.catch(error => {
    console.error('Операція не завершена:', error.message);
});

// ============================================
// Приклад 12: await з множинними операціями
// ============================================

async function multipleAwaits() {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    const comments = await fetchPosts(user.id); // Симуляція
    
    return {
        user,
        posts,
        comments
    };
}

multipleAwaits().then(data => {
    console.log('Всі дані завантажені:', data);
});

// ============================================
// Висновок
// ============================================

/**
 * await:
 * - Призупиняє виконання async функції
 * - Очікує завершення Promise
 * - Повертає значення з Promise
 * - Може використовуватися тільки в async функціях
 * - Дозволяє обробляти помилки через try-catch
 * 
 * Особливості:
 * - await не блокує Event Loop
 * - Код після await виконується після завершення Promise
 * - Можна використовувати з будь-яким Promise
 * - Підтримує деструктуризацію
 * 
 * Використання:
 * - Для послідовного виконання асинхронних операцій
 * - З Promise.all() для паралельного виконання
 * - В циклах для обробки послідовностей
 * - З try-catch для обробки помилок
 */

