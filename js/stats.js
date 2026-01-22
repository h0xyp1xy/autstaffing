// Анимация статистики
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Ease-out function
    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function animateStat(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 3000;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            const current = Math.floor(easedProgress * target);
            
            let displayValue;
            if (target >= 1000) {
                displayValue = current.toLocaleString('ru-RU');
            } else {
                displayValue = current.toString();
            }
            element.textContent = displayValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ensure final value is set
                let finalValue;
                if (target >= 1000) {
                    finalValue = target.toLocaleString('ru-RU');
                } else {
                    finalValue = target.toString();
                }
                element.textContent = finalValue + suffix;
            }
        }
        
        update();
    }
    
    // Анимация при скролле
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateStat(statNumber);
                }
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        const statItem = stat.closest('.stat-item');
        if (statItem) {
            observer.observe(statItem);
        }
    });
});