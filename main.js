document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Auto-apply animation classes to key elements
    const updateElements = [
        '.hero-text h1',
        '.hero-text p',
        '.hero-actions',
        '.stat-card',
        '.section-header',
        '.comp-card',
        '.service-card',
        '.team-member',
        '.cta h2'
    ];

    updateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal-text');
            // Add staggered delay via inline style for grid items
            if (el.classList.contains('service-card') || el.classList.contains('team-member')) {
                el.style.transitionDelay = `${index % 3 * 0.1}s`;
            }
            observer.observe(el);
        });
    });

    // Parallax Effect for Hero
    const heroVisual = document.querySelector('.hero-image-container');
    document.addEventListener('mousemove', (e) => {
        if (!heroVisual) return;
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        // subtle shift
        heroVisual.style.transform = `perspective(1000px) rotateY(${x * 0.05}deg) rotateX(${y * 0.05}deg)`;
    });

});
