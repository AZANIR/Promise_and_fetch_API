/**
 * Базові приклади використання Fetch API
 * 
 * Fetch API - це інтерфейс JavaScript для виконання мережевих запитів.
 * Він використовується для отримання ресурсів з мережі та обміну даними з сервером.
 */

// ============================================
// Приклад 1: Базовий GET запит
// ============================================

// fetch() повертає Promise
fetch('https://petstore.swagger.io/v2/pet/1')
    .then(response => {
        // response - це Response об'єкт
        console.log('Статус:', response.status);
        console.log('OK:', response.ok);
        return response.json(); // Парсинг JSON
    })
    .then(data => {
        console.log('Дані тварини:', data);
    })
    .catch(error => {
        console.error('Помилка:', error);
    });

// ============================================
// Приклад 2: Перевірка статусу відповіді
// ============================================

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP помилка! статус: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Доступні тварини:', data);
    })
    .catch(error => {
        console.error('Помилка:', error.message);
    });

// ============================================
// Приклад 3: Різні формати відповіді
// ============================================

// JSON - отримання тварини
fetch('https://petstore.swagger.io/v2/pet/1')
    .then(response => response.json())
    .then(data => console.log('JSON дані тварини:', data));

// Текст - отримання інвентаря (повертає JSON, але можна як текст)
fetch('https://petstore.swagger.io/v2/store/inventory')
    .then(response => response.text())
    .then(text => console.log('Текст відповіді:', text));

// Бінарні дані (Blob) - приклад з фото тварини (якщо API підтримує)
fetch('https://petstore.swagger.io/v2/pet/1')
    .then(response => response.json())
    .then(pet => {
        if (pet.photoUrls && pet.photoUrls.length > 0) {
            console.log('URL фото тварини:', pet.photoUrls[0]);
        }
    });

// ============================================
// Приклад 4: Обробка помилок мережі
// ============================================

fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Дані:', data);
    })
    .catch(error => {
        // Перехоплює помилки мережі та парсингу
        if (error instanceof TypeError) {
            console.error('Помилка мережі:', error.message);
        } else {
            console.error('Інша помилка:', error.message);
        }
    });

// ============================================
// Приклад 5: Використання з async/await
// ============================================

async function fetchData() {
    try {
        const response = await fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
        
        if (!response.ok) {
            throw new Error(`HTTP помилка! статус: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Дані тварин:', data);
        return data;
    } catch (error) {
        console.error('Помилка:', error.message);
        throw error;
    }
}

fetchData();

// ============================================
// Приклад 6: Отримання заголовків відповіді
// ============================================

fetch('https://petstore.swagger.io/v2/pet/1')
    .then(response => {
        // Отримання конкретного заголовка
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        // Перебір всіх заголовків
        response.headers.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        
        return response.json();
    })
    .then(data => {
        console.log('Дані тварини:', data);
    });

// ============================================
// Приклад 7: Перевірка типу контенту
// ============================================

async function fetchWithContentTypeCheck() {
    const response = await fetch('https://petstore.swagger.io/v2/store/inventory');
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('JSON дані інвентаря:', data);
    } else {
        const text = await response.text();
        console.log('Текст:', text);
    }
}

fetchWithContentTypeCheck();

// ============================================
// Приклад 8: Обробка різних статусів
// ============================================

async function handleDifferentStatuses() {
    const response = await fetch('https://petstore.swagger.io/v2/pet/999999'); // Неіснуючий ID
    
    switch (response.status) {
        case 200:
            const data = await response.json();
            console.log('Успіх:', data);
            break;
        case 404:
            console.error('Тварину не знайдено');
            break;
        case 500:
            console.error('Помилка сервера');
            break;
        default:
            console.error('Невідомий статус:', response.status);
    }
}

handleDifferentStatuses();

// ============================================
// Приклад 9: Використання AbortController для скасування
// ============================================

const controller = new AbortController();
const signal = controller.signal;

// Запуск запиту
const fetchPromise = fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available', { signal })
    .then(response => response.json())
    .then(data => console.log('Дані тварин:', data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Запит скасовано');
        } else {
            console.error('Помилка:', error);
        }
    });

// Скасування через 1 секунду
setTimeout(() => {
    controller.abort();
}, 1000);

// ============================================
// Приклад 10: Базовий запит з обробкою для тестування
// ============================================

/**
 * Утиліта для безпечного виконання fetch запитів
 */
async function safeFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        return {
            success: true,
            data,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

// Використання
safeFetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
    .then(result => {
        if (result.success) {
            console.log('Успіх:', result.data);
        } else {
            console.error('Помилка:', result.error);
        }
    });

// ============================================
// Висновок
// ============================================

/**
 * Fetch API:
 * - Повертає Promise
 * - Підтримує різні формати даних (JSON, текст, blob)
 * - Дозволяє обробляти помилки
 * - Підтримує AbortController для скасування
 * - Можна використовувати з async/await
 * 
 * Основні методи Response:
 * - response.json() - парсинг JSON
 * - response.text() - отримання тексту
 * - response.blob() - отримання бінарних даних
 * - response.arrayBuffer() - отримання ArrayBuffer
 * 
 * Важливо:
 * - Завжди перевіряйте response.ok
 * - Обробляйте помилки мережі
 * - Перевіряйте тип контенту перед парсингом
 * - Використовуйте try-catch з async/await
 */

