(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var textInput = scope.querySelector('[data-filter-text]');
      var regionSelect = scope.querySelector('[data-filter-region]');
      var typeSelect = scope.querySelector('[data-filter-type]');
      var yearSelect = scope.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var empty = scope.querySelector('[data-filter-empty]');

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function matches(card, query, region, type, year) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        var regionValue = card.getAttribute('data-region') || '';
        var typeValue = card.getAttribute('data-type') || '';
        var yearValue = card.getAttribute('data-year') || '';
        return (!query || text.indexOf(query) !== -1) &&
          (!region || regionValue === region) &&
          (!type || typeValue === type) &&
          (!year || yearValue === year);
      }

      function apply() {
        var query = normalize(textInput && textInput.value);
        var region = regionSelect ? regionSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;
        cards.forEach(function (card) {
          var ok = matches(card, query, region, type, year);
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [textInput, regionSelect, typeSelect, yearSelect].forEach(function (field) {
        if (!field) {
          return;
        }
        field.addEventListener('input', apply);
        field.addEventListener('change', apply);
      });
    });
  }

  function setupSearchPage() {
    var root = document.querySelector('[data-search-root]');
    if (!root || !window.MOVIE_SEARCH_DATA) {
      return;
    }
    var input = root.querySelector('[data-search-input]');
    var button = root.querySelector('[data-search-button]');
    var results = root.querySelector('[data-search-results]');
    var status = root.querySelector('[data-search-status]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function card(movie) {
      var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return '<article class="movie-card">' +
        '<a class="poster-link" href="./' + escapeHtml(movie.file) + '" aria-label="观看' + escapeHtml(movie.title) + '">' +
        '<img src="' + escapeHtml(movie.cover) + '" alt="《' + escapeHtml(movie.title) + '》" loading="lazy">' +
        '<span class="poster-overlay"></span>' +
        '<span class="poster-play">▶</span>' +
        '<span class="poster-badge">' + escapeHtml(movie.region) + '</span>' +
        '<span class="poster-year">' + escapeHtml(movie.year) + '</span>' +
        '</a>' +
        '<div class="movie-card-body">' +
        '<a class="movie-title" href="./' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a>' +
        '<p>' + escapeHtml(movie.oneLine) + '</p>' +
        '<div class="movie-tags">' + tags + '</div>' +
        '<div class="card-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>' +
        '</div>' +
        '</article>';
    }

    function render() {
      var query = normalize(input.value);
      var source = window.MOVIE_SEARCH_DATA;
      var list = source.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.oneLine,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        return !query || haystack.indexOf(query) !== -1;
      }).slice(0, 120);
      results.innerHTML = list.map(card).join('');
      if (query) {
        status.textContent = list.length ? '已显示匹配的影片结果。' : '没有找到匹配的影片。';
      } else {
        status.textContent = '输入关键词开始筛选影片。';
      }
    }

    input.addEventListener('input', render);
    if (button) {
      button.addEventListener('click', render);
    }
    render();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
}());
