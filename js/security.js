// Интерактивная работа с документами безопасности
document.addEventListener('DOMContentLoaded', function() {
    const documentButtons = document.querySelectorAll('[data-document]');
    
    documentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const documentType = this.getAttribute('data-document');
            handleDocumentClick(documentType);
        });
    });
    
    function handleDocumentClick(type) {
        switch(type) {
            case 'license':
                openLicenseModal();
                break;
            case 'contract':
                openContractViewer();
                break;
            case 'insurance':
                downloadInsurance();
                break;
        }
    }
    
    function openLicenseModal() {
        // Модальное окно для проверки лицензии
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>Проверка лицензии Роструда</h2>
                <p>Введите номер лицензии для проверки актуальности на официальном сайте Роструда.</p>
                <form class="license-check-form">
                    <div class="form-group">
                        <label for="licenseNumber">Номер лицензии</label>
                        <input type="text" id="licenseNumber" placeholder="Например: ЛО-77-01-001234" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Проверить на сайте Роструда</button>
                </form>
                <div class="license-info" style="margin-top: 20px; padding: 15px; background: rgba(212, 175, 55, 0.1); border-radius: 4px;">
                    <p><strong>Номер лицензии:</strong> ЛО-77-01-001234</p>
                    <p><strong>Дата выдачи:</strong> 15.03.2020</p>
                    <p><strong>Статус:</strong> Действительна</p>
                    <p><strong>Орган выдачи:</strong> Роструд</p>
                    <a href="https://www.rosmintrud.ru/services/licenses" target="_blank" class="btn btn-secondary" style="margin-top: 10px;">
                        Открыть сайт Роструда
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Обработка закрытия
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Обработка формы
        const form = modal.querySelector('.license-check-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const licenseNumber = document.getElementById('licenseNumber').value;
            window.open(`https://www.rosmintrud.ru/services/licenses?q=${encodeURIComponent(licenseNumber)}`, '_blank');
        });
    }
    
    function openContractViewer() {
        // 3D-визуализация договора
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <span class="modal-close">&times;</span>
                <h2>Типовой договор аутстаффинга</h2>
                <div class="contract-viewer">
                    <div class="contract-pages">
                        <div class="contract-page" style="
                            perspective: 1000px;
                            margin: 20px 0;
                            transform-style: preserve-3d;
                        ">
                            <div class="contract-content" style="
                                background: white;
                                color: #0D0D0D;
                                padding: 40px;
                                border-radius: 8px;
                                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                                transform: rotateY(-5deg);
                                transition: transform 0.3s ease;
                                max-height: 600px;
                                overflow-y: auto;
                            ">
                                <h3 style="color: #D4AF37; margin-bottom: 20px;">ДОГОВОР АУТСТАФФИНГА</h3>
                                <div class="contract-section">
                                    <h4>5. ГАРАНТИИ И ОТВЕТСТВЕННОСТЬ</h4>
                                    <p><strong>5.2. Гарантии Исполнителя:</strong></p>
                                    <ul>
                                        <li>Замена сотрудника в течение 8 часов при несоответствии требованиям</li>
                                        <li>Штраф в размере 200% от стоимости услуг за простой по вине Исполнителя</li>
                                        <li>Соблюдение KPI, указанных в Приложении №1 к настоящему договору</li>
                                        <li>Полная юридическая ответственность за действия персонала</li>
                                        <li>Страхование ответственности на сумму 10 000 000 рублей</li>
                                    </ul>
                                </div>
                                <div class="contract-actions" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                                    <button class="btn btn-primary" onclick="scrollToGuarantee()" style="margin-right: 10px;">
                                        Подсветить гарантии
                                    </button>
                                    <a href="assets/documents/contract-sample.pdf" download class="btn btn-secondary">
                                        Скачать полный договор (PDF)
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Эффект при наведении
        const contractContent = modal.querySelector('.contract-content');
        contractContent.addEventListener('mouseenter', function() {
            this.style.transform = 'rotateY(0deg) scale(1.02)';
        });
        contractContent.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateY(-5deg) scale(1)';
        });
        
        // Обработка закрытия
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Функция подсветки гарантий
        window.scrollToGuarantee = function() {
            modal.remove();
            const securitySection = document.getElementById('security');
            if (securitySection) {
                securitySection.scrollIntoView({ behavior: 'smooth' });
                // Анимация подсветки
                setTimeout(() => {
                    securitySection.style.boxShadow = '0 0 50px rgba(212, 175, 55, 0.5)';
                    setTimeout(() => {
                        securitySection.style.boxShadow = '';
                    }, 2000);
                }, 500);
            }
        };
    }
    
    function downloadInsurance() {
        // Загрузка страхового полиса
        const link = document.createElement('a');
        link.href = 'assets/documents/insurance-policy.pdf';
        link.download = 'insurance-policy.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Показ уведомления
        showNotification('Страховой полис скачивается. Полис действителен до 31.12.2024');
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(212, 175, 55, 0.95);
            color: #0D0D0D;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Обработка кнопки получения выписки
    const extractButton = document.querySelector('#security .btn-primary');
    if (extractButton && extractButton.textContent.includes('ВЫПИСКУ')) {
        extractButton.addEventListener('click', function(e) {
            e.preventDefault();
            openExtractModal();
        });
    }
    
    function openExtractModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>Получить выписку из договора по гарантиям</h2>
                <p>Укажите email, и мы отправим PDF-выписку с гарантиями из договора.</p>
                <form class="extract-form">
                    <div class="form-group">
                        <label for="extractEmail">Email для получения документа</label>
                        <input type="email" id="extractEmail" placeholder="Ваш корпоративный email" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Получить выписку</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        const form = modal.querySelector('.extract-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('extractEmail').value;
            
            // Имитация отправки (здесь должна быть интеграция с бэкендом)
            showNotification(`Выписка отправлена на ${email}. Проверьте почту в течение 5 минут.`);
            modal.remove();
        });
    }
});