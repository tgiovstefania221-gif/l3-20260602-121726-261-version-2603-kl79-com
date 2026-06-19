(function() {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function() {
    var header = document.querySelector(".site-header");
    var mobileToggle = document.querySelector(".mobile-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    function updateHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (mobileToggle && mobilePanel) {
      mobileToggle.addEventListener("click", function() {
        mobilePanel.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        showSlide(parseInt(dot.getAttribute("data-slide"), 10) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        showSlide(current + 1);
      }, 5600);
    }

    var queryInputs = Array.prototype.slice.call(document.querySelectorAll(".js-filter-input"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".js-card"));
    var emptyTip = document.querySelector(".empty-tip");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    function filterCards(value) {
      var q = String(value || "").trim().toLowerCase();
      var visible = 0;
      cards.forEach(function(card) {
        var text = card.getAttribute("data-filter") || card.textContent.toLowerCase();
        var matched = !q || text.indexOf(q) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (emptyTip) {
        emptyTip.classList.toggle("show", cards.length > 0 && visible === 0);
      }
    }

    queryInputs.forEach(function(input) {
      if (initialQuery && input.classList.contains("js-query-input")) {
        input.value = initialQuery;
      }
      input.addEventListener("input", function() {
        filterCards(input.value);
      });
    });

    if (initialQuery) {
      filterCards(initialQuery);
    }
  });
})();
