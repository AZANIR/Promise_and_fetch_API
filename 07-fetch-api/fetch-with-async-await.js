/**
 * Комбінація Fetch API з async/await
 * 
 * async/await робить роботу з Fetch API більш читабельною та зручною.
 */

// ============================================
// Приклад 1: Базовий async/await з fetch
// ============================================

async function fetchPets() {
    try {
        const response = await fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
        const pets = await response.json();
        console.log('Тварини:', pets);
        return pets;
    } catch (error) {
        console.error('Помилка:', error);
        throw error;
    }
}

fetchPets();

// ============================================
// Приклад 2: Послідовні запити
// ============================================

async function fetchPetData(petId) {
    try {
        // Спочатку отримуємо тварину
        const petResponse = await fetch(`https://petstore.swagger.io/v2/pet/${petId}`);
        if (!petResponse.ok) {
            throw new Error(`HTTP ${petResponse.status}: ${petResponse.statusText}`);
        }
        const pet = await petResponse.json();
        
        // Потім отримуємо інвентар магазину
        const inventoryResponse = await fetch('https://petstore.swagger.io/v2/store/inventory');
        if (!inventoryResponse.ok) {
            throw new Error(`HTTP ${inventoryResponse.status}: ${inventoryResponse.statusText}`);
        }
        const inventory = await inventoryResponse.json();
        
        // Потім отримуємо тварин за статусом
        const petsByStatusResponse = await fetch(`https://petstore.swagger.io/v2/pet/findByStatus?status=${pet.status || 'available'}`);
        if (!petsByStatusResponse.ok) {
            throw new Error(`HTTP ${petsByStatusResponse.status}: ${petsByStatusResponse.statusText}`);
        }
        const petsByStatus = await petsByStatusResponse.json();
        
        return { pet, inventory, petsByStatus };
    } catch (error) {
        console.error('Помилка завантаження даних:', error.message);
        throw error;
    }
}

fetchPetData(1)
    .then(data => console.log('Всі дані:', data))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 3: Паралельні запити з Promise.all()
// ============================================

async function fetchPetDataParallel(petId) {
    try {
        // Всі запити виконуються одночасно
        const [petResponse, inventoryResponse, availablePetsResponse] = await Promise.all([
            fetch(`https://petstore.swagger.io/v2/pet/${petId}`),
            fetch('https://petstore.swagger.io/v2/store/inventory'),
            fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
        ]);
        
        // Перевірка статусів
        if (!petResponse.ok || !inventoryResponse.ok || !availablePetsResponse.ok) {
            throw new Error('Один або кілька запитів не вдалися');
        }
        
        // Парсинг всіх відповідей
        const [pet, inventory, availablePets] = await Promise.all([
            petResponse.json(),
            inventoryResponse.json(),
            availablePetsResponse.json()
        ]);
        
        return { pet, inventory, availablePets };
    } catch (error) {
        console.error('Помилка:', error.message);
        throw error;
    }
}

fetchPetDataParallel(1)
    .then(data => console.log('Всі дані (паралельно):', data))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 4: POST запит з async/await
// ============================================

async function createPet(petData) {
    try {
        const response = await fetch('https://petstore.swagger.io/v2/pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(petData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const newPet = await response.json();
        console.log('Тварину створено:', newPet);
        return newPet;
    } catch (error) {
        console.error('Помилка створення тварини:', error.message);
        throw error;
    }
}

createPet({ 
    id: 0,
    name: 'Барсик',
    status: 'available',
    category: { id: 1, name: 'Коти' },
    photoUrls: ['https://example.com/cat.jpg']
})
    .then(pet => console.log('Результат:', pet))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 5: PUT запит з async/await
// ============================================

async function updatePet(petId, petData) {
    try {
        const response = await fetch(`https://petstore.swagger.io/v2/pet`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...petData, id: petId })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const updatedPet = await response.json();
        console.log('Тварину оновлено:', updatedPet);
        return updatedPet;
    } catch (error) {
        console.error('Помилка оновлення:', error.message);
        throw error;
    }
}

updatePet(1, { 
    name: 'Барсик Оновлений', 
    status: 'sold',
    category: { id: 1, name: 'Коти' },
    photoUrls: ['https://example.com/cat-updated.jpg']
})
    .then(pet => console.log('Оновлено:', pet))
    .catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 6: DELETE запит з async/await
// ============================================

async function deletePet(petId) {
    try {
        const response = await fetch(`https://petstore.swagger.io/v2/pet/${petId}`, {
            method: 'DELETE',
            headers: {
                'api_key': 'special-key' // Petstore API вимагає api_key для DELETE
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('Тварину видалено');
        return true;
    } catch (error) {
        console.error('Помилка видалення:', error.message);
        throw error;
    }
}

deletePet(1)
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

fetchWithDetailedErrorHandling('https://petstore.swagger.io/v2/pet/findByStatus?status=available')
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
const api = new ApiClient('https://petstore.swagger.io/v2', {
    'Content-Type': 'application/json'
});

async function useApiClient() {
    try {
        const pets = await api.get('/pet/findByStatus?status=available');
        console.log('Тварини:', pets);
        
        const newPet = await api.post('/pet', {
            id: 0,
            name: 'Мурзик',
            status: 'available',
            category: { id: 1, name: 'Коти' },
            photoUrls: ['https://example.com/cat.jpg']
        });
        console.log('Створено:', newPet);
        
        const updatedPet = await api.put('/pet', {
            ...newPet,
            name: 'Мурзик Оновлений',
            status: 'sold'
        });
        console.log('Оновлено:', updatedPet);
        
        await api.delete(`/pet/${updatedPet.id}`, {
            headers: { 'api_key': 'special-key' }
        });
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

