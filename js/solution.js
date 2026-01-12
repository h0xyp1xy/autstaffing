// Интерактивная схема решения
document.addEventListener('DOMContentLoaded', function() {
    const solutionSvg = document.querySelector('.solution-svg');
    const solutionBlocks = document.querySelectorAll('.solution-block');
    
    if (!solutionSvg) return;
    
    // Создание SVG схемы
    function createSolutionDiagram() {
        // Очистка SVG
        solutionSvg.innerHTML = '';
        
        // Определение размеров
        const width = 800;
        const height = 600;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Блок клиента (слева)
        const clientX = 150;
        const clientY = centerY;
        
        // Блок "Мы" (вверху)
        const usX = centerX;
        const usY = 100;
        
        // Блок сотрудника (справа)
        const employeeX = width - 150;
        const employeeY = centerY;
        
        // Блоки
        const clientRect = drawBlock(clientX, clientY, 180, 120, '#D4AF37', 'КЛИЕНТ');
        const usRect = drawBlock(usX - 90, usY, 180, 120, '#CD7F32', 'МЫ');
        const employeeRect = drawBlock(employeeX - 90, employeeY, 180, 120, '#B87333', 'СОТРУДНИК');
        
        // Стрелки
        // От клиента к сотруднику (золотая - управление)
        drawArrow(clientX + 90, clientY, employeeX - 90, employeeY, '#D4AF37', 4);
        
        // От "Мы" к сотруднику (пунктирная - ответственность)
        drawDashedArrow(usX, usY + 60, employeeX - 45, employeeY - 60, '#C0C0C0', 2);
        
        // От "Мы" к клиенту (ответственность)
        drawDashedArrow(usX - 45, usY + 60, clientX + 90, clientY - 60, '#C0C0C0', 2);
        
        // Текст на стрелках
        addText(clientX + 180, clientY - 10, 'УПРАВЛЕНИЕ', '12px', '#D4AF37');
        addText(usX + 30, usY + 90, 'ОТВЕТСТВЕННОСТЬ', '12px', '#C0C0C0');
    }
    
    function drawBlock(x, y, width, height, fill, text) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('rx', '8');
        rect.setAttribute('fill', fill);
        rect.setAttribute('opacity', '0.2');
        rect.setAttribute('stroke', fill);
        rect.setAttribute('stroke-width', '2');
        rect.style.cursor = 'pointer';
        rect.style.transition = 'all 0.3s ease';
        
        rect.addEventListener('mouseenter', function() {
            this.setAttribute('opacity', '0.4');
            this.setAttribute('stroke-width', '3');
        });
        
        rect.addEventListener('mouseleave', function() {
            this.setAttribute('opacity', '0.2');
            this.setAttribute('stroke-width', '2');
        });
        
        solutionSvg.appendChild(rect);
        
        // Текст внутри блока
        addText(x + width / 2, y + height / 2, text, '16px', fill, 'bold');
        
        return rect;
    }
    
    function drawArrow(x1, y1, x2, y2, stroke, width) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', stroke);
        line.setAttribute('stroke-width', width);
        line.setAttribute('marker-end', 'url(#arrowhead)');
        solutionSvg.appendChild(line);
        
        // Создание маркера стрелки
        if (!document.getElementById('arrowhead')) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'arrowhead');
            marker.setAttribute('markerWidth', '10');
            marker.setAttribute('markerHeight', '10');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '3');
            marker.setAttribute('orient', 'auto');
            
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '0 0, 10 3, 0 6');
            polygon.setAttribute('fill', stroke);
            
            marker.appendChild(polygon);
            defs.appendChild(marker);
            solutionSvg.insertBefore(defs, solutionSvg.firstChild);
        }
    }
    
    function drawDashedArrow(x1, y1, x2, y2, stroke, width) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', stroke);
        line.setAttribute('stroke-width', width);
        line.setAttribute('stroke-dasharray', '5,5');
        line.setAttribute('marker-end', 'url(#arrowhead-dashed)');
        solutionSvg.appendChild(line);
        
        // Создание маркера пунктирной стрелки
        if (!document.getElementById('arrowhead-dashed')) {
            const defs = solutionSvg.querySelector('defs');
            if (defs) {
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
                marker.setAttribute('id', 'arrowhead-dashed');
                marker.setAttribute('markerWidth', '10');
                marker.setAttribute('markerHeight', '10');
                marker.setAttribute('refX', '9');
                marker.setAttribute('refY', '3');
                marker.setAttribute('orient', 'auto');
                
                const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                polygon.setAttribute('points', '0 0, 10 3, 0 6');
                polygon.setAttribute('fill', stroke);
                
                marker.appendChild(polygon);
                defs.appendChild(marker);
            }
        }
    }
    
    function addText(x, y, text, fontSize, fill, fontWeight = 'normal') {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('dominant-baseline', 'middle');
        textEl.setAttribute('font-size', fontSize);
        textEl.setAttribute('fill', fill);
        textEl.setAttribute('font-weight', fontWeight);
        textEl.setAttribute('font-family', 'Inter, sans-serif');
        textEl.textContent = text;
        solutionSvg.appendChild(textEl);
    }
    
    // Интерактивность блоков
    solutionBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            const blockType = this.getAttribute('data-block');
            highlightBlock(blockType);
        });
        
        block.addEventListener('mouseleave', function() {
            resetHighlights();
        });
    });
    
    function highlightBlock(blockType) {
        // Подсветка соответствующего блока в SVG
        const svgElements = solutionSvg.querySelectorAll('rect, line');
        svgElements.forEach(el => {
            if (blockType === 'client' && el.getAttribute('fill') === '#D4AF37') {
                el.setAttribute('opacity', '0.5');
            } else if (blockType === 'us' && el.getAttribute('fill') === '#CD7F32') {
                el.setAttribute('opacity', '0.5');
            } else if (blockType === 'employee' && el.getAttribute('fill') === '#B87333') {
                el.setAttribute('opacity', '0.5');
            }
        });
    }
    
    function resetHighlights() {
        const svgElements = solutionSvg.querySelectorAll('rect');
        svgElements.forEach(el => {
            el.setAttribute('opacity', '0.2');
        });
    }
    
    // Инициализация диаграммы
    createSolutionDiagram();
});