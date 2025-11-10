/**
 * Скрипт для страницы 404
 * Соответствует ГОСТ Р 56939-2016 п. 5.3.2 - Обработка ошибок
 */

class ErrorPageHandler {
    constructor() {
        this.init();
    }

    init() {
        this.logError();
        this.setupAutoRedirect();
        this.setupKeyboardNavigation();
        this.setupAnalytics();
    }

    // Логирование ошибки для аналитики
    logError() {
        const errorInfo = {
            type: '404',
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        console.warn('Страница 404:', errorInfo);
        
        // Здесь можно отправить данные в систему аналитики
        this.sendToAnalytics(errorInfo);
    }

    // Автоматический редирект на главную
    setupAutoRedirect() {
        let seconds = 30;
        const timerElement = document.createElement('div');
        timerElement.style.cssText = `
            margin-top: 1rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
        `;
        
        const updateTimer = () => {
            timerElement.textContent = `Автоматический переход на главную через ${seconds} секунд...`;
            seconds--;
            
            if (seconds < 0) {
                window.location.href = 'index.html';
            } else {
                setTimeout(updateTimer, 1000);
            }
        };

        const errorHelp = document.querySelector('.error-help');
        if (errorHelp) {
            errorHelp.appendChild(timerElement);
            updateTimer();
        }
    }

    // Настройка клавиатурной навигации
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    history.back();
                    break;
                case '1':
                    window.location.href = 'index.html';
                    break;
                case '2':
                    window.location.href = 'index.html#catalog';
                    break;
                case 'h':
                case 'H':
                    window.location.href = 'index.html';
                    break;
            }
        });

        // Добавляем подсказки по клавиатурной навигации
        this.addKeyboardHelp();
    }

    // Добавление подсказок по клавиатурной навигации
    addKeyboardHelp() {
        const helpText = document.createElement('div');
        helpText.style.cssText = `
            margin-top: 1rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
            line-height: 1.4;
        `;
        helpText.innerHTML = `
            <strong>Подсказка по клавишам:</strong><br>
            ESC - Назад • 1 - Главная • 2 - Каталог • H - Главная
        `;

        const errorHelp = document.querySelector('.error-help');
        if (errorHelp) {
            errorHelp.appendChild(helpText);
        }
    }

    // Отправка данных в аналитику (заглушка)
    sendToAnalytics(errorInfo) {
        // В реальном проекте здесь будет отправка в Google Analytics, Yandex.Metrica и т.д.
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    page_title: '404 Not Found',
                    page_location: errorInfo.url
                });
            }
        } catch (e) {
            console.log('Аналитика не доступна:', e);
        }
    }

    // Поиск по сайту (имитация)
    searchSite() {
        const searchTerm = prompt('Что вы ищете? Введите ключевые слова:');
        if (searchTerm && searchTerm.trim()) {
            // В реальном проекте здесь будет перенаправление на страницу поиска
            alert(`Поиск: "${searchTerm}"\n\nК сожалению, функция поиска временно недоступна. Пожалуйста, воспользуйтесь навигацией по сайту.`);
            
            // Логируем поисковый запрос
            console.log('Поисковый запрос с страницы 404:', searchTerm);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.errorPage = new ErrorPageHandler();
});

// Глобальные функции для использования в HTML
function searchSite() {
    if (window.errorPage) {
        window.errorPage.searchSite();
    }
}

// Обработка ошибок загрузки страницы
window.addEventListener('error', (e) => {
    console.error('Ошибка на странице 404:', e.error);
});