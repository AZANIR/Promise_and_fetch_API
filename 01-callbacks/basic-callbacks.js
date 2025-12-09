/**
 * Базові приклади використання callback функцій
 * 
 * Callback функції - це функції, які передаються як аргументи іншим функціям
 * і викликаються у визначений момент, часто після завершення певної операції.
 */

// ============================================
// Приклад 1: Простий callback
// ============================================

/**
 * Функція, яка приймає callback та викликає його
 */
function greetUser(name, callback) {
    const greeting = `Привіт, ${name}!`;
    callback(greeting);
}

// Використання callback
greetUser('Олена', function(message) {
    console.log(message); // Привіт, Олена!
});

// Або зі стрілковою функцією
greetUser('Іван', (message) => {
    console.log(message); // Привіт, Іван!
});

// ============================================
// Приклад 2: Callback з обробкою даних
// ============================================

/**
 * Функція, яка обробляє масив та викликає callback для кожного елемента
 */
function processArray(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i));
    }
    return result;
}

const numbers = [1, 2, 3, 4, 5];

// Подвоїти кожне число
const doubled = processArray(numbers, (num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Квадрат кожного числа
const squared = processArray(numbers, (num) => num * num);
console.log(squared); // [1, 4, 9, 16, 25]

// ============================================
// Приклад 3: Асинхронний callback (симуляція)
// ============================================

/**
 * Симуляція асинхронної операції з callback
 */
function fetchUserData(userId, callback) {
    // Симуляція затримки мережевого запиту
    setTimeout(() => {
        const userData = {
            id: userId,
            name: 'Олена',
            email: 'olena@example.com'
        };
        callback(null, userData); // Перший параметр - помилка, другий - дані
    }, 1000);
}

// Використання
fetchUserData(1, (error, data) => {
    if (error) {
        console.error('Помилка:', error);
    } else {
        console.log('Дані користувача:', data);
    }
});

// ============================================
// Приклад 4: Callback у вбудованих методах масивів
// ============================================

const users = [
    { name: 'Олена', age: 25 },
    { name: 'Іван', age: 30 },
    { name: 'Марія', age: 28 }
];

// forEach - виконання дії для кожного елемента
users.forEach((user) => {
    console.log(`${user.name} - ${user.age} років`);
});

// map - перетворення масиву
const names = users.map((user) => user.name);
console.log(names); // ['Олена', 'Іван', 'Марія']

// filter - фільтрація масиву
const youngUsers = users.filter((user) => user.age < 30);
console.log(youngUsers); // [{ name: 'Олена', age: 25 }, { name: 'Марія', age: 28 }]

// find - пошук елемента
const user = users.find((user) => user.name === 'Іван');
console.log(user); // { name: 'Іван', age: 30 }

// ============================================
// Приклад 5: Callback з кількома параметрами
// ============================================

/**
 * Функція, яка виконує операцію та передає кілька результатів у callback
 */
function calculate(a, b, callback) {
    const sum = a + b;
    const product = a * b;
    const difference = a - b;
    
    callback(sum, product, difference);
}

calculate(10, 5, (sum, product, difference) => {
    console.log(`Сума: ${sum}`);        // Сума: 15
    console.log(`Добуток: ${product}`);  // Добуток: 50
    console.log(`Різниця: ${difference}`); // Різниця: 5
});

// ============================================
// Приклад 6: Callback у DOM подіях (для браузера)
// ============================================

/**
 * Приклад використання callback у обробниках подій
 * (Це працює тільки в браузері)
 */
/*
const button = document.getElementById('myButton');

button.addEventListener('click', function(event) {
    console.log('Кнопка натиснута!', event);
});

// Або зі стрілковою функцією
button.addEventListener('click', (event) => {
    console.log('Кнопка натиснута!', event);
});
*/

// ============================================
// Висновок
// ============================================

/**
 * Callback функції - це фундаментальна концепція JavaScript.
 * Вони дозволяють:
 * - Передавати функції як аргументи
 * - Створювати гнучкі та переповторно використовувані функції
 * - Обробляти асинхронні операції
 * - Працювати з подіями та обробниками
 * 
 * Однак, при глибокому вкладенні callbacks можуть призвести до
 * "callback hell" - проблеми читабельності коду.
 */

