// Валидация форм согласно п. 5.4 стандарта
function validateForm(formData) {
    try {
        if (!formData.name || formData.name.trim().length < 2) {
            throw new Error('Имя должно содержать минимум 2 символа');
        }

        if (!formData.email || !isValidEmail(formData.email)) {
            throw new Error('Введите корректный email');
        }

        return true;
    } catch (error) {
        console.error('Ошибка валидации:', error);
        showErrorMessage(error.message);
        return false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showErrorMessage(message) {
    alert(`Ошибка: ${message}`);
}

// Обработка формы заказа
document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value
    };

    if (validateForm(formData)) {
        // Отправка данных
        alert('Заказ успешно оформлен!');
        e.target.reset();
    }

});

// Обновляем функцию валидации
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Имя должно содержать минимум 2 символа');
    }

    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Введите корректный email адрес');
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
        errors.push('Введите корректный номер телефона');
    }

    if (errors.length > 0) {
        // Показываем ошибки доступным способом
        showAccessibleErrors(errors);
        return false;
    }

    return true;
}

function showAccessibleErrors(errors) {
    const errorContainer = document.createElement('div');
    errorContainer.setAttribute('role', 'alert');
    errorContainer.setAttribute('aria-live', 'assertive');
    errorContainer.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--error-color);
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 1002;
        max-width: 400px;
        text-align: center;
    `;
    
    errorContainer.innerHTML = `
        <strong>Ошибки в форме:</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px; text-align: left;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    document.body.appendChild(errorContainer);
    
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}
