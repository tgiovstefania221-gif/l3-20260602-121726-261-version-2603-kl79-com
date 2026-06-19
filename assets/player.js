(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupPlayer(container) {
    var video = container.querySelector('video[data-src]');
    var playButton = container.querySelector('[data-player-play]');
    var hlsInstance = null;
    var initialized = false;

    if (!video) {
      return;
    }

    function initSource() {
      if (initialized) {
        return;
      }
      initialized = true;
      var source = video.getAttribute('data-src');
      if (!source) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        container.classList.add('is-ready');
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          container.classList.add('is-ready');
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hlsInstance) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
            } else {
              hlsInstance.destroy();
              hlsInstance = null;
              video.src = source;
            }
          }
        });
        return;
      }
      video.src = source;
      container.classList.add('is-ready');
    }

    function playVideo() {
      initSource();
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          container.classList.remove('is-playing');
        });
      }
    }

    if (playButton) {
      playButton.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      container.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      container.classList.remove('is-playing');
    });

    video.addEventListener('ended', function () {
      container.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(setupPlayer);
  });
}());
