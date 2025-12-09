/**
 * Комбінація Fetch API з async/await
 * 
 * async/await робить роботу з Fetch API більш читабельною та зручною.
 */

// ============================================
// Приклад 1: Базовий async/await з fetch
// ============================================

async function fetchUsers() {
    try {
        const response = await fetch('https://api.example.com/users');
        const users = await response.json();
        console.log('Користувачі:', users);
        return users;
    } catch (error) {
        console.error('Помилка:', error);
        throw error;
    }
}

fetchUsers();

// ============================================
// Приклад 2: Послідовні запити
// ============================================

async function fetchUserData(userId) {
    try {
        // Спочатку отримуємо користувача
        const userResponse = await fetch(`https://api.example.com/users/${userId}`);
        if (!userResponse.ok) {
            throw new Error(`HTTP ${userResponse.status}: ${userResponse.statusText}`);
        }
        const user = await userResponse.json();
        
        // Потім отримуємо пости користувача
        const postsResponse = await fetch(`https://api.example.com/users/${userId}/posts`);
        if (!postsResponse.ok) {
            throw new Error(`HTTP ${postsResponse.status}: ${postsResponse.statusText}`);
        }
        const posts = await postsResponse.json();
        
        // Потім отримуємо коментарі
        const commentsResponse = await fetch(`https://api.example.com/users/${userId}/comments`);
        if (!commentsResponse.ok) {
            throw new Error(`HTTP ${commentsResponse.status}: ${commentsResponse.statusText}`);
        }
        const comments = await commentsResponse.json();
        
        return { user, posts, comments };
    } catch (error) {
        console.error('Помилка завантаження даних:', error.message);
        throw error;
    }
}

fetchUserData(1)
    .then(data => console.log('Всі дані:', data))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 3: Паралельні запити з Promise.all()
// ============================================

async function fetchUserDataParallel(userId) {
    try {
        // Всі запити виконуються одночасно
        const [userResponse, postsResponse, commentsResponse] = await Promise.all([
            fetch(`https://api.example.com/users/${userId}`),
            fetch(`https://api.example.com/users/${userId}/posts`),
            fetch(`https://api.example.com/users/${userId}/comments`)
        ]);
        
        // Перевірка статусів
        if (!userResponse.ok || !postsResponse.ok || !commentsResponse.ok) {
            throw new Error('Один або кілька запитів не вдалися');
        }
        
        // Парсинг всіх відповідей
        const [user, posts, comments] = await Promise.all([
            userResponse.json(),
            postsResponse.json(),
            commentsResponse.json()
        ]);
        
        return { user, posts, comments };
    } catch (error) {
        console.error('Помилка:', error.message);
        throw error;
    }
}

fetchUserDataParallel(1)
    .then(data => console.log('Всі дані (паралельно):', data))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 4: POST запит з async/await
// ============================================

async function createUser(userData) {
    try {
        const response = await fetch('https://api.example.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const newUser = await response.json();
        console.log('Користувач створено:', newUser);
        return newUser;
    } catch (error) {
        console.error('Помилка створення користувача:', error.message);
        throw error;
    }
}

createUser({ name: 'Олена', email: 'olena@example.com' })
    .then(user => console.log('Результат:', user))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 5: PUT запит з async/await
// ============================================

async function updateUser(userId, userData) {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const updatedUser = await response.json();
        console.log('Користувач оновлено:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Помилка оновлення:', error.message);
        throw error;
    }
}

updateUser(1, { name: 'Олена Оновлена', email: 'olena.updated@example.com' })
    .then(user => console.log('Оновлено:', user))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 6: DELETE запит з async/await
// ============================================

async function deleteUser(userId) {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('Користувач видалено');
        return true;
    } catch (error) {
        console.error('Помилка видалення:', error.message);
        throw error;
    }
}

deleteUser(1)
    .then(success => console.log('Видалення успішне:', success))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 7: Обробка помилок з деталями
// ============================================

async function fetchWithDetailedErrorHandling(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // Спробувати отримати деталі помилки
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Якщо не вдалося розпарсити, використовуємо текст
                try {
                    errorMessage = await response.text();
                } catch {
                    // Якщо і текст не вдалося отримати, використовуємо стандартне повідомлення
                }
            }
            
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('Помилка мережі:', error.message);
        } else {
            console.error('Помилка HTTP:', error.message);
        }
        throw error;
    }
}

fetchWithDetailedErrorHandling('https://api.example.com/users')
    .then(data => console.log('Дані:', data))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 8: Клас API клієнта з async/await
// ============================================

class ApiClient {
    constructor(baseUrl, defaultHeaders = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // Ігноруємо помилки парсингу помилки
                }
                throw new Error(errorMessage);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('Помилка запиту:', error.message);
            throw error;
        }
    }
    
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Використання
const api = new ApiClient('https://api.example.com', {
    'Authorization': 'Bearer token123'
});

async function useApiClient() {
    try {
        const users = await api.get('/users');
        console.log('Користувачі:', users);
        
        const newUser = await api.post('/users', {
            name: 'Олена',
            email: 'olena@example.com'
        });
        console.log('Створено:', newUser);
        
        const updatedUser = await api.put(`/users/${newUser.id}`, {
            name: 'Олена Оновлена'
        });
        console.log('Оновлено:', updatedUser);
        
        await api.delete(`/users/${newUser.id}`);
        console.log('Видалено');
    } catch (error) {
        console.error('Помилка API:', error.message);
    }
}

useApiClient();

// ============================================
// Висновок
// ============================================

/**
 * Переваги комбінації Fetch API з async/await:
 * 
 * 1. Читабельність:
 *    - Код виглядає як синхронний
 *    - Легше розуміти послідовність операцій
 * 
 * 2. Обробка помилок:
 *    - Використання try-catch
 *    - Легше обробляти різні типи помилок
 * 
 * 3. Структура:
 *    - Можна використовувати умови та цикли
 *    - Легше організувати складну логіку
 * 
 * 4. Комбінація:
 *    - Можна комбінувати з Promise.all() для паралельних запитів
 *    - Можна використовувати Promise.race() для таймаутів
 * 
 * Найкращі практики:
 * - Завжди використовуйте try-catch
 * - Перевіряйте response.ok
 * - Обробляйте різні типи помилок
 * - Використовуйте Promise.all() для паралельних запитів
 * - Створюйте утиліти для повторного використання
 */

