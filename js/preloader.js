// Preloader с SVG анимацией схемы склада
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloaderText');
    const progressBar = document.querySelector('.preloader-progress-bar');
    const svg = document.querySelector('.preloader-svg');
    
    // Тексты для preloader
    const texts = [
        'Выстраиваем эффективные системы...',
        '...управляемые процессы...',
        '...гарантированные результаты'
    ];
    
    let currentTextIndex = 0;
    let progress = 0;
    
    // Создание SVG схемы склада
    function createWarehouseSVG() {
        const paths = [
            // Контур склада
            { d: 'M 50 50 L 350 50 L 350 350 L 50 350 Z', delay: 0 },
            // Стеллажи
            { d: 'M 100 100 L 150 100 L 150 200 L 100 200 Z', delay: 500 },
            { d: 'M 200 100 L 250 100 L 250 200 L 200 200 Z', delay: 800 },
            { d: 'M 300 100 L 320 100 L 320 200 L 300 200 Z', delay: 1100 },
            // Зона приемки
            { d: 'M 50 250 L 150 250 L 150 350 L 50 350 Z', delay: 1400 },
            // Зона отгрузки
            { d: 'M 250 250 L 350 250 L 350 350 L 250 350 Z', delay: 1700 },
            // Пути движения
            { d: 'M 200 200 L 200 250', delay: 2000 },
            { d: 'M 150 200 L 250 200', delay: 2300 }
        ];
        
        paths.forEach((pathData, index) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData.d);
            path.setAttribute('stroke', '#D4AF37');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.transition = `stroke-dashoffset 1s ease-in-out ${pathData.delay}ms`;
            
            svg.appendChild(path);
            
            setTimeout(() => {
                path.style.strokeDashoffset = 0;
            }, pathData.delay + 100);
        });
    }
    
    // Обновление прогресс-бара
    function updateProgress(value) {
        progress = value;
        progressBar.style.width = `${progress}%`;
    }
    
    // Смена текста
    function updateText() {
        if (currentTextIndex < texts.length) {
            preloaderText.style.opacity = '0';
            setTimeout(() => {
                preloaderText.textContent = texts[currentTextIndex];
                preloaderText.style.opacity = '1';
                currentTextIndex++;
            }, 300);
        }
    }
    
    // Инициализация
    createWarehouseSVG();
    
    // Симуляция прогресса
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        }
        updateProgress(progress);
    }, 200);
    
    // Смена текста каждые 2 секунды
    updateText();
    const textInterval = setInterval(() => {
        if (currentTextIndex < texts.length) {
            updateText();
        } else {
            clearInterval(textInterval);
        }
    }, 2000);
});