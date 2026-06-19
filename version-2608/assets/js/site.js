(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function initNavigation() {
        var toggle = qs('[data-nav-toggle]');
        var nav = qs('[data-site-nav]');

        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = qs('[data-hero]');

        if (!hero) {
            return;
        }

        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var active = 0;
        var timer = null;

        function show(index) {
            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function initFiltering() {
        var grid = qs('[data-filter-grid]');

        if (!grid) {
            return;
        }

        var panel = qs('[data-filter-panel]');
        var cards = qsa('[data-movie-card]', grid);
        var input = qs('[data-filter-input]');
        var category = qs('[data-filter-category]');
        var year = qs('[data-filter-year]');
        var region = qs('[data-filter-region]');
        var type = qs('[data-filter-type]');
        var summary = qs('[data-result-summary]');
        var empty = qs('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && input) {
            input.value = query;
        }

        function cardText(card) {
            return normalize([
                card.dataset.title,
                card.dataset.category,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type,
                card.dataset.genre,
                card.dataset.tags,
                card.textContent
            ].join(' '));
        }

        var textCache = new Map();
        cards.forEach(function (card) {
            textCache.set(card, cardText(card));
        });

        function apply() {
            var keyword = normalize(input && input.value);
            var categoryValue = normalize(category && category.value);
            var yearValue = normalize(year && year.value);
            var regionValue = normalize(region && region.value);
            var typeValue = normalize(type && type.value);
            var visible = 0;

            cards.forEach(function (card) {
                var text = textCache.get(card);
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (categoryValue && normalize(card.dataset.category) !== categoryValue) {
                    matched = false;
                }

                if (yearValue && normalize(card.dataset.year) !== yearValue) {
                    matched = false;
                }

                if (regionValue && normalize(card.dataset.region) !== regionValue) {
                    matched = false;
                }

                if (typeValue && normalize(card.dataset.type) !== typeValue) {
                    matched = false;
                }

                card.hidden = !matched;

                if (matched) {
                    visible += 1;
                }
            });

            if (summary) {
                summary.textContent = '显示 ' + visible + ' 部作品';
            }

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (panel) {
            panel.addEventListener('input', apply);
            panel.addEventListener('change', apply);
        }

        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initHero();
        initFiltering();
    });
})();
