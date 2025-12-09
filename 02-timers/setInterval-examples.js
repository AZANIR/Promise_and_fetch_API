/**
 * Приклади використання setInterval
 * 
 * setInterval дозволяє виконувати функцію регулярно через певні інтервали.
 * Синтаксис: setInterval(callback, delay, ...args)
 */

// ============================================
// Приклад 1: Базове використання setInterval
// ============================================

console.log('Початок відліку');

let counter = 0;

// Виконання кожні 1 секунду
const intervalId = setInterval(() => {
    counter++;
    console.log(`Секунда ${counter}`);
    
    // Зупинка після 5 секунд
    if (counter >= 5) {
        clearInterval(intervalId);
        console.log('Відлік завершено');
    }
}, 1000);

// ============================================
// Приклад 2: Таймер зворотного відліку
// ============================================

function countdown(seconds, onComplete) {
    let remaining = seconds;
    
    console.log(`Початок відліку: ${remaining} секунд`);
    
    const intervalId = setInterval(() => {
        remaining--;
        console.log(`Залишилось: ${remaining} секунд`);
        
        if (remaining <= 0) {
            clearInterval(intervalId);
            console.log('Час вийшов!');
            if (onComplete) {
                onComplete();
            }
        }
    }, 1000);
    
    return intervalId;
}

// Використання
const countdownTimer = countdown(5, () => {
    console.log('Відлік завершено, виконуємо дію');
});

// ============================================
// Приклад 3: Оновлення UI (симуляція)
// ============================================

/**
 * Симуляція оновлення інтерфейсу
 */
class Clock {
    constructor() {
        this.time = new Date();
        this.intervalId = null;
    }
    
    start() {
        this.intervalId = setInterval(() => {
            this.time = new Date();
            this.updateDisplay();
        }, 1000);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    updateDisplay() {
        // Симуляція оновлення DOM
        console.log(`Час: ${this.time.toLocaleTimeString()}`);
    }
}

const clock = new Clock();
clock.start();

// Зупинити через 5 секунд
setTimeout(() => {
    clock.stop();
    console.log('Годинник зупинено');
}, 5000);

// ============================================
// Приклад 4: Перевірка статусу з інтервалом
// ============================================

/**
 * Перевірка статусу операції через інтервали
 */
function checkStatus(taskId, onComplete, maxAttempts = 10) {
    let attempts = 0;
    
    const intervalId = setInterval(() => {
        attempts++;
        
        // Симуляція перевірки статусу
        const status = Math.random() > 0.7 ? 'completed' : 'pending';
        
        console.log(`Спроба ${attempts}: статус = ${status}`);
        
        if (status === 'completed') {
            clearInterval(intervalId);
            onComplete(null, { taskId, status: 'completed' });
        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            onComplete(new Error('Перевищено максимальну кількість спроб'), null);
        }
    }, 1000);
    
    return intervalId;
}

// Використання
checkStatus('task-123', (error, result) => {
    if (error) {
        console.error('Помилка:', error.message);
    } else {
        console.log('Завдання завершено:', result);
    }
});

// ============================================
// Приклад 5: Збір метрик через інтервали
// ============================================

/**
 * Збір та виведення метрик продуктивності
 */
class MetricsCollector {
    constructor() {
        this.metrics = {
            requests: 0,
            errors: 0,
            startTime: Date.now()
        };
        this.intervalId = null;
    }
    
    recordRequest() {
        this.metrics.requests++;
    }
    
    recordError() {
        this.metrics.errors++;
    }
    
