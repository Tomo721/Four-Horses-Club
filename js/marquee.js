(function () {
    function cloneMarquee(sourceMarquee) {
        const clone = sourceMarquee.cloneNode(true);
        return clone;
    }

    function initMarquee(marquee) {
        const inner = marquee.querySelector('.marquee__inner');
        if (!inner) return;

        const originalSpans = Array.from(inner.children);

        originalSpans.forEach(span => {
            const clone = span.cloneNode(true);
            inner.appendChild(clone);
        });

        let currentPosition = 0;
        let animationId = null;
        let speed = 1;
        let isPaused = false;
        let halfWidth = 0;

        function updateWidth() {
            halfWidth = inner.scrollWidth / 2;
        }

        function animate() {
            if (!isPaused) {
                currentPosition -= speed;

                if (Math.abs(currentPosition) >= halfWidth) {
                    currentPosition = currentPosition + halfWidth;
                }

                inner.style.transform = `translateX(${currentPosition}px)`;
            }
            animationId = requestAnimationFrame(animate);
        }

        marquee.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        marquee.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        window.addEventListener('resize', () => {
            updateWidth();
        });

        updateWidth();
        animate();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const originalMarquee = document.querySelector('.marquee');
        if (!originalMarquee) return;

        const banner = document.querySelector('.section-banner');
        if (banner) {
            const topMarquee = cloneMarquee(originalMarquee);
            banner.insertAdjacentElement('afterend', topMarquee);
            initMarquee(topMarquee);
        }

        const footer = document.querySelector('footer');
        if (footer) {
            const bottomMarquee = cloneMarquee(originalMarquee);
            footer.insertAdjacentElement('beforebegin', bottomMarquee);
            initMarquee(bottomMarquee);
        }

        originalMarquee.remove();
    });
})();