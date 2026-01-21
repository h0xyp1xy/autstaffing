// Анимация статистики
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Ease-in-out function
    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    function animateStat(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 4000;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOut(progress);
            const current = Math.floor(easedProgress * target);
            
            if (target >= 1000) {
                element.textContent = current.toLocaleString('ru-RU');
            } else {
                element.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ensure final value is set
                if (target >= 1000) {
                    element.textContent = target.toLocaleString('ru-RU');
                } else {
                    element.textContent = target;
                }
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