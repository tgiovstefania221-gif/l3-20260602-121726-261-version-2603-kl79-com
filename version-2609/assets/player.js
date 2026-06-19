(function() {
  window.initStaticVideo = function(url) {
    var video = document.getElementById("movieVideo");
    var button = document.getElementById("playButton");
    var attached = false;

    if (!video || !url) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function start() {
      attach();
      if (button) {
        button.classList.add("hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function() {});
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("click", function() {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", function() {
      if (button) {
        button.classList.add("hidden");
      }
    });

    video.addEventListener("pause", function() {
      if (button && video.currentTime === 0) {
        button.classList.remove("hidden");
      }
    });
  };
})();
