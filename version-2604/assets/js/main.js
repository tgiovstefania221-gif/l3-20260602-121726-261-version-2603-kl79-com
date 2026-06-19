(function() {
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function() {
      nav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });

    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector("[data-search-input]");
  var typeSelect = document.querySelector("[data-type-select]");
  var yearSelect = document.querySelector("[data-year-select]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }

    var keyword = normalize(searchInput && searchInput.value);
    var type = normalize(typeSelect && typeSelect.value);
    var year = normalize(yearSelect && yearSelect.value);

    cards.forEach(function(card) {
      var text = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-genre"));
      var cardType = normalize(card.getAttribute("data-type"));
      var cardYear = normalize(card.getAttribute("data-year"));
      var matched = true;

      if (keyword && text.indexOf(keyword) === -1) {
        matched = false;
      }

      if (type && cardType !== type) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      card.classList.toggle("hidden-by-filter", !matched);
    });
  }

  [searchInput, typeSelect, yearSelect].forEach(function(control) {
    if (control) {
      control.addEventListener("input", applyFilter);
      control.addEventListener("change", applyFilter);
    }
  });
})();
