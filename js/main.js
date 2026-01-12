// Основной файл с общей функциональностью
document.addEventListener('DOMContentLoaded', function() {
    
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
    
    function sendMainForm(data) {
        // Показываем сообщение об успехе
        showFormSuccess(mainContactForm, 'Спасибо! Ваша заявка отправлена. Наш специалист свяжется с вами в течение 15 минут.');
        
        // Здесь будет интеграция с CRM
        console.log('Данные основной формы для отправки в CRM:', data);
        
        // Очистка формы
        mainContactForm.reset();
        
        // Отправка события в аналитику
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': 'Main Contact Form'
            });
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
    
    // Отправка в CRM (заглушка - нужно будет интегрировать с реальной CRM)
    function sendToCRM(data) {
        // Пока просто показываем сообщение об успехе
        showSuccess('Спасибо! Расчет сохранен. Менеджер свяжется с вами в течение 15 минут');
        
        // Здесь будет интеграция с AmoCRM/Bitrix24
        console.log('Данные для отправки в CRM:', data);
        
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
    
    // Фильтрация кейсов
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resultCards = document.querySelectorAll('.result-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновление активной кнопки
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация карточек
            resultCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    gsap.fromTo(card, 
                        { opacity: 0, scale: 0.9 },
                        { opacity: 1, scale: 1, duration: 0.3 }
                    );
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.3,
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
    
    // Генерация кейсов (заглушка - данные должны быть из CMS)
    function generateCases() {
        const resultsGrid = document.getElementById('resultsGrid');
        if (!resultsGrid) return;
        
        const cases = [
            {
                client: 'ООО "ЛогистикПро"',
                category: 'fot',
                problem: 'Высокие кадровые затраты и текучесть персонала',
                solution: 'Внедрен комплексный аутстаффинг с гарантией KPI',
                metrics: [
                    { label: 'Производительность', value: '+34%' },
                    { label: 'Стоимость ошибки', value: '-41%' },
                    { label: 'Инциденты', value: 'с 7 до 0' }
                ]
            },
            {
                client: 'СК "МеталлСклад"',
                category: 'risks',
                problem: 'Риски проверок ГИТ и миграционного контроля',
                solution: 'Перевод персонала на аутстаффинг с полной юридической защитой',
                metrics: [
                    { label: 'Штрафы', value: '0 руб.' },
                    { label: 'Проверки', value: 'вне зоны риска' }
                ]
            },
            {
                client: 'ТК "СезонТрейд"',
                category: 'scaling',
                problem: 'Сезонные пики загрузки требуют гибкого масштабирования',
                solution: 'Гибкая модель с возможностью оперативного увеличения штата',
                metrics: [
                    { label: 'Пиковая нагрузка', value: '+200%' },
                    { label: 'Время вывода', value: '72 часа' }
                ]
            }
        ];
        
        cases.forEach((caseItem, index) => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.setAttribute('data-category', caseItem.category);
            
            const metricsHTML = caseItem.metrics.map(metric => `
                <div class="metric-item">
                    <span class="metric-label">${metric.label}:</span>
                    <span class="metric-value">${metric.value}</span>
                </div>
            `).join('');
            
            card.innerHTML = `
                <div class="result-client">${caseItem.client}</div>
                <div class="result-problem"><strong>Проблема:</strong> ${caseItem.problem}</div>
                <div class="result-solution"><strong>Решение:</strong> ${caseItem.solution}</div>
                <div class="result-metrics">
                    ${metricsHTML}
                </div>
                <div class="result-document">
                    <a href="#" class="btn btn-secondary" download>СКАЧАТЬ ВЫЖИМКУ ИЗ ОТЧЕТА (PDF)</a>
                </div>
            `;
            
            resultsGrid.appendChild(card);
        });
    }
    
    // Инициализация кейсов
    generateCases();
    
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
    
    // Чат виджет
    function initChatWidget() {
        const chatToggle = document.getElementById('chatToggle');
        const chatWidget = document.getElementById('chatWidget');
        const chatWidgetToggle = document.getElementById('chatWidgetToggle');
        const chatMinimize = chatWidget.querySelector('.chat-minimize');
        const chatForm = document.getElementById('chatForm');
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        const quickQuestionBtns = document.querySelectorAll('.quick-question-btn');
        
        // Ответы консультанта
        const responses = {
            'Расскажите о стоимости': 'Стоимость зависит от количества сотрудников и их специализации. В среднем, с учетом всех налогов, это на 20-30% выгоднее, чем содержание штатного сотрудника. Давайте рассчитаем точную экономию для вашего случая?',
            'Какие гарантии?': 'Мы гарантируем: замену сотрудника за 8 часов, штраф 200% за простой по нашей вине, полную юридическую защиту от проверок ГИТ и ФНС. Все гарантии закреплены в договоре.',
            'Сколько длится внедрение?': 'Стандартный процесс внедрения занимает 30 дней. При необходимости можем организовать экстренный вывод персонала за 72 часа. Хотите, подготовлю персональный план внедрения?'
        };
        
        // Открытие/закрытие чата
        function toggleChat() {
            chatWidget.classList.toggle('active');
            chatToggle.style.display = chatWidget.classList.contains('active') ? 'none' : 'flex';
            
            if (chatWidget.classList.contains('active')) {
                chatInput.focus();
                // Убираем бейдж после открытия
                const badge = chatToggle.querySelector('.chat-badge');
                if (badge) badge.style.display = 'none';
            }
        }
        
        chatToggle.addEventListener('click', toggleChat);
        chatWidgetToggle.addEventListener('click', function(e) {
            if (e.target.closest('.chat-minimize')) return;
        });
        chatMinimize.addEventListener('click', toggleChat);
        
        // Отправка сообщения
        function sendMessage(text, isUser = true) {
            if (!text.trim()) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message chat-message-${isUser ? 'user' : 'bot'}`;
            
            if (isUser) {
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-bubble">
                            <p>${text}</p>
                        </div>
                        <div class="message-time">только что</div>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" alt="Елизавета" onerror="this.src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'">
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            <p>${text}</p>
                        </div>
                        <div class="message-time">только что</div>
                    </div>
                `;
            }
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            return messageDiv;
        }
        
        // Показать индикатор набора текста
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message chat-message-bot';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" alt="Елизавета" onerror="this.src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'">
                </div>
                <div class="message-content">
                    <div class="message-bubble chat-typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Убрать индикатор набора
        function hideTyping() {
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
        }
        
        // Получить ответ
        function getResponse(userMessage) {
            const message = userMessage.toLowerCase();
            
            // Проверка на быстрые вопросы
            for (const [key, response] of Object.entries(responses)) {
                if (userMessage.includes(key) || message.includes(key.toLowerCase())) {
                    return response;
                }
            }
            
            // Общие ответы
            if (message.includes('стоимость') || message.includes('цена') || message.includes('сколько')) {
                return 'Стоимость рассчитывается индивидуально. В среднем экономия составляет 20-30% от текущих затрат. Давайте рассчитаем точную экономию для вашей компании?';
            } else if (message.includes('гарант') || message.includes('риск')) {
                return 'Мы берем на себя все кадровые, юридические и налоговые риски. В договоре прописаны гарантии замены за 8 часов и штрафные санкции. Хотите, пришлю образец договора?';
            } else if (message.includes('время') || message.includes('долго') || message.includes('срок')) {
                return 'Стандартное внедрение занимает 30 дней. Можем ускорить до 72 часов при необходимости. Какой срок вас интересует?';
            } else if (message.includes('привет') || message.includes('здравств')) {
                return 'Здравствуйте! Рада помочь. Что вас интересует в первую очередь?';
            } else {
                return 'Спасибо за вопрос! Чтобы дать вам максимально точный ответ, оставьте ваши контактные данные, и я подготовлю персональную консультацию. Или задайте другой вопрос - я всегда на связи!';
            }
        }
        
        // Обработка формы
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;
            
            chatInput.value = '';
            sendMessage(message, true);
            
            // Показать набор текста
            setTimeout(() => {
                showTyping();
                
                // Получить ответ с задержкой
                setTimeout(() => {
                    hideTyping();
                    const response = getResponse(message);
                    sendMessage(response, false);
                }, 1000 + Math.random() * 1000);
            }, 500);
        });
        
        // Быстрые вопросы
        quickQuestionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const question = this.getAttribute('data-question').replace(/💰|🛡️|⏱️\s*/g, '');
                chatInput.value = question;
                chatForm.dispatchEvent(new Event('submit'));
            });
        });
        
        // Автофокус при открытии
        chatInput.addEventListener('focus', function() {
            this.parentElement.style.borderColor = 'var(--accent-gold)';
        });
        
        chatInput.addEventListener('blur', function() {
            this.parentElement.style.borderColor = '';
        });
    }
    
    // Инициализация чата
    if (document.getElementById('chatWidget')) {
        initChatWidget();
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