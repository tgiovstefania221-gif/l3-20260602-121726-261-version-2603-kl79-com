function setupNavigation() {
  const button = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!button || !links) {
    return;
  }
  button.addEventListener("click", function () {
    links.classList.toggle("is-open");
  });
}

function setupHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }
  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  const dots = Array.from(hero.querySelectorAll(".hero-dot"));
  if (slides.length === 0) {
    return;
  }
  let current = 0;
  let timer = null;
  const show = function (index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("hero-slide-active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("hero-dot-active", dotIndex === current);
    });
  };
  const start = function () {
    timer = window.setInterval(function () {
      show(current + 1);
    }, 5200);
  };
  const stop = function () {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };
  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      stop();
      show(index);
      start();
    });
  });
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  show(0);
  start();
}

function setupFiltering() {
  const searchInput = document.querySelector(".movie-search");
  const yearSelect = document.querySelector(".year-filter");
  const cards = Array.from(document.querySelectorAll(".searchable-list .movie-card"));
  if (!searchInput || cards.length === 0) {
    return;
  }
  const apply = function () {
    const query = searchInput.value.trim().toLowerCase();
    const year = yearSelect ? yearSelect.value : "";
    cards.forEach(function (card) {
      const text = [
        card.dataset.title,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.region
      ].join(" ").toLowerCase();
      const matchQuery = !query || text.indexOf(query) !== -1;
      const matchYear = !year || card.dataset.year === year;
      card.style.display = matchQuery && matchYear ? "" : "none";
    });
  };
  searchInput.addEventListener("input", apply);
  if (yearSelect) {
    yearSelect.addEventListener("change", apply);
  }
}

function startMoviePlayer(videoId, buttonId, sourceUrl) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  if (!video || !button || !sourceUrl) {
    return;
  }
  let initialized = false;
  const play = function () {
    if (!initialized) {
      initialized = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
    }
    button.classList.add("is-hidden");
    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  };
  button.addEventListener("click", play);
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
}

setupNavigation();
setupHero();
setupFiltering();
