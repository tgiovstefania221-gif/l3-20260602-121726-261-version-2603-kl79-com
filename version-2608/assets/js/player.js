import { H as Hls } from './hls-vendor-dru42stk.js';

function setStatus(shell, message) {
    var status = shell.querySelector('[data-player-status]');

    if (status) {
        status.textContent = message;
    }
}

function playVideo(video, shell) {
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
            setStatus(shell, '浏览器已阻止自动播放，请再次点击播放器播放。');
        });
    }
}

function initPlayer(shell) {
    var video = shell.querySelector('[data-video-player]');
    var trigger = shell.querySelector('[data-play-trigger]');

    if (!video || !trigger) {
        return;
    }

    var source = trigger.dataset.videoSrc;
    var hlsInstance = null;
    var isReady = false;

    function prepareAndPlay() {
        trigger.classList.add('is-hidden');

        if (isReady) {
            playVideo(video, shell);
            return;
        }

        setStatus(shell, '正在加载高清播放源...');

        if (source && source.indexOf('.m3u8') !== -1 && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hlsInstance.attachMedia(video);

            hlsInstance.on(Hls.Events.MEDIA_ATTACHED, function () {
                hlsInstance.loadSource(source);
            });

            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                isReady = true;
                setStatus(shell, '播放源加载完成。');
                playVideo(video, shell);
            });

            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    setStatus(shell, '网络加载异常，正在尝试恢复...');
                    hlsInstance.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    setStatus(shell, '媒体解码异常，正在尝试恢复...');
                    hlsInstance.recoverMediaError();
                } else {
                    setStatus(shell, '播放源暂时无法加载，请稍后重试。');
                    hlsInstance.destroy();
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            isReady = true;
            setStatus(shell, '播放源加载完成。');
            playVideo(video, shell);
        } else {
            video.src = source;
            isReady = true;
            setStatus(shell, '已尝试使用浏览器原生播放器。');
            playVideo(video, shell);
        }
    }

    trigger.addEventListener('click', prepareAndPlay);

    video.addEventListener('play', function () {
        trigger.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
            trigger.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-player-shell]').forEach(initPlayer);
});
