document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("site-nav");
    const revealItems = document.querySelectorAll(".reveal");
    const yearNode = document.getElementById("current-year");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }

    let lastY = window.scrollY;
    let scrollTicking = false;

    const applyHeaderState = () => {
        if (header) {
            header.classList.toggle("scrolled", lastY > 12);
        }
        scrollTicking = false;
    };

    window.addEventListener("scroll", () => {
        lastY = window.scrollY;
        if (!scrollTicking) {
            window.requestAnimationFrame(applyHeaderState);
            scrollTicking = true;
        }
    }, { passive: true });

    applyHeaderState();

    if (menuToggle && nav) {
        const closeMenu = () => {
            menuToggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("open");
        };

        menuToggle.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!expanded));
            nav.classList.toggle("open", !expanded);
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof Node)) {
                return;
            }

            if (!nav.contains(target) && !menuToggle.contains(target)) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) {
                closeMenu();
            }
        });
    }

    if (revealItems.length === 0) {
        return;
    }

    if (reducedMotion) {
        revealItems.forEach((item) => item.classList.add("visible"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 28, 210)}ms`;
        revealObserver.observe(item);
    });
});
