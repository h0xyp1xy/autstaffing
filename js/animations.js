// GSAP анимации и скролл-эффекты
document.addEventListener('DOMContentLoaded', function() {
    // Регистрация плагина ScrollTrigger
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Анимация появления секций
    function initScrollAnimations() {
        // Анимация преимуществ
        const advantageCards = document.querySelectorAll('.advantage-card');
        advantageCards.forEach((card, index) => {
            gsap.fromTo(card, 
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        end: 'top 50%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Анимация карточек результатов
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    scale: 0.8,
                    rotationY: -15
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Анимация CTA карточек
        const ctaCards = document.querySelectorAll('.cta-card');
        ctaCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Анимация timeline процесса с изображениями
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const timelineImage = item.querySelector('.timeline-image');
            const timelineContent = item.querySelector('.timeline-content');
            const timelineIcon = item.querySelector('.timeline-icon');
            
            // Анимация текстовой части
            gsap.fromTo([timelineIcon, timelineContent],
                {
                    opacity: 0,
                    x: -50
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
            
            // Анимация изображения с задержкой
            if (timelineImage) {
                gsap.fromTo(timelineImage,
                    {
                        opacity: 0,
                        scale: 0.7,
                        x: 50
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        duration: 1,
                        delay: 0.3,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 75%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
            
            // Старая анимация для совместимости
            gsap.fromTo(item,
                {
                    opacity: 0,
                    x: -50
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                        onEnter: () => {
                            item.classList.add('active');
                        },
                        onLeaveBack: () => {
                            item.classList.remove('active');
                        }
                    }
                }
            );
        });
        
        // Параллакс для hero-секции
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            gsap.to(heroVideo, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }
    
    // Анимация чисел в результатах (odometer effect)
    function animateNumbers() {
        const metricValues = document.querySelectorAll('.metric-value');
        
        metricValues.forEach(valueEl => {
            const text = valueEl.textContent;
            const number = parseInt(text.replace(/[^\d]/g, ''));
            
            if (number && !isNaN(number)) {
                ScrollTrigger.create({
                    trigger: valueEl,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.fromTo({ value: 0 },
                            {
                                value: number,
                                duration: 4,
                                ease: 'power2.out',
                                onUpdate: function() {
                                    const current = Math.round(this.targets()[0].value);
                                    valueEl.textContent = current.toLocaleString('ru-RU') + (text.includes('%') ? '%' : '');
                                }
                            }
                        );
                    }
                });
            }
        });
    }
    
    // Инициализация всех анимаций
    if (typeof gsap !== 'undefined') {
        initScrollAnimations();
        animateNumbers();
    }
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Активная секция в навигации
    function updateActiveNavSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavSection);
    updateActiveNavSection();

    // Hover animation for the phone button in the header
    const phoneLinkTop = document.querySelector('.phone-link-top');
    if (phoneLinkTop) {
        const hoverDuration = 0.2;
        const hoverEase = 'power2.out';

        phoneLinkTop.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(phoneLinkTop, {
                    backgroundColor: 'rgba(255, 106, 0, 0.1)',
                    duration: hoverDuration,
                    ease: hoverEase,
                    overwrite: true
                });
            } else {
                phoneLinkTop.style.backgroundColor = 'rgba(255, 106, 0, 0.1)';
            }
        });

        phoneLinkTop.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(phoneLinkTop, {
                    backgroundColor: 'rgba(13, 13, 13, 1)', // Assuming var(--bg-primary) is dark
                    duration: hoverDuration,
                    ease: hoverEase,
                    overwrite: true
                });
            } else {
                phoneLinkTop.style.backgroundColor = '';
            }
        });
    }

    // Hover animation for CTA buttons (same as phone button)
    const ctaButtons = document.querySelectorAll('.btn-primary');
    if (ctaButtons.length > 0) {
        const hoverDuration = 0.2;
        const hoverEase = 'power2.out';

        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        backgroundColor: 'rgba(255, 106, 0, 0.2)',
                        duration: hoverDuration,
                        ease: hoverEase,
                        overwrite: true
                    });
                } else {
                    button.style.backgroundColor = 'rgba(255, 106, 0, 0.2)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        backgroundColor: 'rgba(13, 13, 13, 1)', // var(--bg-primary)
                        duration: hoverDuration,
                        ease: hoverEase,
                        overwrite: true
                    });
                } else {
                    button.style.backgroundColor = '';
                }
            });
        });
    }
});