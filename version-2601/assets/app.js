(function() {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function() {
      mobileNav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    active = (index + slides.length) % slides.length;

    slides.forEach(function(slide, i) {
      slide.classList.toggle("active", i === active);
    });

    dots.forEach(function(dot, i) {
      dot.classList.toggle("active", i === active);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function() {
      showSlide(active + 1);
    }, 5200);
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach(function(panel) {
    var scopeName = panel.getAttribute("data-filter-panel");
    var scope = document.querySelector('[data-filter-scope="' + scopeName + '"]');
    var empty = document.querySelector('[data-filter-empty="' + scopeName + '"]');

    if (!scope) {
      return;
    }

    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-title]"));
    var search = panel.querySelector("[data-filter-search]");
    var year = panel.querySelector("[data-filter-year]");
    var type = panel.querySelector("[data-filter-type]");

    function applyFilter() {
      var text = normalizeText(search && search.value);
      var yearValue = year && year.value ? year.value : "";
      var typeValue = type && type.value ? type.value : "";
      var visible = 0;

      cards.forEach(function(card) {
        var matchText = !text || normalizeText(card.getAttribute("data-title")).indexOf(text) !== -1;
        var matchYear = !yearValue || String(card.getAttribute("data-year")) === yearValue;
        var matchType = !typeValue || String(card.getAttribute("data-type")) === typeValue;
        var show = matchText && matchYear && matchType;

        card.style.display = show ? "" : "none";
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }

    [search, year, type].forEach(function(control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });
  });

  function initPlayer(box) {
    var video = box.querySelector("video");
    var overlay = box.querySelector(".play-overlay");
    var source = box.getAttribute("data-src");
    var started = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function playVideo() {
      if (!started) {
        started = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new Hls({
            maxBufferLength: 30
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      if (overlay) {
        overlay.classList.add("hidden");
      }

      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function() {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", playVideo);
    }

    video.addEventListener("click", function() {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener("play", function() {
      if (overlay) {
        overlay.classList.add("hidden");
      }
    });

    video.addEventListener("ended", function() {
      if (overlay) {
        overlay.classList.remove("hidden");
      }
    });

    window.addEventListener("pagehide", function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(initPlayer);
})();
