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