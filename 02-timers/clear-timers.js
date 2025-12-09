/**
 * Приклади очищення таймерів (clearTimeout та clearInterval)
 * 
 * Важливо правильно очищати таймери, щоб уникнути витоку пам'яті
 * та небажаних виконань функцій.
 */

// ============================================
// Приклад 1: Очищення setTimeout
// ============================================

console.log('Встановлюємо таймер на 5 секунд');

const timeoutId = setTimeout(() => {
    console.log('Це не повинно виконатися');
}, 5000);

// Очищаємо таймер через 2 секунди
setTimeout(() => {
    clearTimeout(timeoutId);
    console.log('Таймер очищено, функція не виконається');
}, 2000);

// ============================================
// Приклад 2: Очищення setInterval
// ============================================

let counter = 0;

const intervalId = setInterval(() => {
    counter++;
    console.log(`Лічильник: ${counter}`);
    
    // Автоматичне очищення після 5 ітерацій
    if (counter >= 5) {
        clearInterval(intervalId);
        console.log('Інтервал очищено');
    }
}, 1000);

// ============================================
// Приклад 3: Очищення в умовах
// ============================================

class TimerManager {
    constructor() {
        this.timers = new Set();
    }
    
    setTimeout(callback, delay) {
        const id = setTimeout(() => {
            this.timers.delete(id);
            callback();
        }, delay);
        this.timers.add(id);
        return id;
    }
    
    setInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.timers.add(id);
        return id;
    }
    
    clearTimeout(id) {
        if (this.timers.has(id)) {
            clearTimeout(id);
            this.timers.delete(id);
            console.log(`Таймер ${id} очищено`);
        }
    }
    
    clearInterval(id) {
        if (this.timers.has(id)) {
            clearInterval(id);
            this.timers.delete(id);
            console.log(`Інтервал ${id} очищено`);
        }
    }
    
    clearAll() {
        console.log(`Очищення ${this.timers.size} таймерів`);
        this.timers.forEach(id => {
            clearTimeout(id);
            clearInterval(id);
        });
        this.timers.clear();
    }
    
    getActiveTimersCount() {
        return this.timers.size;
    }
}

// Використання
const manager = new TimerManager();

const timer1 = manager.setTimeout(() => {
    console.log('Таймер 1');
}, 2000);

const timer2 = manager.setTimeout(() => {
    console.log('Таймер 2');
}, 3000);

const interval1 = manager.setInterval(() => {
    console.log('Інтервал 1');
}, 1000);

console.log('Активних таймерів:', manager.getActiveTimersCount());

// Очистити один таймер
setTimeout(() => {
    manager.clearTimeout(timer1);
    console.log('Активних таймерів:', manager.getActiveTimersCount());
}, 1000);

// Очистити всі через 4 секунди
setTimeout(() => {
    manager.clearAll();
    console.log('Всі таймери очищено');
}, 4000);

// ============================================
// Приклад 4: Очищення при зміні стану
// ============================================

class Component {
    constructor() {
        this.updateTimer = null;
        this.isActive = true;
    }
    
    startAutoUpdate() {
        this.updateTimer = setInterval(() => {
            if (this.isActive) {
                this.update();
            }
        }, 1000);
    }
    
    update() {
        console.log('Компонент оновлено');
    }
    
    stop() {
        this.isActive = false;
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
            console.log('Автооновлення зупинено');
        }
    }
    
    destroy() {
        this.stop();
        // Очищення інших ресурсів
    }
}

// Використання
const component = new Component();
component.startAutoUpdate();

// Зупинити через 5 секунд
setTimeout(() => {
    component.destroy();
}, 5000);

// ============================================
// Приклад 5: Очищення при помилках
// ============================================

function riskyOperation(onSuccess, onError, timeout = 5000) {
    const timeoutId = setTimeout(() => {
        onError(new Error('Операція перевищила час очікування'));
    }, timeout);
    
    // Симуляція операції
    const operationId = setTimeout(() => {
        clearTimeout(timeoutId); // Очищаємо таймаут при успіху
        onSuccess('Операція завершена');
    }, 2000);
    
    // Повертаємо функцію для ручного очищення
    return () => {
        clearTimeout(timeoutId);
        clearTimeout(operationId);
    };
}

// Використання
const cleanup = riskyOperation(
    (result) => {
        console.log('Успіх:', result);
    },
    (error) => {
        console.error('Помилка:', error.message);
    }
);

// Можна очистити вручну
// cleanup();

// ============================================
// Приклад 6: Очищення в async функціях
// ============================================

async function asyncOperationWithTimeout(operation, timeout) {
    let timeoutId;
    
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error('Таймаут'));
        }, timeout);
    });
    
    try {
        const result = await Promise.race([
            operation(),
            timeoutPromise
        ]);
        
        clearTimeout(timeoutId);
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Використання
asyncOperationWithTimeout(
    () => new Promise(resolve => setTimeout(() => resolve('Готово'), 2000)),
    5000
)
.then(result => console.log('Результат:', result))
.catch(error => console.error('Помилка:', error.message));

// ============================================
// Приклад 7: Очищення в тестах
// ============================================

/**
 * Утиліта для тестів з автоматичним очищенням
 */
class TestTimer {
    constructor() {
        this.timers = [];
    }
    
    setTimeout(callback, delay) {
        const id = setTimeout(callback, delay);
        this.timers.push({ type: 'timeout', id });
        return id;
    }
    
    setInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.timers.push({ type: 'interval', id });
        return id;
    }
    
    cleanup() {
        this.timers.forEach(({ type, id }) => {
            if (type === 'timeout') {
                clearTimeout(id);
            } else {
                clearInterval(id);
            }
        });
        this.timers = [];
        console.log('Всі тестові таймери очищено');
    }
}

// Використання в тестах
function testExample() {
    const testTimer = new TestTimer();
    
    testTimer.setTimeout(() => {
        console.log('Тестовий таймер 1');
    }, 1000);
    
    testTimer.setInterval(() => {
        console.log('Тестовий інтервал');
    }, 500);
    
    // В кінці тесту
    setTimeout(() => {
        testTimer.cleanup();
    }, 3000);
}

testExample();

// ============================================
// Приклад 8: Перевірка наявності таймера перед очищенням
// ============================================

function safeClearTimeout(id) {
    if (id !== null && id !== undefined) {
        clearTimeout(id);
        return true;
    }
    return false;
}

function safeClearInterval(id) {
    if (id !== null && id !== undefined) {
        clearInterval(id);
        return true;
    }
    return false;
}

// Використання
let timerId = setTimeout(() => {
    console.log('Таймер виконано');
}, 1000);

// Безпечне очищення
if (safeClearTimeout(timerId)) {
    console.log('Таймер успішно очищено');
    timerId = null; // Важливо скинути посилання
}

// Повторне очищення не викличе помилку
safeClearTimeout(timerId);

// ============================================
// Висновок
// ============================================

/**
 * Правила роботи з очищенням таймерів:
 * 
 * 1. Завжди очищайте таймери, коли вони більше не потрібні
 * 2. Очищайте таймери при знищенні компонентів
 * 3. Очищайте таймери при помилках
 * 4. Зберігайте ID таймерів для можливості очищення
 * 5. Скидайте посилання на ID після очищення
 * 6. Використовуйте менеджери таймерів для складних сценаріїв
 * 7. В тестах завжди очищайте таймери після завершення
 * 
 * Це допомагає:
 * - Уникнути витоку пам'яті
 * - Уникнути небажаних виконань
 * - Покращити продуктивність
 * - Зробити код більш передбачуваним
 */

