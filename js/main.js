// Основной файл с общей функциональностью

// Disable browser's automatic scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Reset scroll to top immediately (runs as soon as script loads)
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

// Reset scroll to top on page load/refresh
window.addEventListener('load', function() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

// Reset scroll immediately when page is about to unload (for refresh)
window.addEventListener('beforeunload', function() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

document.addEventListener('DOMContentLoaded', function() {
    // Reset scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Мобильное меню
    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav-list');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Модальное окно
    const modal = document.getElementById('contactModal');
    const modalClose = document.querySelector('.modal-close');
    const contactForm = document.getElementById('contactForm');
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Закрытие модального окна по клику вне его
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Обработка модальной формы
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                message: document.getElementById('contactMessage').value,
                savedCalculation: localStorage.getItem('savedCalculation')
            };
            
            // Валидация
            if (!validateForm(formData)) {
                return;
            }
            
            // Отправка данных (интеграция с CRM будет добавлена)
            sendToCRM(formData);
        });
    }
    
    // Функция для автоматического изменения размера textarea
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    
    // Автоматическое изменение размера textarea в основной форме
    const mainContactMessage = document.getElementById('mainContactMessage');
    if (mainContactMessage) {
        // Применяем при загрузке страницы
        autoResizeTextarea(mainContactMessage);
        
        // Применяем при вводе текста
        mainContactMessage.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
        
        // Применяем при вставке текста
        mainContactMessage.addEventListener('paste', function() {
            setTimeout(() => autoResizeTextarea(this), 0);
        });
    }
    
    // Автоматическое изменение размера textarea в модальной форме
    const contactMessage = document.getElementById('contactMessage');
    if (contactMessage) {
        // Применяем при загрузке страницы
        autoResizeTextarea(contactMessage);
        
        // Применяем при вводе текста
        contactMessage.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
        
        // Применяем при вставке текста
        contactMessage.addEventListener('paste', function() {
            setTimeout(() => autoResizeTextarea(this), 0);
        });
    }
    
    // Обработка основной контактной формы
    const mainContactForm = document.getElementById('mainContactForm');
    if (mainContactForm) {
        mainContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('mainContactName').value,
                email: document.getElementById('mainContactEmail').value,
                phone: document.getElementById('mainContactPhone').value,
                company: document.getElementById('mainContactCompany').value,
                message: document.getElementById('mainContactMessage').value,
                agree: document.getElementById('mainContactAgree').checked,
                savedCalculation: localStorage.getItem('savedCalculation')
            };
            
            // Валидация
            if (!formData.agree) {
                showFormError(mainContactForm, 'Необходимо согласие на обработку персональных данных');
                return;
            }
            
            if (!validateForm({
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            })) {
                return;
            }
            
            // Отправка данных
            sendMainForm(formData);
        });
    }
    
    async function sendMainForm(data) {
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    company: data.company,
                    message: data.message,
                    savedCalculation: data.savedCalculation,
                    formType: 'main'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
        // Показываем сообщение об успехе
        showFormSuccess(mainContactForm, 'Спасибо! Ваша заявка отправлена. Наш специалист свяжется с вами в течение 15 минут.');
        
        // Очистка формы
        mainContactForm.reset();
        
        // Отправка события в аналитику
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': 'Main Contact Form'
            });
                }
            } else {
                showFormError(mainContactForm, result.error || 'Ошибка при отправке формы. Попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showFormError(mainContactForm, 'Ошибка соединения. Пожалуйста, попробуйте позже.');
        }
    }
    
    function showFormSuccess(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.style.cssText = `
            padding: 20px;
            background-color: rgba(74, 222, 128, 0.1);
            border: 2px solid #4ade80;
            border-radius: 8px;
            color: #4ade80;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        `;
        successDiv.textContent = message;
        
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => successDiv.remove(), 300);
        }, 5000);
    }
    
    function showFormError(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            padding: 20px;
            background-color: rgba(255, 99, 71, 0.1);
            border: 2px solid #ff6347;
            border-radius: 8px;
            color: #ff6347;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }
    
    // Валидация формы
    function validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        
        if (!data.name || data.name.trim().length < 2) {
            showError('Пожалуйста, укажите корректное имя');
            return false;
        }
        
        if (!emailRegex.test(data.email)) {
            showError('Пожалуйста, укажите корректный email адрес');
            return false;
        }
        
        if (!phoneRegex.test(data.phone) || data.phone.replace(/\D/g, '').length < 10) {
            showError('Пожалуйста, укажите корректный номер телефона');
            return false;
        }
        
        return true;
    }
    
    // Показ ошибок
    function showError(message) {
        // Создание элемента для ошибки
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'color: #ff6b6b; padding: 10px; margin-top: 10px; background: rgba(255,107,107,0.1); border-radius: 4px;';
        errorDiv.textContent = message;
        
        const form = document.getElementById('contactForm');
        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Отправка в CRM
    async function sendToCRM(data) {
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    message: data.message,
                    savedCalculation: data.savedCalculation,
                    formType: 'modal'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Показываем сообщение об успехе
        showSuccess('Спасибо! Расчет сохранен. Менеджер свяжется с вами в течение 15 минут');
        
        // Очистка формы
        if (contactForm) {
            contactForm.reset();
        }
        
        // Закрытие модального окна через 2 секунды
        setTimeout(() => {
            if (modal) {
                modal.classList.remove('active');
            }
        }, 2000);
            } else {
                showError(result.error || 'Ошибка при отправке формы. Попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showError('Ошибка соединения. Пожалуйста, попробуйте позже.');
        }
    }
    
    // Показ успешного сообщения
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = 'color: #51cf66; padding: 10px; margin-top: 10px; background: rgba(81,207,102,0.1); border-radius: 4px;';
        successDiv.textContent = message;
        
        const form = document.getElementById('contactForm');
        const existingSuccess = form.querySelector('.form-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        form.insertBefore(successDiv, form.firstChild);
    }
    
    // Фильтрация кейсов - removed (cases section removed)
    // const filterButtons = document.querySelectorAll('.filter-btn');
    // const resultCards = document.querySelectorAll('.result-card');
    // 
    // filterButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         const filter = this.getAttribute('data-filter');
    //         
    //         // Обновление активной кнопки
    //         filterButtons.forEach(btn => btn.classList.remove('active'));
    //         this.classList.add('active');
    //         
    //         // Фильтрация карточек
    //         resultCards.forEach(card => {
    //             const category = card.getAttribute('data-category');
    //             
    //             if (filter === 'all' || category === filter) {
    //                 card.style.display = 'block';
    //                 gsap.fromTo(card, 
    //                     { opacity: 0, scale: 0.9 },
    //                     { opacity: 1, scale: 1, duration: 0.3 }
    //                 );
    //             } else {
    //                 gsap.to(card, {
    //                     opacity: 0,
    //                     scale: 0.9,
    //                     duration: 0.3,
    //                     onComplete: () => {
    //                         card.style.display = 'none';
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // });
    
    // Генерация кейсов - removed (cases section removed)
    // function generateCases() {
    //     const resultsGrid = document.getElementById('resultsGrid');
    //     if (!resultsGrid) return;
    //     
    //     const cases = [
    //         {
    //             client: 'ООО "ЛогистикПро"',
    //             category: 'fot',
    //             problem: 'Высокие кадровые затраты и текучесть персонала',
    //             solution: 'Внедрен комплексный аутстаффинг с гарантией KPI',
    //             metrics: [
    //                 { label: 'Производительность', value: '+34%' },
    //                 { label: 'Стоимость ошибки', value: '-41%' },
    //                 { label: 'Инциденты', value: 'с 7 до 0' }
    //             ]
    //         },
    //         {
    //             client: 'СК "МеталлСклад"',
    //             category: 'risks',
    //             problem: 'Риски проверок ГИТ и миграционного контроля',
    //             solution: 'Перевод персонала на аутстаффинг с полной юридической защитой',
    //             metrics: [
    //                 { label: 'Штрафы', value: '0 руб.' },
    //                 { label: 'Проверки', value: 'вне зоны риска' }
    //             ]
    //         },
    //         {
    //             client: 'ТК "СезонТрейд"',
    //             category: 'scaling',
    //             problem: 'Сезонные пики загрузки требуют гибкого масштабирования',
    //             solution: 'Гибкая модель с возможностью оперативного увеличения штата',
    //             metrics: [
    //                 { label: 'Пиковая нагрузка', value: '+200%' },
    //                 { label: 'Время вывода', value: '72 часа' }
    //             ]
    //         }
    //     ];
    //     
    //     cases.forEach((caseItem, index) => {
    //         const card = document.createElement('div');
    //         card.className = 'result-card';
    //         card.setAttribute('data-category', caseItem.category);
    //         
    //         const metricsHTML = caseItem.metrics.map(metric => `
    //             <div class="metric-item">
    //                 <span class="metric-label">${metric.label}:</span>
    //                 <span class="metric-value">${metric.value}</span>
    //             </div>
    //         `).join('');
    //         
    //         card.innerHTML = `
    //             <div class="result-client">${caseItem.client}</div>
    //             <div class="result-problem"><strong>Проблема:</strong> ${caseItem.problem}</div>
    //             <div class="result-solution"><strong>Решение:</strong> ${caseItem.solution}</div>
    //             <div class="result-metrics">
    //                 ${metricsHTML}
    //             </div>
    //             <div class="result-document">
    //                 <a href="#results" class="btn btn-secondary">СМОТРЕТЬ ДРУГИЕ КЕЙСЫ</a>
    //             </div>
    //         `;
    //         
    //         resultsGrid.appendChild(card);
    //     });
    // }
    // 
    // // Инициализация кейсов
    // generateCases(); // Removed - cases section removed
    
    // Ленивая загрузка изображений
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Определение компании посетителя (базовая реализация)
    function detectCompany() {
        // Анализ referrer или других параметров
        const referrer = document.referrer;
        
        // Список известных доменов (пример)
        const knownCompanies = {
            'example-logistics.ru': 'ООО "Пример Логистик"',
            'test-warehouse.com': 'СК "Тест Склад"'
        };
        
        for (const [domain, company] of Object.entries(knownCompanies)) {
            if (referrer.includes(domain)) {
                // Показ контекстного сообщения
                showContextMessage(company);
                break;
            }
        }
    }
    
    function showContextMessage(company) {
        const message = document.createElement('div');
        message.className = 'context-message';
        message.innerHTML = `
            <p>Добро пожаловать, ${company}! Мы подготовили специальное предложение для вас.</p>
            <button class="close-message">×</button>
        `;
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: rgba(212, 175, 55, 0.95);
            color: #0D0D0D;
            padding: 20px;
            border-radius: 8px;
            max-width: 300px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(message);
        
        message.querySelector('.close-message').addEventListener('click', function() {
            message.remove();
        });
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 10000);
    }
    
    // Инициализация определения компании
    detectCompany();
});