(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function initHeader() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    var topButton = document.querySelector('.back-to-top');

    function updateScroll() {
      if (header && !header.classList.contains('site-header-solid')) {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
      }
      if (topButton) {
        topButton.classList.toggle('is-visible', window.scrollY > 420);
      }
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    if (topButton) {
      topButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function initSearchForms() {
    document.querySelectorAll('[data-search-form="true"]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        if (value) {
          window.location.href = './search.html?q=' + encodeURIComponent(value);
        } else {
          window.location.href = './search.html';
        }
      });
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero="true"]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    show(0);
    restart();
  }

  function initFilterPage() {
    var page = document.querySelector('[data-filter-page="true"]');
    var grid = document.getElementById('filterGrid');
    if (!page || !grid) {
      return;
    }

    var searchInput = document.getElementById('filterSearch');
    var typeFilter = document.getElementById('typeFilter');
    var regionFilter = document.getElementById('regionFilter');
    var sortFilter = document.getElementById('sortFilter');
    var empty = document.getElementById('emptyState');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      var keyword = valueOf(searchInput);
      var type = valueOf(typeFilter);
      var region = valueOf(regionFilter);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title || '',
          card.dataset.tags || '',
          card.dataset.year || '',
          card.dataset.region || '',
          card.dataset.type || ''
        ].join(' ').toLowerCase();
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesType = !type || (card.dataset.type || '').toLowerCase() === type;
        var matchesRegion = !region || (card.dataset.region || '').toLowerCase() === region;
        var show = matchesKeyword && matchesType && matchesRegion;
        card.classList.toggle('hidden-by-filter', !show);
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    function sortCards() {
      var mode = sortFilter ? sortFilter.value : 'index';
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === 'year-desc') {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0) || Number(a.dataset.index) - Number(b.dataset.index);
        }
        if (mode === 'title') {
          return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-CN');
        }
        return Number(a.dataset.index) - Number(b.dataset.index);
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
      cards = sorted;
      applyFilter();
    }

    [searchInput, typeFilter, regionFilter].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilter);
        element.addEventListener('change', applyFilter);
      }
    });

    if (sortFilter) {
      sortFilter.addEventListener('change', sortCards);
    }

    sortCards();
  }

  ready(function () {
    initHeader();
    initSearchForms();
    initHero();
    initFilterPage();
  });
})();
