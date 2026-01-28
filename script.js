document.addEventListener("DOMContentLoaded", () => {

    /* ===== MOBILE MENU ===== */
    const menuBtn = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            // Switch icon between hamburger and close
            menuBtn.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
        });
    }

    /* ===== TITLE SCROLL ===== */
    let originalTitle = document.title + " | ";
    let titleText = originalTitle;
    let titleInterval = null;

    function startScroll() {
        if (titleInterval) return;
        titleInterval = setInterval(() => {
            titleText = titleText.substring(1) + titleText[0];
            document.title = titleText;
        }, 300);
    }

    function stopScroll() {
        clearInterval(titleInterval);
        titleInterval = null;
        document.title = originalTitle.trim().replace(" |", "");
    }

    document.addEventListener("visibilitychange", () => {
        document.hidden ? startScroll() : stopScroll();
    });

    /* ===== SLIDESHOW ===== */
    const slides = document.querySelectorAll(".slide");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const playPauseBtn = document.querySelector(".play-pause");

    if (slides.length > 0) {
        let current = 0;
        let interval = null;
        let isPlaying = true;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove("active"));
            slides[index].classList.add("active");
        }

        function nextSlide() {
            current = (current + 1) % slides.length;
            showSlide(current);
        }

        function prevSlide() {
            current = (current - 1 + slides.length) % slides.length;
            showSlide(current);
        }

        function startAutoPlay() {
            if (interval) clearInterval(interval);
            interval = setInterval(nextSlide, 4000);
            if (playPauseBtn) playPauseBtn.textContent = "Pause";
            isPlaying = true;
        }

        function stopAutoPlay() {
            clearInterval(interval);
            interval = null;
            if (playPauseBtn) playPauseBtn.textContent = "Play";
            isPlaying = false;
        }

        nextBtn?.addEventListener("click", () => {
            stopAutoPlay();
            nextSlide();
            // Optional: Restart autoplay after manual interaction
            // startAutoPlay(); 
        });

        prevBtn?.addEventListener("click", () => {
            stopAutoPlay();
            prevSlide();
        });

        playPauseBtn?.addEventListener("click", () => {
            isPlaying ? stopAutoPlay() : startAutoPlay();
        });

        // Initialize
        startAutoPlay();
    }

    /* ===== COUNTER ANIMATION ===== */
    const statsSection = document.querySelector(".stats-grid");
    const counters = document.querySelectorAll(".stat-number");

    if (statsSection && counters.length > 0) {
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.dataset.target;
                const duration = 2000; // Total animation time in ms
                const increment = target / (duration / 20); // Calculate step
                
                let currentCount = 0;
                
                const update = setInterval(() => {
                    currentCount += increment;
                    if (currentCount >= target) {
                        counter.innerText = target;
                        clearInterval(update);
                    } else {
                        counter.innerText = Math.ceil(currentCount);
                    }
                }, 20);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    observer.disconnect(); // Run only once
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(statsSection);
    }
});

/* ===== SLIDESHOW LOGIC (With Swipe) ===== */
const slideshowContainer = document.querySelector(".slideshow-container");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (slides.length > 0) {
    let current = 0;
    let slideInterval;

    // --- Core Functions ---
    function showSlide(index) {
        if (index >= slides.length) current = 0;
        else if (index < 0) current = slides.length - 1;
        else current = index;

        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        slides[current].classList.add("active");
        if (dots[current]) dots[current].classList.add("active");
    }

    function nextSlide() {
        showSlide(current + 1);
    }

    function prevSlide() {
        showSlide(current - 1);
    }

    function startAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); 
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // --- Click Listeners ---
    nextBtn?.addEventListener("click", () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    prevBtn?.addEventListener("click", () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    // --- SWIPE LOGIC FOR MOBILE ---
    let touchStartX = 0;
    let touchEndX = 0;

    slideshowContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay(); // Pause while swiping
    }, {passive: true});

    slideshowContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay(); // Resume after swipe
    }, {passive: true});

    function handleSwipe() {
        // threshold: minimum distance required to be considered a swipe
        const threshold = 50; 
        
        if (touchStartX - touchEndX > threshold) {
            // Swiped Left -> Next Slide
            nextSlide();
        } 
        
        if (touchEndX - touchStartX > threshold) {
            // Swiped Right -> Prev Slide
            prevSlide();
        }
    }

    // Initialize
    startAutoPlay();
}