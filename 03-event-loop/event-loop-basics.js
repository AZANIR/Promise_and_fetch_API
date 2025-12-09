/**
 * Демонстрація роботи Event Loop в JavaScript
 * 
 * Event Loop - це механізм, що дозволяє JavaScript обробляти асинхронний код та події.
 * Він використовує Call Stack для виконання функцій та Callback Queue для обробки подій.
 */

// ============================================
// Приклад 1: Базове розуміння порядку виконання
// ============================================

console.log('1. Синхронний код - початок');

setTimeout(() => {
    console.log('4. setTimeout callback');
}, 0);

console.log('2. Синхронний код - після setTimeout');

Promise.resolve().then(() => {
    console.log('3. Promise microtask');
});

console.log('5. Синхронний код - кінець');

// Порядок виконання:
// 1. Синхронний код - початок
// 2. Синхронний код - після setTimeout
// 5. Синхронний код - кінець
// 3. Promise microtask (виконується перед setTimeout)
// 4. setTimeout callback

// ============================================
// Приклад 2: Call Stack (Стек викликів)
// ============================================

function first() {
    console.log('first: початок');
    second();
    console.log('first: кінець');
}

function second() {
    console.log('second: початок');
    third();
    console.log('second: кінець');
}

function third() {
    console.log('third: виконання');
}

console.log('Початок викликів');
first();
console.log('Кінець викликів');

// Call Stack працює як LIFO (Last In, First Out):
// 1. first() додається в стек
// 2. second() додається в стек
// 3. third() додається в стек
// 4. third() виконується та видаляється
// 5. second() завершується та видаляється
// 6. first() завершується та видаляється

// ============================================
// Приклад 3: Callback Queue (Черга зворотних викликів)
// ============================================

console.log('=== Приклад 3: Callback Queue ===');

console.log('1. Синхронний код');

setTimeout(() => {
    console.log('4. Callback 1 (setTimeout 0)');
}, 0);

setTimeout(() => {
    console.log('5. Callback 2 (setTimeout 0)');
}, 0);

setTimeout(() => {
    console.log('6. Callback 3 (setTimeout 100)');
}, 100);

console.log('2. Синхронний код');

// Microtasks виконуються перед macrotasks
Promise.resolve().then(() => {
    console.log('3. Microtask (Promise)');
});

console.log('7. Синхронний код - кінець');

// ============================================
// Приклад 4: Різниця між синхронним та асинхронним кодом
// ============================================

console.log('=== Приклад 4: Синхронний vs Асинхронний ===');

// Синхронний код - блокує виконання
function syncOperation() {
    const start = Date.now();
    while (Date.now() - start < 1000) {
        // Блокує виконання на 1 секунду
    }
    console.log('Синхронна операція завершена');
}

console.log('До синхронної операції');
syncOperation();
console.log('Після синхронної операції');

// Асинхронний код - не блокує виконання
console.log('До асинхронної операції');
setTimeout(() => {
    console.log('Асинхронна операція завершена');
}, 1000);
console.log('Після асинхронної операції (виконається одразу)');

// ============================================
// Приклад 5: Блокування Event Loop
// ============================================

console.log('=== Приклад 5: Блокування Event Loop ===');

// Це блокує Event Loop - погана практика!
function blockingOperation() {
    const start = Date.now();
    while (Date.now() - start < 2000) {
        // Блокує Event Loop на 2 секунди
    }
}

console.log('Початок');

setTimeout(() => {
    console.log('Це виконається з затримкою через блокування');
}, 0);

blockingOperation(); // Блокує виконання

console.log('Кінець');

// ============================================
// Приклад 6: Правильне використання асинхронності
// ============================================

console.log('=== Приклад 6: Правильна асинхронність ===');

// Замість блокування, використовуємо setTimeout
function nonBlockingOperation(callback) {
    setTimeout(() => {
        callback('Операція завершена');
    }, 2000);
}

console.log('Початок');

nonBlockingOperation((result) => {
    console.log(result);
});

console.log('Кінець (виконається одразу)');

// ============================================
// Приклад 7: Вкладені виклики та Event Loop
// ============================================

console.log('=== Приклад 7: Вкладені виклики ===');

setTimeout(() => {
    console.log('Зовнішній setTimeout');
    
    setTimeout(() => {
        console.log('Внутрішній setTimeout 1');
    }, 0);
    
    setTimeout(() => {
        console.log('Внутрішній setTimeout 2');
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('Promise всередині setTimeout');
    });
}, 0);

Promise.resolve().then(() => {
    console.log('Зовнішній Promise');
    
    setTimeout(() => {
        console.log('setTimeout всередині Promise');
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('Внутрішній Promise');
    });
});

console.log('Синхронний код');

// ============================================
// Приклад 8: Порядок виконання: синхронний код, microtasks, macrotasks
// ============================================

console.log('=== Приклад 8: Порядок виконання ===');

console.log('1. Синхронний код');

// Macrotask
setTimeout(() => {
    console.log('6. Macrotask: setTimeout');
}, 0);

// Macrotask
setImmediate(() => {
    console.log('7. Macrotask: setImmediate (Node.js)');
});

// Microtask
Promise.resolve().then(() => {
    console.log('3. Microtask: Promise.then');
});

// Microtask
queueMicrotask(() => {
    console.log('4. Microtask: queueMicrotask');
});

// Microtask
Promise.resolve().then(() => {
    console.log('5. Microtask: Promise.then 2');
});

console.log('2. Синхронний код - кінець');

// Порядок:
// 1. Весь синхронний код
// 2. Всі microtasks (Promise, queueMicrotask)
// 3. Всі macrotasks (setTimeout, setImmediate)

// ============================================
// Приклад 9: Симуляція Event Loop для розуміння
// ============================================

/**
 * Спрощена модель Event Loop
 */
class SimpleEventLoop {
    constructor() {
        this.callStack = [];
        this.microtaskQueue = [];
        this.macrotaskQueue = [];
    }
    
    // Додавання синхронної функції
    executeSync(fn) {
        this.callStack.push(fn);
        fn();
        this.callStack.pop();
    }
    
    // Додавання microtask
    addMicrotask(fn) {
        this.microtaskQueue.push(fn);
    }
    
    // Додавання macrotask
    addMacrotask(fn) {
        this.macrotaskQueue.push(fn);
    }
    
    // Обробка черг
    processQueues() {
        // Спочатку всі microtasks
        while (this.microtaskQueue.length > 0) {
            const task = this.microtaskQueue.shift();
            this.executeSync(task);
        }
        
        // Потім один macrotask
        if (this.macrotaskQueue.length > 0) {
            const task = this.macrotaskQueue.shift();
            this.executeSync(task);
        }
    }
    
    // Запуск циклу
    run() {
        while (this.macrotaskQueue.length > 0 || this.microtaskQueue.length > 0) {
            this.processQueues();
        }
    }
}

// ============================================
// Висновок
// ============================================

/**
 * Event Loop працює за такими правилами:
 * 
 * 1. Виконується весь синхронний код зі стеку
 * 2. Виконуються всі microtasks (Promise, queueMicrotask)
 * 3. Виконується один macrotask (setTimeout, setInterval)
 * 4. Повторюється з кроку 2
 * 
 * Важливо:
 * - Microtasks мають пріоритет над macrotasks
 * - Довгий синхронний код блокує Event Loop
 * - Використовуйте асинхронні операції для важких обчислень
 * - Розуміння Event Loop допомагає писати ефективний код
 */

