/**
 * Різниця між мікротасками (microtasks) та макротасками (macrotasks)
 * 
 * Microtasks виконуються ПЕРЕД macrotasks в Event Loop.
 * Це критично важливо для розуміння порядку виконання асинхронного коду.
 */

// ============================================
// Приклад 1: Базове розуміння пріоритетів
// ============================================

console.log('=== Приклад 1: Пріоритети ===');

console.log('1. Синхронний код');

// Macrotask
setTimeout(() => {
    console.log('5. Macrotask: setTimeout');
}, 0);

// Microtask
Promise.resolve().then(() => {
    console.log('3. Microtask: Promise');
});

// Microtask
queueMicrotask(() => {
    console.log('4. Microtask: queueMicrotask');
});

console.log('2. Синхронний код - кінець');

// Порядок: синхронний код → microtasks → macrotasks

// ============================================
// Приклад 2: Microtasks всередині macrotasks
// ============================================

console.log('=== Приклад 2: Вкладеність ===');

setTimeout(() => {
    console.log('Macrotask 1: початок');
    
    Promise.resolve().then(() => {
        console.log('Microtask всередині Macrotask 1');
    });
    
    console.log('Macrotask 1: кінець');
}, 0);

setTimeout(() => {
    console.log('Macrotask 2');
}, 0);

Promise.resolve().then(() => {
    console.log('Microtask перед Macrotasks');
});

// Порядок:
// 1. Microtask перед Macrotasks
// 2. Macrotask 1: початок
// 3. Macrotask 1: кінець
// 4. Microtask всередині Macrotask 1 (виконується одразу!)
// 5. Macrotask 2

// ============================================
// Приклад 3: Типи Microtasks
// ============================================

console.log('=== Приклад 3: Типи Microtasks ===');

// 1. Promise.then/catch/finally
Promise.resolve('Promise 1').then(console.log);

// 2. queueMicrotask
queueMicrotask(() => {
    console.log('queueMicrotask');
});

// 3. MutationObserver (браузер)
// 4. process.nextTick (Node.js)

Promise.resolve('Promise 2').then(console.log);

// Всі microtasks виконуються в порядку додавання

// ============================================
// Приклад 4: Типи Macrotasks
// ============================================

console.log('=== Приклад 4: Типи Macrotasks ===');

// 1. setTimeout
setTimeout(() => console.log('setTimeout'), 0);

// 2. setInterval
setInterval(() => {
    console.log('setInterval');
    // clearInterval потрібен для зупинки
}, 1000);

// 3. setImmediate (Node.js)
if (typeof setImmediate !== 'undefined') {
    setImmediate(() => console.log('setImmediate'));
}

// 4. I/O операції
// 5. UI рендеринг (браузер)

// ============================================
// Приклад 5: Проблема з нескінченними microtasks
// ============================================

console.log('=== Приклад 5: Блокування microtasks ===');

/**
 * УВАГА: Це може заблокувати Event Loop!
 * Не робіть так у реальному коді!
 */
function infiniteMicrotasks() {
    Promise.resolve().then(() => {
        console.log('Microtask виконано');
        infiniteMicrotasks(); // Рекурсія!
    });
}

// Розкоментуйте для демонстрації (заблокує виконання!)
// infiniteMicrotasks();

// Macrotask ніколи не виконається, бо microtasks завжди мають пріоритет
setTimeout(() => {
    console.log('Це ніколи не виконається, якщо infiniteMicrotasks активна');
}, 0);

// ============================================
// Приклад 6: Правильне використання для оновлення UI
// ============================================

console.log('=== Приклад 6: Оновлення UI ===');

/**
 * Microtasks ідеальні для оновлення стану перед рендерингом
 */
let state = { count: 0 };

function updateState() {
    // Використовуємо microtask для оновлення перед рендерингом
    Promise.resolve().then(() => {
        state.count++;
        console.log('Стан оновлено:', state.count);
        // Тут би було оновлення DOM
    });
}

updateState();
updateState();
updateState();

// Всі оновлення відбудуться перед наступним macrotask

// ============================================
// Приклад 7: Порядок виконання складного прикладу
// ============================================

console.log('=== Приклад 7: Складний порядок ===');

console.log('1. Синхронний');

setTimeout(() => {
    console.log('8. setTimeout 1');
    
    Promise.resolve().then(() => {
        console.log('9. Promise в setTimeout 1');
    });
}, 0);

Promise.resolve().then(() => {
    console.log('3. Promise 1');
    
    setTimeout(() => {
        console.log('10. setTimeout в Promise 1');
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('4. Promise в Promise 1');
    });
});

setTimeout(() => {
    console.log('11. setTimeout 2');
}, 0);

Promise.resolve().then(() => {
    console.log('5. Promise 2');
});

queueMicrotask(() => {
    console.log('6. queueMicrotask');
});

console.log('2. Синхронний - кінець');

// Порядок:
// 1-2: Синхронний код
// 3-6: Всі microtasks (Promise, queueMicrotask)
// 7: (порожньо)
// 8-11: Macrotasks (setTimeout)

// ============================================
// Приклад 8: Використання в тестах
// ============================================

/**
 * Розуміння microtasks важливе для тестування
 */
async function testMicrotasks() {
    let result = [];
    
    // Додаємо microtask
    Promise.resolve().then(() => {
        result.push('microtask');
    });
    
    // Додаємо macrotask
    setTimeout(() => {
        result.push('macrotask');
    }, 0);
    
    // Очікуємо виконання всіх microtasks
    await Promise.resolve();
    
    console.log('Після await:', result); // ['microtask']
    
    // Очікуємо виконання macrotask
    await new Promise(resolve => setTimeout(resolve, 10));
    
    console.log('Після setTimeout:', result); // ['microtask', 'macrotask']
}

testMicrotasks();

// ============================================
// Приклад 9: Оптимізація з microtasks
// ============================================

/**
 * Використання microtasks для батчингу операцій
 */
class BatchedUpdates {
    constructor() {
        this.updates = [];
        this.scheduled = false;
    }
    
    addUpdate(update) {
        this.updates.push(update);
        
        if (!this.scheduled) {
            this.scheduled = true;
            
            // Використовуємо microtask для батчингу
            queueMicrotask(() => {
                this.flush();
            });
        }
    }
    
    flush() {
        const updates = [...this.updates];
        this.updates = [];
        this.scheduled = false;
        
        console.log('Батч оновлень:', updates);
        // Виконання всіх оновлень разом
    }
}

const batcher = new BatchedUpdates();

// Множинні оновлення будуть зібрані в один батч
batcher.addUpdate('update 1');
batcher.addUpdate('update 2');
batcher.addUpdate('update 3');

// ============================================
// Висновок
// ============================================

/**
 * Ключові відмінності:
 * 
 * Microtasks:
 * - Виконуються ПЕРЕД macrotasks
 * - Виконуються ВСІ перед переходом до macrotasks
 * - Приклади: Promise.then, queueMicrotask, MutationObserver
 * - Використовуються для оновлення стану перед рендерингом
 * 
 * Macrotasks:
 * - Виконуються ПІСЛЯ всіх microtasks
 * - Виконується ОДИН за раз
 * - Приклади: setTimeout, setInterval, I/O операції
 * - Використовуються для відкладених операцій
 * 
 * Порядок виконання:
 * 1. Синхронний код
 * 2. Всі microtasks
 * 3. Один macrotask
 * 4. Повернення до кроку 2
 * 
 * Це важливо для:
 * - Розуміння порядку виконання коду
 * - Написання правильних тестів
 * - Оптимізації продуктивності
 * - Уникнення блокування Event Loop
 */

