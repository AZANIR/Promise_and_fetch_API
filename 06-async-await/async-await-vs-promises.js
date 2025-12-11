/**
 * Порівняння async/await та Promise
 * 
 * Обидва підходи дозволяють працювати з асинхронним кодом,
 * але мають різні переваги та використання.
 */

// ============================================
// Приклад 1: Простий випадок - Promise
// ============================================

function fetchDataPromise() {
    return fetchUser(1)
        .then(user => {
            console.log('Користувач:', user);
            return fetchPosts(user.id);
        })
        .then(posts => {
            console.log('Пости:', posts);
            return posts;
        })
        .catch(error => {
            console.error('Помилка:', error.message);
        });
}

// ============================================
// Приклад 1: Простий випадок - async/await
// ============================================

async function fetchDataAsync() {
    try {
        const user = await fetchUser(1);
        console.log('Користувач:', user);
        
        const posts = await fetchPosts(user.id);
        console.log('Пости:', posts);
        
        return posts;
    } catch (error) {
        console.error('Помилка:', error.message);
    }
}

// Допоміжні функції
function fetchUser(id) {
    return Promise.resolve({ id, name: 'Олена' });
}

function fetchPosts(userId) {
    return Promise.resolve([{ id: 1, title: 'Пост 1' }]);
}

// ============================================
// Приклад 2: Обробка помилок - Promise
// ============================================

function handleErrorsPromise() {
    return operation1()
        .then(result1 => {
            return operation2(result1);
        })
        .then(result2 => {
            return operation3(result2);
        })
        .catch(error => {
            console.error('Помилка:', error.message);
            return 'Значення за замовчуванням';
        });
}

// ============================================
// Приклад 2: Обробка помилок - async/await
// ============================================

async function handleErrorsAsync() {
    try {
        const result1 = await operation1();
        const result2 = await operation2(result1);
        const result3 = await operation3(result2);
        return result3;
    } catch (error) {
        console.error('Помилка:', error.message);
        return 'Значення за замовчуванням';
    }
}

function operation1() {
    return Promise.resolve('Результат 1');
}

function operation2(data) {
    return Promise.resolve(`${data} -> Результат 2`);
}

function operation3(data) {
    return Promise.resolve(`${data} -> Результат 3`);
}

// ============================================
// Приклад 3: Паралельне виконання - Promise
// ============================================

function parallelPromise() {
    const promise1 = fetchUser(1);
    const promise2 = fetchPosts(1);
    const promise3 = fetchComments(1);
    
    return Promise.all([promise1, promise2, promise3])
        .then(([user, posts, comments]) => {
            return { user, posts, comments };
        });
}

// ============================================
// Приклад 3: Паралельне виконання - async/await
// ============================================

async function parallelAsync() {
    const promise1 = fetchUser(1);
    const promise2 = fetchPosts(1);
    const promise3 = fetchComments(1);
    
    const [user, posts, comments] = await Promise.all([
        promise1,
        promise2,
        promise3
    ]);
    
    return { user, posts, comments };
}

function fetchComments(userId) {
    return Promise.resolve([{ id: 1, text: 'Коментар 1' }]);
}

// ============================================
// Приклад 4: Умови та цикли - Promise
// ============================================

function conditionalPromise(condition) {
    return fetchData()
        .then(data => {
            if (condition) {
                return processData(data);
            } else {
                return skipProcessing(data);
            }
        });
}

// ============================================
// Приклад 4: Умови та цикли - async/await
// ============================================

async function conditionalAsync(condition) {
    const data = await fetchData();
    
    if (condition) {
        return await processData(data);
    } else {
        return await skipProcessing(data);
    }
}

function fetchData() {
    return Promise.resolve('Дані');
}

function processData(data) {
    return Promise.resolve(`Оброблено: ${data}`);
}

function skipProcessing(data) {
    return Promise.resolve(`Пропущено: ${data}`);
}

// ============================================
// Приклад 5: Цикли - Promise
// ============================================

function loopPromise(items) {
    let promise = Promise.resolve();
    
    items.forEach(item => {
        promise = promise.then(() => processItem(item));
    });
    
    return promise;
}

// ============================================
// Приклад 5: Цикли - async/await
// ============================================

async function loopAsync(items) {
    for (const item of items) {
        await processItem(item);
    }
}

function processItem(item) {
    return Promise.resolve(`Оброблено: ${item}`);
}

// ============================================
// Приклад 6: Комбінація обох підходів
// ============================================

// Використання Promise у async функції
async function combinedApproach() {
    // async/await для послідовних операцій
    const user = await fetchUser(1);
    
    // Promise.all() для паралельних операцій
    const [posts, comments] = await Promise.all([
        fetchPosts(user.id),
        fetchComments(user.id)
    ]);
    
    // Promise.race() для вибору найшвидшого
    const fastest = await Promise.race([
        fetchFromSource1(),
        fetchFromSource2()
    ]);
    
    return { user, posts, comments, fastest };
}

function fetchFromSource1() {
    return new Promise(resolve => {
        setTimeout(() => resolve('Джерело 1'), 200);
    });
}

function fetchFromSource2() {
    return new Promise(resolve => {
        setTimeout(() => resolve('Джерело 2'), 100);
    });
}

// ============================================
// Приклад 7: Коли використовувати Promise
// ============================================

/**
 * Promise краще для:
 * - Паралельного виконання (Promise.all, Promise.race)
 * - Простих ланцюжків операцій
 * - Коли не потрібна обробка помилок на кожному кроці
 */

function simpleChain() {
    return fetchData()
        .then(processData)
        .then(saveData)
        .catch(handleError);
}

function saveData(data) {
    return Promise.resolve(`Збережено: ${data}`);
}

function handleError(error) {
    console.error('Помилка:', error);
}

// ============================================
// Приклад 8: Коли використовувати async/await
// ============================================

/**
 * async/await краще для:
 * - Складних логічних операцій
 * - Обробки помилок на різних рівнях
 * - Умов та циклів
 * - Коли потрібна читабельність
 */

async function complexLogic() {
    try {
        const data = await fetchData();
        
        if (data.valid) {
            const processed = await processData(data);
            
            if (processed.success) {
                await saveData(processed);
            } else {
                await logError('Обробка не вдалася');
            }
        } else {
            await validateData(data);
        }
    } catch (error) {
        await handleError(error);
    }
}

function validateData(data) {
    return Promise.resolve('Валідація виконана');
}

function logError(message) {
    return Promise.resolve(`Помилка залогована: ${message}`);
}

// ============================================
// Висновок
// ============================================

/**
 * Порівняння:
 * 
 * Promise:
 * - Функціональний стиль
 * - Добре для ланцюжків
 * - Краще для паралельного виконання
 * - Менш читабельний для складних операцій
 * 
 * async/await:
 * - Імперативний стиль
 * - Краще для складних операцій
 * - Легша обробка помилок
 * - Більш читабельний код
 * - Краще для умов та циклів
 * 
 * Рекомендації:
 * - Використовуйте async/await для більшості випадків
 * - Використовуйте Promise.all/race для паралельного виконання
 * - Комбінуйте обидва підходи за потреби
 * - Обирайте підхід залежно від складності операції
 */

// Виклик функцій для демонстрації
console.log('=== Promise підхід ===');
fetchDataPromise();

console.log('\n=== async/await підхід ===');
fetchDataAsync();

