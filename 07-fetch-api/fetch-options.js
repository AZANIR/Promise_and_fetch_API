/**
 * Різні опції запитів Fetch API (GET, POST, PUT, DELETE)
 * 
 * Fetch API підтримує різні HTTP методи та опції для налаштування запитів.
 */

// ============================================
// Приклад 1: GET запит (за замовчуванням)
// ============================================

fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log('GET дані:', data));

// З явним вказанням методу
fetch('https://api.example.com/users', {
    method: 'GET'
})
.then(response => response.json())
.then(data => console.log('GET дані:', data));

// ============================================
// Приклад 2: POST запит з JSON даними
// ============================================

fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Олена',
        email: 'olena@example.com'
    })
})
.then(response => response.json())
.then(data => console.log('POST результат:', data))
.catch(error => console.error('Помилка POST:', error));

// ============================================
// Приклад 3: POST запит з FormData
// ============================================

const formData = new FormData();
formData.append('name', 'Олена');
formData.append('email', 'olena@example.com');
formData.append('file', fileInput.files[0]); // Якщо є файл

fetch('https://api.example.com/users', {
    method: 'POST',
    body: formData
    // Content-Type встановлюється автоматично для FormData
})
.then(response => response.json())
.then(data => console.log('POST з FormData:', data));

// ============================================
// Приклад 4: PUT запит (оновлення)
// ============================================

fetch('https://api.example.com/users/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Олена Оновлена',
        email: 'olena.updated@example.com'
    })
})
.then(response => response.json())
.then(data => console.log('PUT результат:', data));

// ============================================
// Приклад 5: PATCH запит (часткове оновлення)
// ============================================

fetch('https://api.example.com/users/1', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'newemail@example.com'
    })
})
.then(response => response.json())
.then(data => console.log('PATCH результат:', data));

// ============================================
// Приклад 6: DELETE запит
// ============================================

fetch('https://api.example.com/users/1', {
    method: 'DELETE'
})
.then(response => {
    if (response.ok) {
        console.log('Користувач видалено');
    } else {
        console.error('Помилка видалення');
    }
});

// ============================================
// Приклад 7: Запит з кастомними заголовками
// ============================================

fetch('https://api.example.com/users', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value',
        'Accept': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log('Дані з заголовками:', data));

// ============================================
// Приклад 8: Запит з credentials (cookies)
// ============================================

fetch('https://api.example.com/users', {
    method: 'GET',
    credentials: 'include' // Включає cookies
})
.then(response => response.json())
.then(data => console.log('Дані з cookies:', data));

// Опції credentials:
// - 'omit' - не відправляти (за замовчуванням для cross-origin)
// - 'same-origin' - тільки для same-origin запитів
// - 'include' - завжди відправляти

// ============================================
// Приклад 9: Запит з режимом CORS
// ============================================

fetch('https://api.example.com/users', {
    method: 'GET',
    mode: 'cors', // Дозволити CORS
    credentials: 'include'
})
.then(response => response.json())
.then(data => console.log('CORS дані:', data));

// Опції mode:
// - 'cors' - дозволити CORS (за замовчуванням)
// - 'no-cors' - обмежений режим
// - 'same-origin' - тільки same-origin запити

// ============================================
// Приклад 10: Запит з кешуванням
// ============================================

fetch('https://api.example.com/users', {
    method: 'GET',
    cache: 'no-cache' // Не використовувати кеш
})
.then(response => response.json())
.then(data => console.log('Дані без кешу:', data));

// Опції cache:
// - 'default' - стандартна поведінка кешу
// - 'no-store' - не зберігати в кеш
// - 'reload' - оновити з сервера
// - 'no-cache' - перевірити з сервером перед використанням кешу
// - 'force-cache' - використовувати кеш навіть якщо застарілий

// ============================================
// Приклад 11: Запит з редиректами
// ============================================

fetch('https://api.example.com/users', {
    method: 'GET',
    redirect: 'follow' // Слідувати редиректам
})
.then(response => response.json())
.then(data => console.log('Дані після редиректу:', data));

// Опції redirect:
// - 'follow' - слідувати редиректам (за замовчуванням)
// - 'error' - помилка при редиректі
// - 'manual' - повернути response з типом 'opaqueredirect'

// ============================================
// Приклад 12: Комплексний приклад з усіма опціями
// ============================================

async function complexFetchRequest() {
    try {
        const response = await fetch('https://api.example.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token123',
                'X-Request-ID': 'unique-id-123'
            },
            body: JSON.stringify({
                name: 'Олена',
                email: 'olena@example.com'
            }),
            mode: 'cors',
            credentials: 'include',
            cache: 'no-cache',
            redirect: 'follow'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Помилка запиту:', error);
        throw error;
    }
}

complexFetchRequest()
    .then(data => console.log('Результат:', data))
    .catch(error => console.error('Помилка:', error));

// ============================================
// Приклад 13: Утиліта для різних типів запитів
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
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Помилка запиту:', error);
            throw error;
        }
    }
    
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    
    post(endpoint, data, options = {}) {
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
    
    put(endpoint, data, options = {}) {
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
    
    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Використання
const api = new ApiClient('https://api.example.com', {
    'Authorization': 'Bearer token123'
});

api.get('/users')
    .then(users => console.log('Користувачі:', users));

api.post('/users', { name: 'Олена', email: 'olena@example.com' })
    .then(user => console.log('Створено:', user));

// ============================================
// Висновок
// ============================================

/**
 * Опції Fetch API:
 * 
 * Основні:
 * - method: GET, POST, PUT, PATCH, DELETE
 * - headers: об'єкт з заголовками
 * - body: дані для відправки
 * 
 * Додаткові:
 * - mode: cors, no-cors, same-origin
 * - credentials: include, same-origin, omit
 * - cache: default, no-store, reload, no-cache, force-cache
 * - redirect: follow, error, manual
 * - signal: AbortSignal для скасування
 * 
 * Важливо:
 * - Завжди вказуйте Content-Type для JSON
 * - Використовуйте JSON.stringify() для body
 * - Обробляйте помилки
 * - Перевіряйте response.ok
 */

