// Preloader с анимацией логотипа

// Hide scrollbar immediately when script loads (before DOM is ready)
if (document.documentElement) {
    document.documentElement.classList.add('preloader-active');
}

document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloaderText');
    const svg = document.querySelector('.preloader-svg');
    
    // Ensure scrollbar is hidden
    document.documentElement.classList.add('preloader-active');
    
    // Проверяем наличие необходимых элементов
    if (!preloader || !svg) {
        console.warn('Preloader elements not found');
        document.documentElement.classList.remove('preloader-active');
        return;
    }
    
    // Тексты для preloader
    const texts = [];
    
    let currentTextIndex = 0;
    
    // Создание логотипа с анимацией
    function createLogoAnimation() {
        // Очищаем SVG контейнер
        if (svg) {
            svg.innerHTML = '';
        } else {
            return;
        }
        
        // Создаем SVG элемент для логотипа
        const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        logoSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        logoSvg.setAttribute('version', '1.0');
        logoSvg.setAttribute('viewBox', '0 0 1536 1024');
        logoSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        logoSvg.style.width = '100%';
        logoSvg.style.height = '100%';
        logoSvg.style.maxWidth = '1000px';
        logoSvg.style.maxHeight = '1000px';
        logoSvg.style.margin = '0 auto';
        logoSvg.style.display = 'block';
        logoSvg.style.cursor = 'pointer';
        
        // Создаем группу с трансформацией
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(0,1024) scale(0.1,-0.1)');
        
        // Создаем путь логотипа
        const logoPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        logoPath.setAttribute('d', 'M7696 7361 c5 -5 74 -37 154 -71 80 -33 179 -76 220 -95 172 -78 924 -406 1255 -547 77 -33 246 -106 375 -163 129 -57 296 -130 370 -162 74 -33 186 -82 248 -109 l112 -49 0 -1007 0 -1008 -190 0 -190 0 -2 891 -3 892 -75 32 c-381 163 -1408 610 -1945 847 -99 44 -217 95 -263 115 l-83 35 -232 -102 c-128 -56 -302 -133 -387 -170 -254 -111 -547 -239 -670 -292 -63 -28 -149 -65 -190 -83 -89 -39 -702 -304 -810 -350 l-75 -32 -3 -889 -2 -889 -188 0 -187 1 -3 1005 -2 1005 342 149 c189 82 417 181 508 221 91 39 287 124 435 189 149 64 320 138 380 165 61 26 234 102 385 168 151 66 334 145 405 177 72 32 162 71 200 87 39 17 74 34 80 39 11 11 19 11 31 0z m167 -1383 c87 -42 134 -81 180 -151 143 -217 64 -512 -167 -621 -217 -103 -483 -11 -588 202 -28 55 -33 78 -36 157 -3 66 0 109 13 151 53 188 234 310 443 300 68 -3 94 -10 155 -38z m-1106 -315 c246 -98 304 -432 106 -613 -76 -70 -144 -94 -263 -95 -86 0 -101 3 -160 31 -87 41 -130 80 -169 153 -90 169 -41 374 116 482 107 74 250 90 370 42z m2158 -7 c144 -66 234 -218 223 -377 -10 -128 -85 -235 -208 -293 -60 -29 -73 -31 -170 -31 -95 0 -110 3 -163 28 -75 37 -146 108 -183 182 -26 54 -29 70 -29 155 0 83 4 103 28 155 67 143 192 218 357 212 67 -2 97 -9 145 -31z m-838 -661 c64 -19 138 -84 178 -157 l30 -53 3 -552 3 -553 -611 0 -610 0 0 528 c0 347 4 541 11 567 26 95 96 169 198 212 55 22 64 23 402 23 279 0 355 -3 396 -15z m-1227 -750 l0 -565 -420 0 -420 0 0 445 c0 419 1 447 20 497 24 66 85 128 160 162 l55 26 303 0 302 0 0 -565z m2330 541 c70 -37 109 -77 139 -139 l30 -62 1 -215 c1 -118 1 -322 1 -452 l-1 -238 -420 0 -420 0 -1 528 c-1 290 -3 540 -5 557 -2 16 2 33 9 37 7 5 152 7 322 6 282 -3 313 -5 345 -22z m-3455 -966 l0 -140 -396 0 -396 0 -1 140 -1 140 397 0 397 0 0 -140z m4705 0 l0 -140 -397 0 -398 0 0 140 0 140 398 0 397 0 0 -140z');
        logoPath.setAttribute('fill', '#C0C0C0');
        
        // Настройка fade-in анимации
        logoSvg.style.opacity = '0';
        logoSvg.style.transition = 'opacity 1.5s ease-in-out';
        
        g.appendChild(logoPath);
        logoSvg.appendChild(g);
        if (svg) {
            svg.appendChild(logoSvg);
            
            // Запускаем fade-in анимацию
            setTimeout(() => {
                logoSvg.style.opacity = '1';
            }, 100);
        }
    }
    
    // Создание вращающегося круга
    function createSpinningCircle() {
        // Удаляем старый прогресс-бар, если он существует
        const progressContainer = document.querySelector('.preloader-progress');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        
        // Создаем контейнер для спиннера
        const spinnerContainer = document.createElement('div');
        spinnerContainer.className = 'preloader-spinner';
        spinnerContainer.style.cssText = `
            width: 50px;
            height: 50px;
            margin: -100px auto 0 auto;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Создаем SVG спиннер
        const spinnerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        spinnerSvg.setAttribute('width', '50');
        spinnerSvg.setAttribute('height', '50');
        spinnerSvg.setAttribute('viewBox', '0 0 50 50');
        spinnerSvg.style.cssText = `
            animation: spin 1s linear infinite;
        `;
        
        // Создаем круг для спиннера
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '25');
        circle.setAttribute('cy', '25');
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#C0C0C0');
        circle.setAttribute('stroke-width', '3');
        circle.setAttribute('stroke-linecap', 'round');
        circle.setAttribute('stroke-dasharray', '31.416');
        circle.setAttribute('stroke-dashoffset', '23.562');
        
        spinnerSvg.appendChild(circle);
        spinnerContainer.appendChild(spinnerSvg);
        
        // Добавляем спиннер в preloader-content (после SVG)
        if (preloader && svg) {
            const preloaderContent = svg.closest('.preloader-content');
            if (preloaderContent) {
                preloaderContent.appendChild(spinnerContainer);
            } else {
                // Fallback: добавляем после SVG
                const svgContainer = svg.parentElement;
                if (svgContainer) {
                    svgContainer.appendChild(spinnerContainer);
                }
            }
        }
        
        // Добавляем CSS анимацию, если её еще нет
        if (!document.getElementById('spinner-animation-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-animation-style';
            style.textContent = `
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Смена текста
    function updateText() {
        if (preloaderText && currentTextIndex < texts.length) {
            preloaderText.style.opacity = '0';
            setTimeout(() => {
                if (preloaderText) {
                    preloaderText.textContent = texts[currentTextIndex];
                    preloaderText.style.opacity = '1';
                }
                currentTextIndex++;
            }, 300);
        }
    }
    
    // Инициализация
    if (preloader && svg) {
        createLogoAnimation();
        createSpinningCircle();
        
        // Симуляция загрузки (спиннер будет крутиться, пока не закончится загрузка)
        const loadingDuration = 2000 + Math.random() * 2000; // 2-4 секунды
        const startTime = Date.now();
        
        const loadingInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed >= loadingDuration) {
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    if (preloader) {
                        preloader.classList.add('hidden');
                        // Show scrollbar when preloader is hidden
                        document.documentElement.classList.remove('preloader-active');
                        setTimeout(() => {
                            if (preloader) {
                                preloader.style.display = 'none';
                            }
                        }, 500);
                    }
                }, 500);
            }
        }, 100);
    }
    
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