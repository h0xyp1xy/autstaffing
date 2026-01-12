// Анимация статистики
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStat(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString('ru-RU');
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
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