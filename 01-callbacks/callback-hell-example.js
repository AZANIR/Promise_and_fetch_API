/**
 * Демонстрація проблеми "Callback Hell" (Пекло зворотних викликів)
 * 
 * Callback Hell виникає, коли ми маємо багато вкладених callback функцій,
 * що робить код важким для читання та підтримки.
 */

// ============================================
// Приклад 1: Класичний Callback Hell
// ============================================

/**
 * Симуляція послідовних асинхронних операцій
 */
function step1(callback) {
    setTimeout(() => callback(null, 'Результат кроку 1'), 100);
}

function step2(data, callback) {
    setTimeout(() => callback(null, `${data} -> Результат кроку 2`), 100);
}

function step3(data, callback) {
    setTimeout(() => callback(null, `${data} -> Результат кроку 3`), 100);
}

function step4(data, callback) {
    setTimeout(() => callback(null, `${data} -> Результат кроку 4`), 100);
}

// CALLBACK HELL - багато рівнів вкладеності
step1((error1, result1) => {
    if (error1) {
        console.error('Помилка на кроці 1:', error1);
        return;
    }
    
    step2(result1, (error2, result2) => {
        if (error2) {
            console.error('Помилка на кроці 2:', error2);
            return;
        }
        
        step3(result2, (error3, result3) => {
            if (error3) {
                console.error('Помилка на кроці 3:', error3);
                return;
            }
            
            step4(result3, (error4, result4) => {
                if (error4) {
                    console.error('Помилка на кроці 4:', error4);
                    return;
                }
                
                console.log('Фінальний результат:', result4);
                // Ще більше вкладеності...
            });
        });
    });
});

// ============================================
// Приклад 2: Реальний сценарій - автентифікація користувача
// ============================================

function validateUser(username, callback) {
    setTimeout(() => {
        if (!username) {
            callback(new Error('Ім\'я користувача обов\'язкове'), null);
        } else {
            callback(null, { username, valid: true });
        }
    }, 100);
}

function checkPassword(user, password, callback) {
    setTimeout(() => {
        if (password === 'correct') {
            callback(null, { ...user, authenticated: true });
        } else {
            callback(new Error('Невірний пароль'), null);
        }
    }, 100);
}

function getUserProfile(user, callback) {
    setTimeout(() => {
        callback(null, { ...user, profile: { name: 'Олена', age: 25 } });
    }, 100);
}

function loadUserSettings(user, callback) {
    setTimeout(() => {
        callback(null, { ...user, settings: { theme: 'dark' } });
    }, 100);
}

// CALLBACK HELL - реальний приклад
validateUser('olena', (error1, user1) => {
    if (error1) {
        console.error('Помилка валідації:', error1.message);
        return;
    }
    
    checkPassword(user1, 'correct', (error2, user2) => {
        if (error2) {
            console.error('Помилка автентифікації:', error2.message);
            return;
        }
        
        getUserProfile(user2, (error3, user3) => {
            if (error3) {
                console.error('Помилка завантаження профілю:', error3.message);
                return;
            }
            
            loadUserSettings(user3, (error4, user4) => {
                if (error4) {
                    console.error('Помилка завантаження налаштувань:', error4.message);
                    return;
                }
                
                console.log('Користувач успішно завантажений:', user4);
                // Код стає все глибше і глибше...
            });
        });
    });
});

// ============================================
// Приклад 3: Паралельні операції з callbacks (ще гірше)
// ============================================

function fetchUserData(userId, callback) {
    setTimeout(() => callback(null, { id: userId, name: 'Олена' }), 200);
}

function fetchUserPosts(userId, callback) {
    setTimeout(() => callback(null, [{ id: 1, title: 'Пост 1' }]), 150);
}

function fetchUserComments(userId, callback) {
    setTimeout(() => callback(null, [{ id: 1, text: 'Коментар 1' }]), 180);
}

// Складний callback hell з паралельними операціями
fetchUserData(1, (error1, user) => {
    if (error1) {
        console.error('Помилка:', error1);
        return;
    }
    
    let posts = null;
    let comments = null;
    let postsError = null;
    let commentsError = null;
    
    fetchUserPosts(user.id, (error2, userPosts) => {
        postsError = error2;
        posts = userPosts;
        
        if (posts && comments !== null) {
            // Обидва запити завершилися
            if (postsError || commentsError) {
                console.error('Помилки завантаження даних');
            } else {
                console.log('Всі дані завантажені:', { user, posts, comments });
            }
        }
    });
    
    fetchUserComments(user.id, (error3, userComments) => {
        commentsError = error3;
        comments = userComments;
        
        if (posts !== null && comments) {
            // Обидва запити завершилися
            if (postsError || commentsError) {
                console.error('Помилки завантаження даних');
            } else {
                console.log('Всі дані завантажені:', { user, posts, comments });
            }
        }
    });
});

// ============================================
// Рішення 1: Винесення функцій (часткове покращення)
// ============================================

// Винесення callback функцій у окремі функції
function handleStep1(error1, result1) {
    if (error1) {
        console.error('Помилка на кроці 1:', error1);
        return;
    }
    step2(result1, handleStep2);
}

function handleStep2(error2, result2) {
    if (error2) {
        console.error('Помилка на кроці 2:', error2);
        return;
    }
    step3(result2, handleStep3);
}

function handleStep3(error3, result3) {
    if (error3) {
        console.error('Помилка на кроці 3:', error3);
        return;
    }
    step4(result3, handleStep4);
}

function handleStep4(error4, result4) {
    if (error4) {
        console.error('Помилка на кроці 4:', error4);
        return;
    }
    console.log('Фінальний результат:', result4);
}

// Використання
step1(handleStep1);

// ============================================
// Рішення 2: Використання Promise (краще рішення)
// ============================================

/**
 * Той самий код, але з Promise (буде показано в наступних уроках)
 */
function step1Promise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('Результат кроку 1'), 100);
    });
}

function step2Promise(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(`${data} -> Результат кроку 2`), 100);
    });
}

// Без callback hell:
step1Promise()
    .then(step2Promise)
    .then(step3Promise)
    .then(step4Promise)
    .then(result => console.log('Результат:', result))
    .catch(error => console.error('Помилка:', error));

// Або з async/await (ще краще):
async function runSteps() {
    try {
        const result1 = await step1Promise();
        const result2 = await step2Promise(result1);
        const result3 = await step3Promise(result2);
        const result4 = await step4Promise(result3);
        console.log('Результат:', result4);
    } catch (error) {
        console.error('Помилка:', error);
    }
}

// ============================================
// Висновок
// ============================================

/**
 * Проблеми Callback Hell:
 * 1. Важко читати код (багато вкладеності)
 * 2. Важко підтримувати та дебажити
 * 3. Складно обробляти помилки
 * 4. Складно організувати паралельне виконання
 * 
 * Рішення:
 * 1. Винесення функцій (часткове покращення)
 * 2. Використання Promise (краще)
 * 3. Використання async/await (найкраще)
 * 4. Використання бібліотек (async.js, bluebird)
 * 
 * У наступних уроках ми вивчимо Promise та async/await,
 * які вирішують ці проблеми елегантно.
 */

