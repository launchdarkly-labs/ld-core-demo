(function () {
    document.querySelectorAll('a[href*="smart.link"]:not([is])').forEach(function (anchor) {
        anchor.setAttribute('is', 'sxm-player-link');
        anchor.setAttribute('data-player-link', '');
    });
    document.querySelectorAll('a[href*="sxm.app.link"]:not([is])').forEach(function (anchor) {
        anchor.setAttribute('is', 'sxm-player-link');
        anchor.setAttribute('data-player-link', '');
    });
    document.querySelectorAll('a[href*="siriusxm.com/player"]:not([is])').forEach(function (anchor) {
        anchor.setAttribute('is', 'sxm-player-link');
        anchor.setAttribute('data-player-link', '');
    });
})();

(function () {
    function videoPlayerHandler(e) {
        document.querySelectorAll('video').forEach(function (video) {
            if (video !== e.target) {
                video.pause();
            }
        });
    }

    document.addEventListener('sxm-media-play', videoPlayerHandler);
})();

(function () {
    function audioPlayerHandler(e) {
        document.querySelectorAll('audio').forEach(function (audio) {
            if (audio !== e.target) {
                audio.pause();
            }
        });
    }

    document.addEventListener('sxm-media-play', audioPlayerHandler);
})();