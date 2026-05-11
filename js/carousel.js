(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const carousel = document.querySelector('[data-carousel]');
        if (!carousel) return;

        const container = carousel.querySelector('[data-carousel-container]');
        if (!container) return;

        const prevBtn = document.querySelector('[data-carousel-prev]');
        const nextBtn = document.querySelector('[data-carousel-next]');

        const currentSpan = document.querySelector('.carousel-visible-value');
        const totalSpan = document.querySelector('.carousel-total-value');

        let originalSlides = Array.from(container.children).filter(child => child.classList?.contains('carousel__slide'));
        if (originalSlides.length === 0) return;

        let slidesPerView = getSlidesPerView();
        let currentRealIndex = 0;
        let currentIndex = slidesPerView;
        let autoplayInterval = null;
        const AUTOPLAY_DELAY = 4000;

        function getSlidesPerView() {
            const width = window.innerWidth;
            if (width >= 1024) return 3;
            if (width >= 768) return 2;
            return 1;
        }

        function updateCounter() {
            if (!currentSpan) return;

            if (slidesPerView === 1) {
                currentSpan.textContent = currentRealIndex + 1;
            } else {
                currentSpan.textContent = slidesPerView;
            }

            if (totalSpan) {
                totalSpan.textContent = originalSlides.length;
            }
        }

        function updateRealIndex() {
            let rawIndex = currentIndex - slidesPerView;
            const totalReal = originalSlides.length;
            rawIndex = ((rawIndex % totalReal) + totalReal) % totalReal;
            currentRealIndex = rawIndex;
        }

        function setupClones() {
            const total = originalSlides.length;
            container.innerHTML = '';
            originalSlides.forEach(slide => container.appendChild(slide));

            for (let i = 0; i < slidesPerView; i++) {
                const clone = originalSlides[i].cloneNode(true);
                clone.classList.add('carousel__clone');
                container.appendChild(clone);
            }
            for (let i = total - slidesPerView; i < total; i++) {
                const clone = originalSlides[i].cloneNode(true);
                clone.classList.add('carousel__clone');
                container.insertBefore(clone, container.firstChild);
            }
        }

        function getSlideWidth() {
            const slide = container.querySelector('.carousel__slide');
            return slide ? slide.clientWidth : 0;
        }

        function updateTransform(useTransition = true) {
            const slideWidth = getSlideWidth();
            if (!slideWidth) return;
            const offset = -currentIndex * slideWidth;
            container.style.transition = useTransition ? 'transform 0.3s ease' : 'none';
            container.style.transform = `translateX(${offset}px)`;
        }

        function handleInfiniteTransition() {
            const totalReal = originalSlides.length;
            const minIndex = slidesPerView;
            const maxIndex = minIndex + totalReal - 1;

            if (currentIndex < minIndex) {
                const diff = minIndex - currentIndex;
                currentIndex = maxIndex - diff + 1;
                updateTransform(false);
                void container.offsetHeight;
                updateTransform(true);
            } else if (currentIndex > maxIndex) {
                const diff = currentIndex - maxIndex;
                currentIndex = minIndex + diff - 1;
                updateTransform(false);
                void container.offsetHeight;
                updateTransform(true);
            }
            updateRealIndex();
            updateCounter();
        }

        function nextSlide() {
            currentIndex++;
            updateTransform(true);
            resetAutoplay();
            updateRealIndex();
            updateCounter();
        }

        function prevSlide() {
            currentIndex--;
            updateTransform(true);
            resetAutoplay();
            updateRealIndex();
            updateCounter();
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                nextSlide();
            }, AUTOPLAY_DELAY);
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        function pauseOnHover() {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
        }

        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newSlidesPerView = getSlidesPerView();
                if (newSlidesPerView !== slidesPerView) {
                    slidesPerView = newSlidesPerView;
                    rebuildCarousel();
                }
            }, 150);
        }

        function rebuildCarousel() {
            stopAutoplay();
            const allChildren = Array.from(container.children);
            allChildren.forEach(child => {
                if (child.classList?.contains('carousel__clone')) child.remove();
            });
            originalSlides = Array.from(container.children).filter(child => child.classList?.contains('carousel__slide'));
            slidesPerView = getSlidesPerView();
            currentIndex = slidesPerView;
            setupClones();
            updateTransform(false);
            setTimeout(() => {
                updateTransform(true);
                startAutoplay();
            }, 20);
            updateRealIndex();
            updateCounter();
        }

        function init() {
            setupClones();
            currentIndex = slidesPerView;
            updateTransform(false);
            setTimeout(() => updateTransform(true), 20);
            startAutoplay();
            pauseOnHover();
            updateRealIndex();
            updateCounter();

            container.addEventListener('transitionend', handleInfiniteTransition);

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    prevSlide();
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    nextSlide();
                });
            }

            window.addEventListener('resize', handleResize);
        }

        init();
    });
})();
