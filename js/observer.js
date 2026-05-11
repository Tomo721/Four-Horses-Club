window.addEventListener('load', function () {
    const sections = document.querySelectorAll('section');
    const stagesSection = document.querySelector('.section-stages');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target == stagesSection) {
                    const air = document.querySelector('.stages__airplane');
                    air.classList.add('visible');
                }
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(function (section) {
        observer.observe(section);
    });
});