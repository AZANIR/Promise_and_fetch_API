/**
 * Обробка помилок у Fetch API
 * 
 * Fetch API може викликати різні типи помилок:
 * - Помилки мережі (network errors)
 * - HTTP помилки (4xx, 5xx)
 * - Помилки парсингу (parsing errors)
 */

// ============================================
// Приклад 1: Базова обробка помилок
// ============================================

fetch('https://api.example.com/users')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP помилка! статус: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Дані:', data);
    })
    .catch(error => {
        console.error('Помилка:', error.message);
    });

// ============================================
// Приклад 2: Різні типи помилок
// ============================================

async function handleDifferentErrors() {
    try {
        const response = await fetch('https://api.example.com/users');
        
        if (!response.ok) {
            // HTTP помилка (4xx, 5xx)
            if (response.status >= 500) {
                throw new Error(`Помилка сервера: ${response.status}`);
            } else if (response.status === 404) {
                throw new Error('Ресурс не знайдено');
            } else if (response.status === 401) {
                throw new Error('Неавторизований доступ');
            } else {
                throw new Error(`HTTP помилка: ${response.status}`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Помилка мережі або парсингу
        if (error instanceof TypeError) {
            console.error('Помилка мережі:', error.message);
        } else if (error instanceof SyntaxError) {
            console.error('Помилка парсингу JSON:', error.message);
        } else {
            console.error('Інша помилка:', error.message);
        }
        throw error;
    }
}

handleDifferentErrors();

// ============================================
// Приклад 3: Детальна обробка HTTP помилок
// ============================================

async function detailedErrorHandling() {
    try {
        const response = await fetch('https://api.example.com/users');
        
        if (!response.ok) {
            // Спробувати отримати деталі помилки з сервера
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Якщо не вдалося розпарсити JSON, використовуємо текст
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }
            
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Помилка:', error.message);
        throw error;
    }
}

detailedErrorHandling();

// ============================================
// Приклад 4: Обробка помилок мережі
// ============================================

async function handleNetworkErrors() {
    try {
        const response = await fetch('https://api.example.com/users');
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            // Помилка мережі (немає інтернету, неправильний URL)
            console.error('Помилка мережі:', error.message);
            console.error('Можливі причини:');
            console.error('- Немає підключення до інтернету');
            console.error('- Неправильний URL');
            console.error('- CORS помилка');
        } else {
            console.error('Інша помилка:', error.message);
        }
        throw error;
    }
}

handleNetworkErrors();

// ============================================
// Приклад 5: Обробка таймаутів
// ============================================

async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error(`Запит перевищив час очікування (${timeout}мс)`);
        }
        
        throw error;
    }
}

fetchWithTimeout('https://api.example.com/users', 2000)
    .then(data => console.log('Дані:', data))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 6: Повторні спроби при помилках
// ============================================

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                // Не повторюємо для клієнтських помилок (4xx)
                if (response.status >= 400 && response.status < 500) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                // Повторюємо для серверних помилок (5xx)
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Спроба ${i + 1} не вдалася:`, error.message);
            
            if (i === maxRetries - 1) {
                throw error;
            }
            
            // Затримка перед наступною спробою (експоненційна)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

fetchWithRetry('https://api.example.com/users')
    .then(data => console.log('Дані:', data))
    .catch(error => console.error('Всі спроби не вдалися:', error.message));

// ============================================
// Приклад 7: Обробка CORS помилок
// ============================================

async function handleCORSErrors() {
    try {
        const response = await fetch('https://api.example.com/users', {
            mode: 'cors',
            credentials: 'include'
        });
        
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            console.error('CORS помилка:');
            console.error('- Перевірте налаштування CORS на сервері');
            console.error('- Перевірте правильність URL');
            console.error('- Перевірте налаштування credentials');
        }
        throw error;
    }
}

handleCORSErrors();

// ============================================
// Приклад 8: Утиліта для безпечного fetch
// ============================================

async function safeFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        // Обробка HTTP помилок
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Ігноруємо помилки парсингу помилки
            }
            
            return {
                success: false,
                error: errorMessage,
                status: response.status,
                data: null
            };
        }
        
        // Парсинг успішної відповіді
        const contentType = response.headers.get('content-type');
        let data;
        
        try {
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
        } catch (parseError) {
            return {
                success: false,
                error: `Помилка парсингу: ${parseError.message}`,
                status: response.status,
                data: null
            };
        }
        
        return {
            success: true,
            error: null,
            status: response.status,
            data
        };
    } catch (error) {
        // Обробка помилок мережі
        return {
            success: false,
            error: error.message,
            status: null,
            data: null
        };
    }
}

// Використання
safeFetch('https://api.example.com/users')
    .then(result => {
        if (result.success) {
            console.log('Успіх:', result.data);
        } else {
            console.error('Помилка:', result.error);
        }
    });

// ============================================
// Приклад 9: Обробка помилок для тестування
// ============================================

/**
 * Обгортка для тестування з детальним логуванням
 */
async function testableFetch(url, options = {}) {
    const startTime = Date.now();
    
    try {
        const response = await fetch(url, options);
        const duration = Date.now() - startTime;
        
        const result = {
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            duration,
            headers: Object.fromEntries(response.headers.entries())
        };
        
        if (response.ok) {
            try {
                result.data = await response.json();
            } catch {
                result.data = await response.text();
            }
        } else {
            try {
                result.error = await response.json();
            } catch {
                result.error = await response.text();
            }
        }
        
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        
        return {
            success: false,
            error: {
                message: error.message,
                type: error.constructor.name
            },
            duration
        };
    }
}

testableFetch('https://api.example.com/users')
    .then(result => {
        console.log('Результат тестування:', result);
    });

// ============================================
// Висновок
// ============================================

/**
 * Типи помилок у Fetch API:
 * 
 * 1. Мережеві помилки (TypeError):
 *    - Немає підключення
 *    - Неправильний URL
 *    - CORS помилки
 * 
 * 2. HTTP помилки (response.ok === false):
 *    - 4xx: помилки клієнта
 *    - 5xx: помилки сервера
 * 
 * 3. Помилки парсингу (SyntaxError):
 *    - Невірний JSON
 *    - Неочікуваний формат
 * 
 * Найкращі практики:
 * - Завжди перевіряйте response.ok
 * - Обробляйте різні типи помилок окремо
 * - Надавайте зрозумілі повідомлення про помилки
 * - Використовуйте try-catch з async/await
 * - Логуйте помилки для налагодження
 * - Реалізуйте повторні спроби для тимчасових помилок
 */

