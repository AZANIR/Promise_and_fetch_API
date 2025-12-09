/**
 * Приклади тестування Fetch API з Mocha та Chai
 * 
 * Примітка: Для реальних тестів потрібен мок сервер або реальний API
 */

const { expect } = require('chai');

describe('Fetch API', () => {
    describe('Базові запити', () => {
        it('повинен виконати GET запит (з моком)', async () => {
            // У реальному тесті використовуйте мок сервер
            // Наприклад, nock або MSW
            
            // Симуляція для прикладу
            global.fetch = async (url) => {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ id: 1, name: 'Олена' })
                };
            };
            
            const response = await fetch('https://api.example.com/users');
            const data = await response.json();
            
            expect(response.ok).to.be.true;
            expect(data).to.have.property('id', 1);
            expect(data).to.have.property('name', 'Олена');
        });
        
        it('повинен обробити помилку HTTP', async () => {
            global.fetch = async () => {
                return {
                    ok: false,
                    status: 404,
                    statusText: 'Not Found'
                };
            };
            
            const response = await fetch('https://api.example.com/users');
            
            expect(response.ok).to.be.false;
            expect(response.status).to.equal(404);
        });
    });
    
    describe('POST запити', () => {
        it('повинен виконати POST запит', async () => {
            global.fetch = async (url, options) => {
                expect(options.method).to.equal('POST');
                expect(options.headers['Content-Type']).to.equal('application/json');
                
                return {
                    ok: true,
                    status: 201,
                    json: async () => ({ id: 1, ...JSON.parse(options.body) })
                };
            };
            
            const response = await fetch('https://api.example.com/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: 'Олена', email: 'olena@example.com' })
            });
            
            const data = await response.json();
            
            expect(response.ok).to.be.true;
            expect(data).to.have.property('name', 'Олена');
        });
    });
    
    describe('Обробка помилок', () => {
        it('повинен обробити помилку мережі', async () => {
            global.fetch = async () => {
                throw new TypeError('Failed to fetch');
            };
            
            try {
                await fetch('https://api.example.com/users');
                expect.fail('Повинна бути помилка');
            } catch (error) {
                expect(error).to.be.instanceOf(TypeError);
                expect(error.message).to.include('Failed to fetch');
            }
        });
    });
    
    describe('Утиліта для тестування', () => {
        it('повинен використати утиліту safeFetch', async () => {
            async function safeFetch(url, options = {}) {
                try {
                    const response = await fetch(url, options);
                    
                    if (!response.ok) {
                        return {
                            success: false,
                            error: `HTTP ${response.status}`,
                            data: null
                        };
                    }
                    
                    const data = await response.json();
                    return {
                        success: true,
                        error: null,
                        data
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message,
                        data: null
                    };
                }
            }
            
            global.fetch = async () => ({
                ok: true,
                json: async () => ({ id: 1, name: 'Олена' })
            });
            
            const result = await safeFetch('https://api.example.com/users');
            
            expect(result.success).to.be.true;
            expect(result.data).to.have.property('id', 1);
        });
    });
});

