(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        initSlider();
    }

    function initSlider() {
        let isInitialized = false;
        let originalCardsHTML = '';
        let currentSlide = 0;
        let totalSlides = 5;

        function checkScreenWidth() {
            if (window.innerWidth <= 768) {
                initMobileLayout();
            } else {
                restoreOriginalLayout();
            }
        }

        function initMobileLayout() {
            if (isInitialized) return;

            const cardsContainer = document.querySelector('.stages .cards');
            if (!cardsContainer) return;

            if (!originalCardsHTML) {
                originalCardsHTML = cardsContainer.innerHTML;
            }

            const allCards = Array.from(cardsContainer.querySelectorAll('.cards-item'));

            cardsContainer.innerHTML = '';

            const slidesConfig = [
                { items: [0, 1] },
                { items: [2] },
                { items: [3, 4] },
                { items: [5] },
                { items: [6] }
            ];

            slidesConfig.forEach((config, index) => {
                const slideWrapper = document.createElement('div');
                slideWrapper.className = 'slide-wrapper';
                slideWrapper.setAttribute('data-slide-index', index);

                config.items.forEach(cardIndex => {
                    if (allCards[cardIndex]) {
                        const cardClone = allCards[cardIndex].cloneNode(true);
                        slideWrapper.appendChild(cardClone);
                    }
                });

                cardsContainer.appendChild(slideWrapper);
            });

            setupNavigation();

            isInitialized = true;
            updateActiveDot();
            updateButtonsState();
        }

        function restoreOriginalLayout() {
            if (!isInitialized) return;

            const cardsContainer = document.querySelector('.stages .cards');
            if (cardsContainer && originalCardsHTML) {
                cardsContainer.innerHTML = originalCardsHTML;
            }

            isInitialized = false;
        }

        function setupNavigation() {
            const cardsContainer = document.querySelector('.stages .cards');
            const prevBtn = document.querySelector('.slider-stage-btn-prev');
            const nextBtn = document.querySelector('.slider-stage-btn-next');
            const dotsContainer = document.querySelector('.slider-dots');

            if (!cardsContainer || !prevBtn || !nextBtn) return;

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'slider-dot';
                    dot.setAttribute('data-slide', i);
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
            }

            prevBtn.onclick = () => goToSlide(currentSlide - 1);
            nextBtn.onclick = () => goToSlide(currentSlide + 1);
        }

        function goToSlide(slideIndex) {
            if (slideIndex < 0 || slideIndex >= totalSlides) return;

            currentSlide = slideIndex;

            const cardsContainer = document.querySelector('.stages .cards');
            if (cardsContainer) {
                const slideWidth = cardsContainer.offsetWidth;
                cardsContainer.scrollTo({
                    left: slideWidth * currentSlide,
                    behavior: 'smooth'
                });
            }

            updateActiveDot();
            updateButtonsState();
        }

        function updateActiveDot() {
            const dots = document.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function updateButtonsState() {
            const prevBtn = document.querySelector('.slider-stage-btn-prev');
            const nextBtn = document.querySelector('.slider-stage-btn-next');

            if (!prevBtn || !nextBtn) return;

            if (currentSlide === 0) {
                prevBtn.classList.add('slider-stage-btn-disabled');
            } else {
                prevBtn.classList.remove('slider-stage-btn-disabled');
            }

            if (currentSlide === totalSlides - 1) {
                nextBtn.classList.add('slider-stage-btn-disabled');
            } else {
                nextBtn.classList.remove('slider-stage-btn-disabled');
            }
        }

        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                checkScreenWidth();
            }, 100);
        });

        checkScreenWidth();
    }
})();