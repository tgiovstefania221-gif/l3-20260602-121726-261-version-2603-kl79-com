import { H as Hls } from './hls-vendor.js';

(function() {
  var box = document.querySelector('[data-video]');
  if (!box) {
    return;
  }
  var video = box.querySelector('video');
  var mask = box.querySelector('[data-play-mask]');
  var source = box.getAttribute('data-video');
  var ready = false;
  var hls = null;

  function attach() {
    if (ready || !video || !source) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function start() {
    attach();
    if (mask) {
      mask.hidden = true;
    }
    video.controls = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function() {
        if (mask) {
          mask.hidden = false;
        }
      });
    }
  }

  if (mask) {
    mask.addEventListener('click', start);
  }
  if (video) {
    video.addEventListener('click', function() {
      if (!ready) {
        start();
      }
    });
  }
  window.addEventListener('pagehide', function() {
    if (hls) {
      hls.destroy();
    }
  });
})();
