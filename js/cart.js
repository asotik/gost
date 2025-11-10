// Модуль корзины покупок
class ProductCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.isOpen = false;
        this.initEventListeners();
        this.updateCartDisplay();
    }

    initEventListeners() {
        // Кнопка открытия/закрытия корзины
        document.getElementById('cartToggle').addEventListener('click', () => this.toggleCart());
        
        // Кнопка закрытия корзины
        document.getElementById('closeCart').addEventListener('click', () => this.hideCart());
        
        // Кнопка оформления заказа
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
        
        // Закрытие корзины по клику на оверлей
        document.getElementById('overlay').addEventListener('click', () => this.hideCart());
        
        // Закрытие корзины по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hideCart();
            }
        });
    }

    addProduct(product) {
        this.items.push({
            ...product, 
            cartId: Date.now() + Math.random()
        });
        this.saveToLocalStorage();
        this.updateCartDisplay();
        this.showNotification(`"${product.name}" добавлен в корзину`);
    }

    removeProduct(cartId) {
        this.items = this.items.filter(item => item.cartId !== cartId);
        this.saveToLocalStorage();
        this.updateCartDisplay();
    }

    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
        this.updateCartDisplay();
        this.hideCart();
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartContainer = document.getElementById('cartItems');
        const totalAmount = document.getElementById('totalAmount');
        const cartCount = document.querySelector('.cart-count');
        
        // Обновляем счетчик в кнопке корзины
        cartCount.textContent = this.items.length;
        
        // Обновляем общую сумму
        totalAmount.textContent = this.calculateTotal();

        // Обновляем список товаров
        if (this.items.length > 0) {
            cartContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <div>$${item.price}</div>
                    </div>
                    <button class="btn btn-secondary" onclick="cart.removeProduct(${item.cartId})" 
                            aria-label="Удалить ${item.name} из корзины">
                        Удалить
                    </button>
                </div>
            `).join('');
        } else {
            cartContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        }
    }

    toggleCart() {
        if (this.isOpen) {
            this.hideCart();
        } else {
            this.showCart();
        }
    }

    showCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        const cartToggle = document.getElementById('cartToggle');
        
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        
        // Обновляем ARIA-атрибуты
        cartSidebar.setAttribute('aria-hidden', 'false');
        cartToggle.setAttribute('aria-expanded', 'true');
        overlay.setAttribute('aria-hidden', 'false');
        
        // Блокируем скролл основного контента
        document.body.style.overflow = 'hidden';
        
        this.isOpen = true;
        
        // Фокус на кнопку закрытия для доступности
        setTimeout(() => {
            document.getElementById('closeCart').focus();
        }, 100);
    }

    hideCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        const cartToggle = document.getElementById('cartToggle');
        
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        
        // Обновляем ARIA-атрибуты
        cartSidebar.setAttribute('aria-hidden', 'true');
        cartToggle.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Разблокируем скролл
        document.body.style.overflow = '';
        
        this.isOpen = false;
        
        // Возвращаем фокус на кнопку корзины
        cartToggle.focus();
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('Корзина пуста!', 'error');
            return;
        }
        this.hideCart();
        showOrderForm();
    }

    showNotification(message, type = 'success') {
        // Удаляем предыдущие уведомления
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        const backgroundColor = type === 'error' ? '#dc2626' : '#f59e0b';
        
        notification.className = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${backgroundColor};
            color: #0f172a;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: 600;
            z-index: 1003;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Глобальные функции для использования в HTML
function addToCart(productId) {
    if (!window.cart) {
        console.error('Корзина не инициализирована');
        return;
    }
    
    const product = productManager.products.find(p => p.id === productId);
    if (product) {
        cart.addProduct(product);
    } else {
        console.error('Товар не найден:', productId);
    }
}
