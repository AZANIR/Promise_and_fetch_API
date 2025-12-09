/**
 * Базові async функції в JavaScript
 * 
 * async функції - це функції, які автоматично повертають Promise.
 * Вони дозволяють писати асинхронний код у синхронному стилі.
 */

// ============================================
// Приклад 1: Базова async функція
// ============================================

async function basicAsync() {
    return 'Результат async функції';
}

// async функція завжди повертає Promise
basicAsync().then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 2: async функція з await
// ============================================

async function fetchData() {
    const data = await Promise.resolve('Дані отримано');
    console.log('Дані:', data);
    return data;
}

fetchData();

// ============================================
// Приклад 3: async функція з асинхронною операцією
// ============================================

async function delayedOperation() {
    const result = await new Promise(resolve => {
        setTimeout(() => resolve('Операція завершена'), 1000);
    });
    console.log('Результат:', result);
    return result;
}

delayedOperation();

// ============================================
// Приклад 4: async функція з кількома await
// ============================================

async function multipleOperations() {
    const result1 = await Promise.resolve('Результат 1');
    console.log('Крок 1:', result1);
    
    const result2 = await Promise.resolve('Результат 2');
    console.log('Крок 2:', result2);
    
    const result3 = await Promise.resolve('Результат 3');
    console.log('Крок 3:', result3);
    
    return [result1, result2, result3];
}

multipleOperations().then(results => {
    console.log('Всі результати:', results);
});

// ============================================
// Приклад 5: async функція як метод класу
// ============================================

class DataService {
    async fetchUser(id) {
        return new Promise(resolve => {
            setTimeout(() => resolve({ id, name: 'Олена' }), 500);
        });
    }
    
    async fetchPosts(userId) {
        return new Promise(resolve => {
            setTimeout(() => resolve([{ id: 1, title: 'Пост 1' }]), 300);
        });
    }
    
    async getUserData(id) {
        const user = await this.fetchUser(id);
        const posts = await this.fetchPosts(id);
        return { user, posts };
    }
}

const service = new DataService();
service.getUserData(1).then(data => {
    console.log('Дані користувача:', data);
});

// ============================================
// Приклад 6: async функція зі стрілковим синтаксисом
// ============================================

const asyncArrow = async () => {
    const result = await Promise.resolve('Стрілкова async функція');
    return result;
};

asyncArrow().then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 7: async функція з обробкою помилок
// ============================================

async function operationWithError() {
    try {
        const result = await Promise.reject(new Error('Помилка виконання'));
        return result;
    } catch (error) {
        console.error('Помилка перехоплена:', error.message);
        return 'Значення за замовчуванням';
    }
}

operationWithError().then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 8: async функція з поверненням різних типів
// ============================================

async function returnDifferentTypes() {
    // Повертаємо значення напряму
    const value1 = await Promise.resolve(42);
    
    // Повертаємо об'єкт
    const value2 = await Promise.resolve({ name: 'Олена' });
    
    // Повертаємо масив
    const value3 = await Promise.resolve([1, 2, 3]);
    
    return { value1, value2, value3 };
}

returnDifferentTypes().then(result => {
    console.log('Результати:', result);
});

// ============================================
// Приклад 9: Послідовне виконання з async/await
// ============================================

async function sequentialExecution() {
    console.log('Початок');
    
    const step1 = await new Promise(resolve => {
        setTimeout(() => resolve('Крок 1'), 500);
    });
    console.log(step1);
    
    const step2 = await new Promise(resolve => {
        setTimeout(() => resolve('Крок 2'), 300);
    });
    console.log(step2);
    
    const step3 = await new Promise(resolve => {
        setTimeout(() => resolve('Крок 3'), 200);
    });
    console.log(step3);
    
    console.log('Кінець');
    return 'Всі кроки завершено';
}

sequentialExecution();

// ============================================
// Приклад 10: async функція з умовами
// ============================================

async function conditionalAsync(condition) {
    if (condition) {
        const result = await Promise.resolve('Умова виконана');
        return result;
    } else {
        return 'Умова не виконана';
    }
}

conditionalAsync(true).then(result => {
    console.log('Результат:', result);
});

// ============================================
// Приклад 11: Виклик async функції з іншої async функції
// ============================================

async function innerAsync() {
    return await Promise.resolve('Внутрішня функція');
}

async function outerAsync() {
    const result = await innerAsync();
    console.log('Результат внутрішньої функції:', result);
    return 'Зовнішня функція завершена';
}

outerAsync().then(result => {
    console.log('Результат:', result);
});

// ============================================
// Висновок
// ============================================

/**
 * async функції:
 * - Автоматично повертають Promise
 * - Дозволяють використовувати await
 * - Спрощують написання асинхронного коду
 * - Підтримують try-catch для обробки помилок
 * - Можуть бути функціями, методами, стрілковими функціями
 * 
 * Переваги:
 * - Читабельніший код
 * - Легша обробка помилок
 * - Синхронний стиль написання
 * - Краща підтримка в IDE
 * 
 * Важливо:
 * - await можна використовувати тільки в async функціях
 * - async функція завжди повертає Promise
 * - Використання await блокує виконання функції (але не Event Loop)
 */

