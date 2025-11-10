// Основная логика сайта с поиском
class ProductManager {
    constructor() {
        this.products = [
            {
                id: 1,
                name: 'iPhone 15 Pro',
                price: 999,
                image: 'img/iphone.webp',
                description: 'Новейший смартфон от Apple с революционной камерой',
                category: 'phone',
                brand: 'Apple'
            },
            {
                id: 2,
                name: 'MacBook Air M2',
                price: 1299,
                image: 'img/macbook.webp',
                description: 'Мощный и легкий ноутбук для работы и творчества',
                category: 'laptop',
                brand: 'Apple'
            },
            {
                id: 3,
                name: 'AirPods Pro',
                price: 249,
                image: 'img/airpods.webp',
                description: 'Беспроводные наушники с шумоподавлением',
                category: 'headphones',
                brand: 'Apple'
            },
            {
                id: 4,
                name: 'iPad Pro',
                price: 799,
                image: 'img/ipad.webp',
                description: 'Профессиональный планшет для творчества',
                category: 'tablet',
                brand: 'Apple'
            },
            {
                id: 5,
                name: 'Samsung Galaxy S24',
                price: 899,
                image: 'img/samsung-phone.webp',
                description: 'Флагманский смартфон Samsung с AI-функциями',
                category: 'phone',
                brand: 'Samsung'
            },
            {
                id: 6,
                name: 'Sony WH-1000XM5',
                price: 349,
                image: 'img/sony-headphones.webp',
                description: 'Наушники с лучшим шумоподавлением на рынке',
                category: 'headphones',
                brand: 'Sony'
            },
            {
                id: 7,
                name: 'Xiaomi Redmi Note 13',
                price: 299,
                image: 'img/xiaomi-phone.webp',
                description: 'Бюджетный смартфон с отличной камерой',
                category: 'phone',
                brand: 'Xiaomi'
            },
            {
                id: 8,
                name: 'Samsung Galaxy Tab S9',
                price: 699,
                image: 'img/samsung-tablet.webp',
                description: 'Мощный планшет для работы и развлечений',
                category: 'tablet',
                brand: 'Samsung'
            }
        ];
        
        this.filteredProducts = [...this.products];
        this.currentSearch = '';
    }

    // Поиск товаров
    searchProducts(searchTerm) {
        this.currentSearch = searchTerm.toLowerCase().trim();
        
        if (this.currentSearch === '') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => {
                return product.name.toLowerCase().includes(this.currentSearch) ||
                       product.description.toLowerCase().includes(this.currentSearch) ||
                       product.brand.toLowerCase().includes(this.currentSearch) ||
                       this.getCategoryName(product.category).toLowerCase().includes(this.currentSearch);
            });
        }
        
        this.renderProducts();
        this.updateSearchStats();
        this.toggleClearButton();
    }

    // Отрисовка товаров с подсветкой
    renderProducts() {
        const container = document.getElementById('productsContainer');
        
        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>Товары не найдены</h3>
                    <p>Попробуйте изменить поисковый запрос</p>
                    <button onclick="clearSearch()" class="btn btn-primary">
                        Очистить поиск
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = this.filteredProducts.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <h3>${this.highlightText(product.name)}</h3>
                    <p class="description">${this.highlightText(product.description)}</p>
                    <div class="price">$${product.price}</div>
                    <div class="product-meta" style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">
                        <span class="brand">${this.highlightText(product.brand)}</span>
                        <span class="category">• ${this.highlightText(this.getCategoryName(product.category))}</span>
                    </div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">В корзину</button>
                </div>
            `).join('');
        }
    }

    // Подсветка найденного текста
    highlightText(text) {
        if (!this.currentSearch) return text;
        
        const regex = new RegExp(`(${this.currentSearch})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Обновление статистики
    updateSearchStats() {
        const statsElement = document.getElementById('productsCount');
        
        // Показываем дополнительную информацию если есть поиск
        if (this.currentSearch) {
            statsElement.innerHTML = `<strong>${this.filteredProducts.length}</strong> по запросу "<strong>${this.currentSearch}</strong>"`;
        } else {
            statsElement.textContent = this.filteredProducts.length;
        }
    }

    // Управление кнопкой очистки
    toggleClearButton() {
        const clearBtn = document.querySelector('.search-clear');
        
        if (this.currentSearch) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    }

    // Очистка поиска
    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        this.searchProducts('');
        searchInput.focus();
    }

    // Получение названия категории
    getCategoryName(category) {
        const categories = {
            'phone': 'Смартфон',
            'laptop': 'Ноутбук',
            'headphones': 'Наушники',
            'tablet': 'Планшет'
        };
        return categories[category] || category;
    }
}

// Глобальные функции для поиска
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    productManager.searchProducts(searchInput.value);
}

function clearSearch() {
    productManager.clearSearch();
}

// Плавная прокрутка к секциям
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// Подсветка активного раздела в навигации
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        if (window.scrollY >= sectionTop - headerHeight - 50) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Показать/скрыть форму заказа
function showOrderForm() {
    document.getElementById('orderFormSection').style.display = 'block';
    scrollToSection('orderFormSection');
}

function hideOrderForm() {
    document.getElementById('orderFormSection').style.display = 'none';
}

// Инициализация при загрузке страницы
let productManager;

document.addEventListener('DOMContentLoaded', () => {
    productManager = new ProductManager();
    productManager.renderProducts();
    
    // Инициализация корзины
    window.cart = new ProductCart();
    
    // Обработчики для поиска
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.querySelector('.search-clear');
    
    // Поиск при вводе текста (с задержкой)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300);
    });
    
    // Поиск по Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Очистка поиска по кнопке
    clearBtn.addEventListener('click', clearSearch);
    
    // Фокус на поиск при загрузке
    searchInput.focus();
    
    // Добавляем обработчики для плавной прокрутки
    document.querySelectorAll('.nav-list a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Обновляем активную ссылку при скролле
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
});

// Глобальные функции для использования в HTML
window.scrollToSection = scrollToSection;
window.showOrderForm = showOrderForm;
window.hideOrderForm = hideOrderForm;
window.performSearch = performSearch;
window.clearSearch = clearSearch;
