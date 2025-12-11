/**
 * Різні опції запитів Fetch API (GET, POST, PUT, DELETE)
 * 
 * Fetch API підтримує різні HTTP методи та опції для налаштування запитів.
 */

// ============================================
// Приклад 1: GET запит (за замовчуванням)
// ============================================

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
    .then(response => response.json())
    .then(data => console.log('GET дані:', data));

// З явним вказанням методу
fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available', {
    method: 'GET'
})
.then(response => response.json())
.then(data => console.log('GET дані:', data));

// ============================================
// Приклад 2: POST запит з JSON даними
// ============================================

fetch('https://petstore.swagger.io/v2/pet', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 0,
        name: 'Барсик',
        status: 'available',
        category: { id: 1, name: 'Коти' },
        photoUrls: ['https://example.com/cat.jpg']
    })
})
.then(response => response.json())
.then(data => console.log('POST результат:', data))
.catch(error => console.error('Помилка POST:', error));

// ============================================
// Приклад 3: POST запит з FormData
// ============================================

// Примітка: Petstore API не підтримує FormData для створення тварин
// Але показуємо приклад FormData для інших API, які підтримують multipart/form-data
// const formData = new FormData();
// formData.append('name', 'Барсик');
// formData.append('status', 'available');
// formData.append('file', fileInput.files[0]); // Якщо є файл

// Приклад з FormData (для API, які підтримують multipart/form-data)
// fetch('https://api.example.com/upload', {
//     method: 'POST',
//     body: formData
//     // Content-Type встановлюється автоматично для FormData
// })
// .then(response => response.json())
// .then(data => console.log('POST з FormData:', data))
// .catch(error => console.error('Помилка:', error));

console.log('Примітка: Petstore API використовує JSON, а не FormData для створення тварин');

// ============================================
// Приклад 4: PUT запит (оновлення)
// ============================================

fetch('https://petstore.swagger.io/v2/pet', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 1,
        name: 'Барсик Оновлений',
        status: 'sold',
        category: { id: 1, name: 'Коти' },
        photoUrls: ['https://example.com/cat-updated.jpg']
    })
})
.then(response => response.json())
.then(data => console.log('PUT результат:', data))
.catch(error => console.error('Помилка PUT:', error));

// ============================================
// Приклад 5: PATCH запит (часткове оновлення)
// ============================================

// Petstore API не має PATCH, але показуємо приклад для інших API
// Використовуємо PUT для оновлення тварини
fetch('https://petstore.swagger.io/v2/pet', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 1,
        name: 'Барсик',
        status: 'pending', // Змінюємо тільки статус
        category: { id: 1, name: 'Коти' },
        photoUrls: ['https://example.com/cat.jpg']
    })
})
.then(response => response.json())
.then(data => console.log('PUT результат (часткове оновлення):', data))
.catch(error => console.error('Помилка:', error));

// ============================================
// Приклад 6: DELETE запит
// ============================================

fetch('https://petstore.swagger.io/v2/pet/1', {
    method: 'DELETE',
    headers: {
        'api_key': 'special-key' // Petstore API вимагає api_key для DELETE
    }
})
.then(response => {
    if (response.ok) {
        console.log('Тварину видалено');
    } else {
        console.error('Помилка видалення');
    }
})
.catch(error => console.error('Помилка:', error));

// ============================================
// Приклад 7: Запит з кастомними заголовками
// ============================================

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'X-Custom-Header': 'custom-value'
    }
})
.then(response => response.json())
.then(data => console.log('Дані з заголовками:', data));

// ============================================
// Приклад 8: Запит з credentials (cookies)
// ============================================

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available', {
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

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available', {
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

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available', {
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

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available', {
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
        const response = await fetch('https://petstore.swagger.io/v2/pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': 'unique-id-123'
            },
            body: JSON.stringify({
                id: 0,
                name: 'Барсик',
                status: 'available',
                category: { id: 1, name: 'Коти' },
                photoUrls: ['https://example.com/cat.jpg']
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
const api = new ApiClient('https://petstore.swagger.io/v2', {
    'Content-Type': 'application/json'
});

api.get('/pet/findByStatus?status=available')
    .then(pets => console.log('Тварини:', pets));

api.post('/pet', { 
    id: 0,
    name: 'Барсик', 
    status: 'available',
    category: { id: 1, name: 'Коти' },
    photoUrls: ['https://example.com/cat.jpg']
})
    .then(pet => console.log('Створено:', pet));

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

