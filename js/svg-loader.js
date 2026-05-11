(function () {
    function loadSvgSprite() {
        fetch('assets/icons/sprite.svg')
            .then(response => {
                if (!response.ok) throw new Error('SVG sprite not found');
                return response.text();
            })
            .then(svgText => {
                document.body.insertAdjacentHTML('afterbegin', svgText);
            })
            .catch(error => console.error('Не удалось загрузить спрайт:', error));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSvgSprite);
    } else {
        loadSvgSprite();
    }
})();