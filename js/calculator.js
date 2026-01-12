// Интерактивный калькулятор издержек
class CostCalculator {
    constructor() {
        this.employeesCount = 10;
        this.avgSalary = 45000;
        this.turnoverRate = 25;
        this.seasonality = 20;
        
        this.init();
    }
    
    init() {
        // Привязка элементов
        this.employeesInput = document.getElementById('employeesCount');
        this.salaryInput = document.getElementById('avgSalary');
        this.turnoverInput = document.getElementById('turnoverRate');
        this.seasonalityInput = document.getElementById('seasonality');
        this.seasonalityValue = document.getElementById('seasonalityValue');
        
        this.currentCostsContainer = document.getElementById('currentCosts');
        this.currentTotal = document.getElementById('currentTotal');
        this.outsourcedCostsContainer = document.getElementById('outsourcedCosts');
        this.outsourcedTotal = document.getElementById('outsourcedTotal');
        this.hiddenCosts = document.getElementById('hiddenCosts');
        
        this.saveButton = document.getElementById('saveCalculation');
        
        // Загрузка сохраненных данных
        this.loadSavedData();
        
        // Обработчики событий
        this.employeesInput.addEventListener('input', () => this.update());
        this.salaryInput.addEventListener('input', () => this.update());
        this.turnoverInput.addEventListener('input', () => this.update());
        this.seasonalityInput.addEventListener('input', () => this.updateSeasonality());
        
        this.saveButton.addEventListener('click', () => this.saveCalculation());
        
        // Первоначальный расчет
        this.update();
    }
    
    updateSeasonality() {
        this.seasonality = parseInt(this.seasonalityInput.value);
        this.seasonalityValue.textContent = `${this.seasonality}%`;
        this.update();
    }
    
