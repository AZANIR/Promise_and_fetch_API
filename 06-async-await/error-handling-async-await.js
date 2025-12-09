/**
 * Обробка помилок у async/await
 * 
 * async/await дозволяє використовувати try-catch для обробки помилок
 * у синхронному стилі, що робить код більш читабельним.
 */

// ============================================
// Приклад 1: Базовий try-catch з await
// ============================================

async function basicErrorHandling() {
    try {
        const result = await Promise.reject(new Error('Помилка виконання'));
        return result;
    } catch (error) {
        console.error('Помилка перехоплена:', error.message);
        return 'Значення за замовчуванням';
    }
}

basicErrorHandling().then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 2: Обробка помилок у ланцюжку операцій
// ============================================

async function chainWithErrorHandling() {
    try {
        const step1 = await Promise.resolve('Крок 1');
        console.log(step1);
        
        const step2 = await Promise.reject(new Error('Помилка на кроці 2'));
        console.log(step2); // Не виконається
        
        const step3 = await Promise.resolve('Крок 3');
        console.log(step3); // Не виконається
    } catch (error) {
        console.error('Помилка в ланцюжку:', error.message);
        // Обробка помилки
    }
}

chainWithErrorHandling();

// ============================================
// Приклад 3: Обробка різних типів помилок
// ============================================

async function handleDifferentErrors() {
    try {
        const result = await Promise.reject(new TypeError('Помилка типу'));
        return result;
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('Помилка типу:', error.message);
        } else if (error instanceof ReferenceError) {
            console.error('Помилка посилання:', error.message);
        } else {
            console.error('Загальна помилка:', error.message);
        }
        return null;
    }
}

handleDifferentErrors();

// ============================================
// Приклад 4: Обробка помилок у вкладених функціях
// ============================================

async function innerFunction() {
    throw new Error('Помилка всередині');
}

async function outerFunction() {
    try {
        await innerFunction();
    } catch (error) {
        console.error('Помилка перехоплена у зовнішній функції:', error.message);
    }
}

outerFunction();

// ============================================
// Приклад 5: Обробка помилок з Promise.all()
// ============================================

async function handlePromiseAllErrors() {
    try {
        const results = await Promise.all([
            Promise.resolve('Успіх 1'),
            Promise.reject(new Error('Помилка 2')),
            Promise.resolve('Успіх 3')
        ]);
        console.log('Результати:', results);
    } catch (error) {
        console.error('Помилка в Promise.all():', error.message);
        // Promise.all() відхиляється при першій помилці
    }
}

handlePromiseAllErrors();

// ============================================
// Приклад 6: Обробка помилок з Promise.allSettled()
// ============================================

async function handleAllSettledErrors() {
    const results = await Promise.allSettled([
        Promise.resolve('Успіх 1'),
        Promise.reject(new Error('Помилка 2')),
        Promise.resolve('Успіх 3')
    ]);
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index + 1}: успіх -`, result.value);
        } else {
            console.error(`Promise ${index + 1}: помилка -`, result.reason.message);
        }
    });
}

handleAllSettledErrors();

// ============================================
// Приклад 7: Повторні спроби з обробкою помилок
// ============================================

async function retryOperation(operation, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await operation();
            return result;
        } catch (error) {
            console.error(`Спроба ${i + 1} не вдалася:`, error.message);
            if (i === maxRetries - 1) {
                throw error; // Остання спроба не вдалася
            }
            // Затримка перед наступною спробою
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Використання
retryOperation(() => {
    return Math.random() > 0.5 
        ? Promise.resolve('Успіх')
        : Promise.reject(new Error('Помилка'));
})
.then(result => console.log('Результат:', result))
.catch(error => console.error('Всі спроби не вдалися:', error.message));

// ============================================
// Приклад 8: Обробка помилок з таймаутом
// ============================================

async function operationWithTimeout(operation, timeout) {
    try {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Таймаут')), timeout);
        });
        
        const result = await Promise.race([operation(), timeoutPromise]);
        return result;
    } catch (error) {
        if (error.message === 'Таймаут') {
            console.error('Операція перевищила час очікування');
        } else {
            console.error('Помилка операції:', error.message);
        }
        throw error;
    }
}

operationWithTimeout(
    () => new Promise(resolve => setTimeout(() => resolve('Готово'), 5000)),
    2000
)
.catch(error => {
    console.error('Операція не завершена:', error.message);
});

// ============================================
// Приклад 9: Обробка помилок з fallback значенням
// ============================================

async function operationWithFallback() {
    try {
        const result = await Promise.reject(new Error('Помилка'));
        return result;
    } catch (error) {
        console.error('Помилка:', error.message);
        // Повертаємо значення за замовчуванням
        return { default: true, message: 'Використано значення за замовчуванням' };
    }
}

operationWithFallback().then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 10: Обробка помилок у реальному сценарії
// ============================================

async function loadUserData(userId) {
    try {
        const user = await fetchUser(userId);
        
        if (!user) {
            throw new Error('Користувач не знайдений');
        }
        
        const posts = await fetchPosts(user.id);
        const comments = await fetchComments(user.id);
        
        return {
            user,
            posts,
            comments
        };
    } catch (error) {
        console.error('Помилка завантаження даних:', error.message);
        
        // Можна повернути часткові дані або значення за замовчуванням
        return {
            user: null,
            posts: [],
            comments: [],
            error: error.message
        };
    }
}

// Допоміжні функції
function fetchUser(id) {
    if (id === 999) {
        return Promise.reject(new Error('Користувач не знайдений'));
    }
    return Promise.resolve({ id, name: 'Олена' });
}

function fetchPosts(userId) {
    return Promise.resolve([{ id: 1, title: 'Пост 1' }]);
}

function fetchComments(userId) {
    return Promise.resolve([{ id: 1, text: 'Коментар 1' }]);
}

loadUserData(1).then(data => {
    console.log('Дані:', data);
});

// ============================================
// Приклад 11: Обробка помилок з детальним логуванням
// ============================================

async function operationWithDetailedLogging() {
    try {
        const result = await Promise.reject(new Error('Помилка виконання'));
        return result;
    } catch (error) {
        // Детальне логування для налагодження
        console.error('Помилка:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            context: 'operationWithDetailedLogging'
        });
        
        // Можна відправити помилку на сервер для моніторингу
        // await sendErrorToServer(error);
        
        throw error; // Прокидаємо помилку далі
    }
}

operationWithDetailedLogging().catch(error => {
    console.error('Фінальна обробка помилки:', error.message);
});

// ============================================
// Висновок
// ============================================

/**
 * Обробка помилок у async/await:
 * 
 * 1. try-catch - основний спосіб обробки помилок
 * 2. Помилки автоматично перехоплюються найближчим catch
 * 3. Можна обробляти різні типи помилок
 * 4. Помилки можна прокидати далі через throw
 * 5. Можна повертати значення за замовчуванням
 * 
 * Переваги над Promise.catch():
 * - Синхронний стиль обробки помилок
 * - Краща читабельність
 * - Легше обробляти вкладені операції
 * - Підтримка finally блоків
 * 
 * Найкращі практики:
 * - Завжди обробляйте помилки
 * - Використовуйте конкретні типи помилок
 * - Логуйте помилки для налагодження
 * - Надавайте значення за замовчуванням
 * - Не ігноруйте помилки
 */