    startReporting(interval = 5000) {
        this.intervalId = setInterval(() => {
            const uptime = Math.floor((Date.now() - this.metrics.startTime) / 1000);
            const errorRate = this.metrics.requests > 0 
                ? (this.metrics.errors / this.metrics.requests * 100).toFixed(2)
                : 0;
            
            console.log('=== Метрики ===');
            console.log(`Час роботи: ${uptime}с`);
            console.log(`Запитів: ${this.metrics.requests}`);
            console.log(`Помилок: ${this.metrics.errors}`);
            console.log(`Відсоток помилок: ${errorRate}%`);
            console.log('==============');
        }, interval);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

// Використання
const collector = new MetricsCollector();

// Симуляція подій
setInterval(() => {
    collector.recordRequest();
    if (Math.random() > 0.8) {
        collector.recordError();
    }
}, 500);

collector.startReporting(3000);

// Зупинити через 15 секунд
setTimeout(() => {
    collector.stop();
    console.log('Збір метрик зупинено');
}, 15000);

// ============================================
// Приклад 6: Полінг (перевірка змін через інтервали)
// ============================================

/**
 * Полінг - перевірка змін на сервері через інтервали
 */
function pollForUpdates(url, interval = 2000, onUpdate) {
    let lastUpdate = null;
    
    const intervalId = setInterval(async () => {
        try {
            // Симуляція запиту
            const currentUpdate = {
                timestamp: Date.now(),
                data: `Оновлення ${Math.random()}`
            };
            
            if (!lastUpdate || currentUpdate.timestamp !== lastUpdate.timestamp) {
                console.log('Знайдено оновлення:', currentUpdate.data);
                if (onUpdate) {
                    onUpdate(currentUpdate);
                }
                lastUpdate = currentUpdate;
            } else {
                console.log('Оновлень немає');
            }
        } catch (error) {
            console.error('Помилка полінгу:', error);
        }
    }, interval);
    
    return intervalId;
}

// Використання
const pollingId = pollForUpdates('/api/updates', 2000, (update) => {
    console.log('Отримано оновлення:', update);
});

// Зупинити через 10 секунд
setTimeout(() => {
    clearInterval(pollingId);
    console.log('Полінг зупинено');
}, 10000);

// ============================================
// Приклад 7: Анімація (симуляція)
// ============================================

/**
 * Симуляція анімації через setInterval
 */
class Animation {
    constructor(element, duration = 1000, steps = 60) {
        this.element = element;
        this.duration = duration;
        this.steps = steps;
        this.interval = duration / steps;
        this.currentStep = 0;
        this.intervalId = null;
    }
    
    start(from, to, onComplete) {
        this.currentStep = 0;
        const stepValue = (to - from) / this.steps;
        
        this.intervalId = setInterval(() => {
            this.currentStep++;
            const currentValue = from + (stepValue * this.currentStep);
            
            // Симуляція оновлення позиції
            console.log(`Крок ${this.currentStep}: позиція = ${currentValue.toFixed(2)}`);
            
            if (this.currentStep >= this.steps) {
                this.stop();
                if (onComplete) {
                    onComplete();
                }
            }
        }, this.interval);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Використання
const animation = new Animation('element', 2000, 20);
animation.start(0, 100, () => {
    console.log('Анімація завершена');
});

// ============================================
// Приклад 8: Використання в тестах
// ============================================

/**
 * Очікування появи елемента в тестах
 */
function waitForElement(selector, timeout = 5000, interval = 100) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const intervalId = setInterval(() => {
            // Симуляція перевірки наявності елемента
            const elementExists = Math.random() > 0.7;
            
            if (elementExists) {
                clearInterval(intervalId);
                resolve({ selector, found: true });
            } else if (Date.now() - startTime >= timeout) {
                clearInterval(intervalId);
                reject(new Error(`Елемент ${selector} не знайдено за ${timeout}мс`));
            }
        }, interval);
    });
}

// Використання в тестах
waitForElement('#myButton', 5000)
    .then((result) => {
        console.log('Елемент знайдено:', result);
    })
    .catch((error) => {
        console.error('Помилка:', error.message);
    });

// ============================================
// Висновок
// ============================================

/**
 * setInterval корисний для:
 * - Регулярного оновлення UI
 * - Полінгу (перевірки змін)
 * - Таймерів та відліку
 * - Збору метрик
 * - Анімацій
 * - Очікування в тестах
 * 
 * Важливо:
 * - Завжди очищайте інтервали через clearInterval
 * - Не створюйте занадто багато інтервалів одночасно
 * - Використовуйте requestAnimationFrame для анімацій у браузері
 * - Для полінгу розгляньте WebSockets або Server-Sent Events
 */