    loadSavedData() {
        const saved = localStorage.getItem('calculatorData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.employeesCount = data.employees || 10;
                this.avgSalary = data.salary || 45000;
                this.turnoverRate = data.turnover || 25;
                this.seasonality = data.seasonality || 20;
                
                this.employeesInput.value = this.employeesCount;
                this.salaryInput.value = this.avgSalary;
                this.turnoverInput.value = this.turnoverRate;
                this.seasonalityInput.value = this.seasonality;
                this.seasonalityValue.textContent = `${this.seasonality}%`;
            } catch (e) {
                console.error('Ошибка загрузки сохраненных данных', e);
            }
        }
    }
    
    calculateCurrentCosts() {
        const baseFOT = this.employeesCount * this.avgSalary;
        const taxes = baseFOT * 0.43; // 43% налоги
        const recruiting = (baseFOT * this.turnoverRate / 100) * 0.15; // 15% от ФОТ на рекрутинг
        const downtime = baseFOT * 0.12; // 12% простои
        const admin = baseFOT * 0.08; // 8% админ. затраты
        const risks = baseFOT * 0.05; // 5% риски штрафов
        const seasonalityCost = baseFOT * (this.seasonality / 100);
        
        const total = baseFOT + taxes + recruiting + downtime + admin + risks + seasonalityCost;
        
        return {
            baseFOT,
            taxes,
            recruiting,
            downtime,
            admin,
            risks,
            seasonalityCost,
            total
        };
    }
    
    calculateOutsourcedCosts(currentTotal) {
        // С аутстаффингом: единая ставка + снижение рисков
        const baseRate = this.employeesCount * this.avgSalary * 1.15; // +15% за сервис
        const savings = currentTotal * 0.25; // 25% экономия за счет оптимизации
        const total = baseRate - savings;
        
        return {
            baseRate,
            savings,
            total
        };
    }
    
    formatNumber(num) {
        return new Intl.NumberFormat('ru-RU').format(Math.round(num));
    }
    
    animateValue(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const difference = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (difference * progress);
            element.textContent = this.formatNumber(current) + ' руб./мес';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    createCostSegment(label, value, color, delay = 0) {
        const segment = document.createElement('div');
        segment.className = 'cost-segment';
        segment.style.backgroundColor = color;
        segment.style.opacity = '0';
        segment.style.transform = 'translateX(-20px)';
        
        segment.innerHTML = `
            <span>${label}</span>
            <span class="cost-value">${this.formatNumber(value)} руб.</span>
        `;
        
        setTimeout(() => {
            segment.style.transition = 'all 0.5s ease-out';
            segment.style.opacity = '1';
            segment.style.transform = 'translateX(0)';
        }, delay);
        
        return segment;
    }
    
    update() {
        this.employeesCount = parseInt(this.employeesInput.value) || 10;
        this.avgSalary = parseInt(this.salaryInput.value) || 45000;
        this.turnoverRate = parseInt(this.turnoverInput.value) || 25;
        
        const currentCosts = this.calculateCurrentCosts();
        const outsourcedCosts = this.calculateOutsourcedCosts(currentCosts.total);
        
        // Очистка контейнеров
        this.currentCostsContainer.innerHTML = '';
        this.outsourcedCostsContainer.innerHTML = '';
        
        // Создание сегментов текущих затрат
        const colors = {
            baseFOT: 'rgba(212, 175, 55, 0.3)',
            taxes: 'rgba(192, 192, 192, 0.3)',
            recruiting: 'rgba(205, 127, 50, 0.3)',
            downtime: 'rgba(184, 115, 51, 0.3)',
            admin: 'rgba(160, 160, 160, 0.3)',
            risks: 'rgba(255, 99, 71, 0.3)',
            seasonalityCost: 'rgba(212, 175, 55, 0.2)'
        };
        
        const segments = [
            { key: 'baseFOT', label: 'ФОТ', color: colors.baseFOT },
            { key: 'taxes', label: 'Налоги (43%)', color: colors.taxes },
            { key: 'recruiting', label: 'Рекрутинг', color: colors.recruiting },
            { key: 'downtime', label: 'Простои', color: colors.downtime },
            { key: 'admin', label: 'Админ. затраты', color: colors.admin },
            { key: 'risks', label: 'Риски штрафов', color: colors.risks },
            { key: 'seasonalityCost', label: 'Сезонность', color: colors.seasonalityCost }
        ];
        
        let delay = 0;
        segments.forEach(seg => {
            const segment = this.createCostSegment(
                seg.label,
                currentCosts[seg.key],
                seg.color,
                delay
            );
            this.currentCostsContainer.appendChild(segment);
            delay += 100;
        });
        
        // Затраты с аутстаффингом
        const outsourcedSegment = this.createCostSegment(
            'Единая ставка (все включено)',
            outsourcedCosts.total,
            'rgba(212, 175, 55, 0.4)',
            delay
        );
        this.outsourcedCostsContainer.appendChild(outsourcedSegment);
        
        // Анимация итоговых сумм
        const currentTotalValue = parseInt(this.currentTotal.textContent.replace(/\s/g, '').replace('руб./мес', '')) || 0;
        const outsourcedTotalValue = parseInt(this.outsourcedTotal.textContent.replace(/\s/g, '').replace('руб./мес', '')) || 0;
        
        this.animateValue(this.currentTotal, currentTotalValue, currentCosts.total);
        this.animateValue(this.outsourcedTotal, outsourcedTotalValue, outsourcedCosts.total);
        
        // Скрытые издержки на человека
        const hiddenCostsPerPerson = (currentCosts.total - currentCosts.baseFOT) / this.employeesCount;
        this.animateValue(this.hiddenCosts, parseInt(this.hiddenCosts.textContent) || 0, hiddenCostsPerPerson, 800);
        
        // Автосохранение
        this.autoSave();
    }
    
    autoSave() {
        const data = {
            employees: this.employeesCount,
            salary: this.avgSalary,
            turnover: this.turnoverRate,
            seasonality: this.seasonality
        };
        sessionStorage.setItem('calculatorData', JSON.stringify(data));
    }
    
    saveCalculation() {
        const currentCosts = this.calculateCurrentCosts();
        const outsourcedCosts = this.calculateOutsourcedCosts(currentCosts.total);
        
        const calculationData = {
            timestamp: new Date().toISOString(),
            employees: this.employeesCount,
            avgSalary: this.avgSalary,
            turnoverRate: this.turnoverRate,
            seasonality: this.seasonality,
            currentTotal: currentCosts.total,
            outsourcedTotal: outsourcedCosts.total,
            savings: currentCosts.total - outsourcedCosts.total,
            hiddenCostsPerPerson: (currentCosts.total - currentCosts.baseFOT) / this.employeesCount
        };
        
        localStorage.setItem('savedCalculation', JSON.stringify(calculationData));
        
        // Прокрутка к форме контакта
        const contactSection = document.getElementById('contact-form-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Автозаполнение формы данными из localStorage, если есть
            setTimeout(() => {
                const mainContactName = document.getElementById('mainContactName');
                const mainContactEmail = document.getElementById('mainContactEmail');
                const mainContactMessage = document.getElementById('mainContactMessage');
                
                if (mainContactMessage && !mainContactMessage.value) {
                    mainContactMessage.value = `Расчет экономии:\nСотрудников: ${this.employeesCount}\nСредняя зарплата: ${this.avgSalary} руб.\nТекучесть: ${this.turnoverRate}%\nСкрытые издержки: ${Math.round((currentCosts.total - currentCosts.baseFOT) / this.employeesCount)} руб./мес на человека`;
                }
                
                // Фокус на первое поле
                if (mainContactName) {
                    mainContactName.focus();
                }
            }, 500);
        }
    }
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calculator')) {
        new CostCalculator();
    }
});