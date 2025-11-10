// Модуль корзины покупок
class ProductCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.initEventListeners();
        this.updateCartDisplay();
        // Добавляем в класс ProductCart метод showNotification
showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--accent);
        color: var(--bg-primary);
        padding: 12px 20px;
        border-radius: 6px;
        font-weight: 600;
        z-index: 1002;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
    }

    initEventListeners() {
        document.getElementById('cartToggle').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.hideCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
        
        // Закрытие корзины по клику на оверлей
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('overlay')) {
                this.hideCart();
            }
        });
    }

    addProduct(product) {
        this.items.push({...product, cartId: Date.now()});
        this.saveToLocalStorage();
        this.updateCartDisplay();
        this.showNotification(`Товар "${product.name}" добавлен в корзину`);
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
        
        cartCount.textContent = this.items.length;
        totalAmount.textContent = this.calculateTotal();

        if (this.items.length > 0) {
            cartContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <div>$${item.price}</div>
                    </div>
                    <button class="btn btn-secondary" onclick="cart.removeProduct(${item.cartId})">Удалить</button>
                </div>
            `).join('');
        } else {
            cartContainer.innerHTML = '<p>Корзина пуста</p>';
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.querySelector('.overlay') || this.createOverlay();
        
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    hideCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.querySelector('.overlay');
        
        cartSidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        this.hideCart();
        showOrderForm();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1002;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Глобальные функции для использования в HTML
function addToCart(productId) {
    const product = productManager.products.find(p => p.id === productId);
    if (product) {
        cart.addProduct(product);
    }
}

