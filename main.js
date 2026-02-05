document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("site-nav");
    const reveals = document.querySelectorAll(".reveal");
    const pointerHalo = document.querySelector(".pointer-halo");
    const countNodes = document.querySelectorAll("[data-count]");
    const yearNode = document.getElementById("current-year");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }

    const toggleHeaderState = () => {
        const isScrolled = window.scrollY > 16;
        header?.classList.toggle("is-scrolled", isScrolled);
    };

    toggleHeaderState();
    window.addEventListener("scroll", toggleHeaderState, { passive: true });

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            nav.classList.toggle("is-open", !isOpen);
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.setAttribute("aria-expanded", "false");
                nav.classList.remove("is-open");
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) {
                menuToggle.setAttribute("aria-expanded", "false");
                nav.classList.remove("is-open");
            }
        });
    }

    if (!prefersReducedMotion && pointerHalo) {
        let rafId = null;
        let pointerX = window.innerWidth / 2;
        let pointerY = window.innerHeight / 2;

        const updatePointerHalo = () => {
            pointerHalo.style.left = `${pointerX}px`;
            pointerHalo.style.top = `${pointerY}px`;
            rafId = null;
        };

        window.addEventListener("pointermove", (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;
            pointerHalo.style.opacity = "1";
            if (!rafId) {
                rafId = requestAnimationFrame(updatePointerHalo);
            }
        }, { passive: true });

        window.addEventListener("pointerleave", () => {
            pointerHalo.style.opacity = "0";
        });
    }

    if (prefersReducedMotion) {
        reveals.forEach((item) => item.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver((entries, io) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px"
        });

        reveals.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
            observer.observe(item);
        });
    }

    const animateCount = (element) => {
        const endValue = Number.parseInt(element.dataset.count || "0", 10);
        if (!Number.isFinite(endValue) || endValue <= 0) {
            return;
        }

        if (prefersReducedMotion) {
            element.textContent = String(endValue);
            return;
        }

        const duration = 1200;
        const startTime = performance.now();

        const frame = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.floor(endValue * eased));

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                element.textContent = String(endValue);
            }
        };

        requestAnimationFrame(frame);
    };

    if (countNodes.length > 0) {
        const countObserver = new IntersectionObserver((entries, io) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });

        countNodes.forEach((node) => countObserver.observe(node));
    }
});
