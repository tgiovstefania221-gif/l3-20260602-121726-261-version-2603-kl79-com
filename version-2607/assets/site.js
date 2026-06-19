(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length) {
    var current = 0;
    var show = function(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        show(i);
      });
    });
    show(0);
    setInterval(function() {
      show(current + 1);
    }, 5600);
  }

  var filterInput = document.querySelector('[data-page-filter]');
  var yearSelect = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
  var empty = document.querySelector('[data-empty]');
  var runFilter = function() {
    var q = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var y = yearSelect ? yearSelect.value : '';
    var shown = 0;
    cards.forEach(function(card) {
      var text = [card.dataset.title, card.dataset.region, card.dataset.genre, card.dataset.year].join(' ').toLowerCase();
      var ok = (!q || text.indexOf(q) >= 0) && (!y || card.dataset.year === y);
      card.style.display = ok ? '' : 'none';
      if (ok) {
        shown += 1;
      }
    });
    if (empty) {
      empty.classList.toggle('show', shown === 0);
    }
  };
  if (filterInput) {
    filterInput.addEventListener('input', runFilter);
  }
  if (yearSelect) {
    yearSelect.addEventListener('change', runFilter);
  }
})();
