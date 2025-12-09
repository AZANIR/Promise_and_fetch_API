/**
 * Обробка помилок у callback функціях
 * 
 * Правильна обробка помилок - критично важлива частина роботи з callbacks.
 * Зазвичай використовується патерн "error-first callback".
 */

// ============================================
// Приклад 1: Error-First Callback Pattern
// ============================================

/**
 * Стандартний патерн: перший параметр - помилка, другий - дані
 * Якщо помилки немає, перший параметр = null або undefined
 */
function readFile(filename, callback) {
    // Симуляція читання файлу
    setTimeout(() => {
        if (filename === 'error.txt') {
            // Передаємо помилку як перший параметр
            callback(new Error('Файл не знайдено'), null);
        } else {
            // Успіх: помилка = null, дані - другий параметр
            callback(null, `Вміст файлу ${filename}`);
        }
    }, 500);
}

// Правильна обробка
readFile('data.txt', (error, data) => {
    if (error) {
        console.error('Помилка читання файлу:', error.message);
        return; // Важливо: вийти з функції після обробки помилки
    }
    console.log('Дані:', data);
});

readFile('error.txt', (error, data) => {
    if (error) {
        console.error('Помилка читання файлу:', error.message);
        return;
    }
    console.log('Дані:', data);
});

// ============================================
// Приклад 2: Обробка помилок у вкладених callbacks
// ============================================

function getUser(userId, callback) {
    setTimeout(() => {
        if (userId <= 0) {
            callback(new Error('Невірний ID користувача'), null);
        } else {
            callback(null, { id: userId, name: 'Олена' });
        }
    }, 200);
}

function getUserPosts(userId, callback) {
    setTimeout(() => {
        if (userId === 999) {
            callback(new Error('Користувач не знайдений'), null);
        } else {
            callback(null, [
                { id: 1, title: 'Перший пост' },
                { id: 2, title: 'Другий пост' }
            ]);
        }
    }, 300);
}

// Вкладений callback з обробкою помилок
getUser(1, (userError, user) => {
    if (userError) {
        console.error('Помилка отримання користувача:', userError.message);
        return;
    }
    
    console.log('Користувач:', user);
    
    getUserPosts(user.id, (postsError, posts) => {
        if (postsError) {
            console.error('Помилка отримання постів:', postsError.message);
            return;
        }
        
        console.log('Пости:', posts);
    });
});

// ============================================
// Приклад 3: Створення обгортки для безпечної обробки
// ============================================

/**
 * Обгортка для автоматичної обробки помилок
 */
function safeCallback(callback) {
    return function(error, ...args) {
        if (error) {
            console.error('Помилка:', error.message);
            return;
        }
        callback(...args);
    };
}

// Використання обгортки
const safeHandler = safeCallback((data) => {
    console.log('Успішно отримано:', data);
});

readFile('data.txt', safeHandler);
readFile('error.txt', safeHandler);

// ============================================
// Приклад 4: Try-Catch у синхронних callbacks
// ============================================

function processData(data, callback) {
    try {
        // Можлива синхронна помилка
        if (!data) {
            throw new Error('Дані відсутні');
        }
        
        const result = data.toUpperCase();
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

processData('hello', (error, result) => {
    if (error) {
        console.error('Помилка:', error.message);
    } else {
        console.log('Результат:', result); // HELLO
    }
});

processData(null, (error, result) => {
    if (error) {
        console.error('Помилка:', error.message); // Дані відсутні
    } else {
        console.log('Результат:', result);
    }
});

// ============================================
// Приклад 5: Callback з таймаутом та обробкою помилок
// ============================================

function fetchWithTimeout(url, timeout, callback) {
    let isCompleted = false;
    
    // Симуляція запиту
    const request = setTimeout(() => {
        if (!isCompleted) {
            isCompleted = true;
            callback(null, `Дані з ${url}`);
        }
    }, 1000);
    
    // Таймаут
    const timeoutId = setTimeout(() => {
        if (!isCompleted) {
            isCompleted = true;
            clearTimeout(request);
            callback(new Error('Запит перевищив час очікування'), null);
        }
    }, timeout);
    
    // Очищення таймауту при успішному завершенні
    setTimeout(() => {
        if (!isCompleted) {
            clearTimeout(timeoutId);
        }
    }, 1000);
}

fetchWithTimeout('https://api.example.com', 500, (error, data) => {
    if (error) {
        console.error('Помилка:', error.message);
    } else {
        console.log('Дані:', data);
    }
});

// ============================================
// Приклад 6: Логування помилок для автоматизації тестування
// ============================================

/**
 * Callback з детальним логуванням для тестування
 */
function testCallback(error, data, testContext) {
    if (error) {
        console.error(`[TEST ERROR] ${testContext}:`, {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw error; // Для тестів можна викинути помилку
    } else {
        console.log(`[TEST SUCCESS] ${testContext}:`, data);
    }
}

// Використання в тестах
readFile('data.txt', (error, data) => {
    testCallback(error, data, 'Читання тестового файлу');
});

// ============================================
// Висновок
// ============================================

/**
 * Правила обробки помилок у callbacks:
 * 
 * 1. Використовуйте error-first pattern (помилка - перший параметр)
 * 2. Завжди перевіряйте наявність помилки перед обробкою даних
 * 3. Використовуйте return після обробки помилки
 * 4. Логуйте помилки детально для налагодження
 * 5. Обробляйте помилки на кожному рівні вкладеності
 * 6. Використовуйте try-catch для синхронних операцій у callbacks
 */

