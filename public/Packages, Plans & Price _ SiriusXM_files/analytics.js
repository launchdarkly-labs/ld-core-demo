(function () {
    function pushToAdobe(trackData) {
        if (adobeDataLayer) {
            adobeDataLayer.push(trackData);

            if (location.search.indexOf('analyticsdebug=true') >= 0) {
                console.log('Pushed Tracking Data:', trackData, ' - adobeDataLayer: ', adobeDataLayer);
            }
        }
    }

    window.pushToAdobe = pushToAdobe;

    var body = document.querySelector('body');

    var metaAnalyticsPageName = document.querySelector('meta[name="sxm:analyticsPageName"]');
    var metaPageType = document.querySelector('meta[name="sxm:analyticsPageType"]');

    var analyticsPageName = metaAnalyticsPageName ? metaAnalyticsPageName.getAttribute('content') : '';
    var pageType = metaPageType ? metaPageType.getAttribute('content') : '';

    var flowTypeElement = document.querySelector('[data-flowtype]');

    var flowType = flowTypeElement
        ? flowTypeElement.getAttribute('data-flowtype')
        : '';

    var flowInfo = flowType
        ? {
            metaData: {
                type: flowType.toLowerCase(),
            },
        }
        : undefined;

    var pageInfo = {
        pageName: analyticsPageName,
        pageType: pageType,
        programCode: '',
    };

    /*** PULSE ***/
    var pulsePageAttributes = ['category', 'subcategory'];
    pulsePageAttributes.forEach(function (attr) {
        var value = body.getAttribute('data-' + attr);
        if (value) {
            pageInfo = { ...pageInfo, [attr]: value };
        }
    });

    pushToAdobe({
        event: 'page-loaded',
        pageInfo: pageInfo,
        audioInfo: audioInfo,
        offerInfo: offerInfo,
        videoInfo: videoInfo,
        ...(flowInfo ? { flowInfo } : {}),
    });

    window._sxmDataLayerPush = function (event, data, includePageInfo) {
        const sxmData = {
            ...data,
            event,
            pageInfo,
        };

        pushToAdobe(sxmData);
    };

    /*** AUDIO ***/
    var audioNames = [];
    document.querySelectorAll('audio').forEach(function (audioPlayer) {
        if (audioPlayer) {
            var name = audioPlayer.getAttribute('data-audioplayer');
            var time = audioPlayer.currentTime;
            var componenttype = audioPlayer.closest('body,[data-componenttype]');
            var position = componenttype
                ? componenttype.getAttribute('data-componenttype').replace(/[\W_]+/g, '')
                : 'Content';

            var isVisible = audioPlayer.offsetWidth > 0 || audioPlayer.offsetHeight > 0;
            if (name && isVisible) {
                audioNames.push(name);
            }

            var analytics = {
                audioInfo: {
                    name: name,
                    time: time,
                },
                clickInfo: {
                    pageName: analyticsPageName,
                    position: position || 'Content',
                    linkKey: position || 'Content',
                    type: 'ui',
                },
            };

            window._sxmDataLayerPush('audio-impression', analytics);

            audioPlayer.addEventListener('sxm-media-play', function () {
                analytics.audioInfo.time = audioPlayer.currentTime;
                analytics.clickInfo.name = 'play';
                window._sxmDataLayerPush('audio-start', analytics);
            });

            audioPlayer.addEventListener('sxm-media-pause', function () {
                analytics.audioInfo.time = audioPlayer.currentTime;
                analytics.clickInfo.name = 'pause';
                window._sxmDataLayerPush('audio-pause', analytics);
            });

            audioPlayer.addEventListener('sxm-media-complete', function () {
                analytics.audioInfo.time = audioPlayer.currentTime;
                analytics.clickInfo.name = 'complete';
                window._sxmDataLayerPush('audio-complete', analytics);
            });

            audioPlayer.addEventListener('sxm-media-backward', function () {
                analytics.audioInfo.time = audioPlayer.currentTime;
                analytics.clickInfo.name = 'backward';
                window._sxmDataLayerPush('audio-backward', analytics);
            });

            audioPlayer.addEventListener('sxm-media-forward', function () {
                analytics.audioInfo.time = audioPlayer.currentTime;
                analytics.clickInfo.name = 'forward';
                window._sxmDataLayerPush('audio-forward', analytics);
            });
        }
    });

    var audioInfo = {
        name: audioNames.join(' | '),
        time: '0',
    };

    /*** VIDEO ***/
    function bindVideo(video) {
        if (video) {
            var source = video.querySelector('source');

            if (source) {
                console.log('binding video', source);
                var name = source.getAttribute('src');
                var time = video.currentTime;
                var isVisible = video.offsetWidth > 0 || video.offsetHeight > 0;

                if (name && name.indexOf('background') === -1) {
                    var componenttype = video.closest('body,[data-componenttype]');
                    var position = componenttype
                        ? componenttype.getAttribute('data-componenttype').replace(/[\W_]+/g, '')
                        : 'Content';

                    if (isVisible) {
                        videoNames.push(name);
                    }

                    var analytics = {
                        clickInfo: {
                            name: name,
                            position: position || 'Content',
                            linkKey: position || 'Content',
                            type: 'ui',
                        },
                        videoInfo: {
                            name: name,
                            time: time,
                        },
                    };

                    video.addEventListener('sxm-media-play', function () {
                        analytics.clickInfo.name = 'play';
                        window._sxmDataLayerPush('video-play', analytics);
                    });

                    video.addEventListener('sxm-media-pause', function () {
                        analytics.clickInfo.name = 'pause';
                        window._sxmDataLayerPush('video-pause', analytics);
                    });
                }
            }
        }
    }

    var videoNames = [];
    document.querySelectorAll('video').forEach(bindVideo);

    const mutationObserverCallback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') {
                        bindVideo(node);
                    } else if (node.querySelectorAll) {
                        const videos = node.querySelectorAll('video');
                        videos.forEach((video) => {
                            bindVideo(video);
                        });
                    }
                });
            }
        }
    };
    const observer = new MutationObserver(mutationObserverCallback);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    var videoInfo = {
        name: videoNames.join(' | '),
        time: '0',
    };

    /*** OFFER ***/
    var offerInfo = [];
    document.querySelectorAll('script[data-offer]').forEach(function (offer) {
        if (offer) {
            var name = offer.getAttribute('data-offer');
            var isVisible = offer.parentElement.offsetWidth > 0 || offer.parentElement.offsetHeight > 0;

            if (name && isVisible) {
                offerInfo.push({ name: name });
            }
        }
    });

    /*** NAV ***/
    function navHoverHandler(event) {
        var target = event.target;
        var button = target?.getAttribute?.('aria-expanded') ? target : target?.closest?.('[aria-expanded]');

        if (target?.getAttribute?.('aria-expanded') === 'false') {
            pushToAdobe({
                event: 'nav-hover',
                clickInfo: {
                    name: button.getAttribute('data-type'),
                },
            });
        }
    }

    const nav = document.querySelector('nav');

    if (nav) {
        const expandedItems = nav.querySelectorAll('[aria-expanded]');

        if (expandedItems) {
            expandedItems.forEach(function (navHoverItem) {
                navHoverItem.addEventListener('mouseover', navHoverHandler);
            });
        }
    }

    /*** MODAL ***/
    document.addEventListener('modalopen', function (e) {
        pushToAdobe({
            event: 'page-loaded',
            pageInfo: {
                pageName: pageInfo.pageName + ':' + e.detail.pagename,
                pageType: 'modal',
            },
        });
    });

    document.addEventListener('modalclose', function () {
        pushToAdobe({
            event: 'eddl-update',
            pageInfo: pageInfo,
        });
    });

    /*** CLICK ***/
    function clickHandler(event) {
        if (event.target) {
            if (event.target.closest('#sskyplayer,#onetrust-consent-sdk') && !event.target.matches('[data-type=URL]')) {
                return;
            }

            var localPageNameParent = event.target.closest('[data-localpagename]');
            var localPageName = localPageNameParent
                ? localPageNameParent.getAttribute('data-localpagename')
                : event.detail.pagename || '';
            var parent = event.target.closest(
                'a,button:not([data-donottrack]),input,textarea,[role="option"],[role="button"]',
            );
            var anchor = event.target.matches(
                'a,button:not([data-donottrack]),input,textarea,[role="option"],[role="button"]',
            )
                ? event.target
                : parent;
            var internalRX = new RegExp('^#', 'gmi');
            var componenttype = event.target.closest('body,[data-componenttype]');
            var position = componenttype
                ? componenttype.getAttribute('data-componenttype').replace(/[\W_]+/g, '')
                : 'Content';
            var section = event.target.closest('section');

            if (anchor) {
                var badge = anchor.querySelector('[data-badge]');

                if (!badge && section) {
                    badge = section.querySelector('[data-badge]');
                }

                if (badge) {
                    position += badge.getAttribute('data-badge') || '';
                }

                var href = anchor?.getAttribute('href');
                var label = document.querySelector('label[for="' + anchor?.getAttribute('id') + '"]');

                var isButton = anchor.matches('button,input,[role="option"],textarea');
                var isInternal = internalRX.test(anchor?.getAttribute('href')) || isButton;
                var name =
                    anchor?.getAttribute('data-linkname') ||
                    (label ? label.innerText : '') ||
                    anchor?.getAttribute('aria-label') ||
                    anchor.innerText ||
                    (isButton ? 'button' : '');

                if (!name) {
                    var imgs = anchor.querySelectorAll('img');

                    for (var i = 0; i < imgs.length; i++) {
                        if (imgs[i]) {
                            var alt = imgs[i].getAttribute('alt');
                            if (alt) {
                                name = alt;
                                break;
                            }
                        }
                    }
                }

                if (href && (href.indexOf('player.siriusxm.com') >= 0 || href.indexOf('sxm.app.link') >= 0)) {
                    pushToAdobe({ event: 'player-click' });
                }

                var pulseLinkAttributes = ['category', 'subcategory', 'channel', 'show', 'component', 'talent'];
                var clickInfo = {
                    name: name,
                    pageName: localPageName ? analyticsPageName + ':' + localPageName : analyticsPageName,
                    position: position || 'Content',
                    linkKey: position || 'Content',
                    type: isInternal ? 'ui' : 'exit',
                };

                pulseLinkAttributes.forEach(function (attr) {
                    var value = anchor.getAttribute('data-' + attr);
                    if (value) {
                        clickInfo[attr] = value;
                    }
                });

                var searchStatus =
                    document.querySelector('[data-searchstatus]')?.getAttribute('data-searchstatus') === 'true';

                if (searchStatus) {
                    setTimeout(() => {
                        var newPageInfo = JSON.parse(JSON.stringify(pageInfo));
                        var searchTerm = document.querySelector('[data-searchterm]')?.getAttribute('data-searchterm');
                        var searchResults = document
                            .querySelector('[data-searchresults]')
                            ?.getAttribute('data-searchresults');

                        newPageInfo.pageName = 'www:overlay:search';

                        var newClickInfo = {
                            name: name,
                            position: position || 'Content',
                            linkKey: position || 'Content',
                            type: isInternal ? 'ui' : 'exit',
                            searchTerm: searchTerm,
                            searchResults: searchResults || 0,
                        };

                        pushToAdobe({
                            event: 'user-click',
                            clickInfo: newClickInfo,
                        });
                    }, 200);
                } else {
                    var newPageInfo = JSON.parse(JSON.stringify(pageInfo));

                    if (localPageName) {
                        newPageInfo.pageName = pageInfo.pageName + ':' + localPageName;
                    }

                    pushToAdobe({
                        event: 'user-click',
                        clickInfo: clickInfo,
                    });
                }
            }
        }
    }

    document.body.addEventListener('click', clickHandler);

    /*** SUNDAY SKY VIDEO */
    const sundayskyWrapper = document.getElementById('sskyElementsWrapper');

    if (sundayskyWrapper) {
        function sundaySkyListeners() {
            const videoPlayer = sundayskyWrapper.querySelector('video');
            const name = sundayskyWrapper.getAttribute('data-name');
            const sundaysky = document.querySelector('#sskyplayer');

            if (!sundaysky) return;

            function handlePlayPauseEvent() {
                const container = document.getElementById('vjs_video_3');

                if (!container) return;

                const analytics = {
                    audioInfo: {
                        name: name,
                        time: videoPlayer.currentTime,
                    },
                    clickInfo: {
                        pageName: analyticsPageName,
                        position: 'SundaySky',
                        linkKey: 'SundaySky',
                        type: 'ui',
                    },
                };

                if (container.classList.contains('vjs-paused')) {
                    analytics.clickInfo.name = 'play';
                    window._sxmDataLayerPush('audio-start', analytics);
                } else if (container.classList.contains('vjs-playing')) {
                    analytics.clickInfo.name = 'pause';
                    window._sxmDataLayerPush('audio-pause', analytics);
                }
            }

            function handleVideoEndedEvent() {
                const analytics = {
                    audioInfo: {
                        name: name,
                        time: videoPlayer.duration,
                    },
                    clickInfo: {
                        pageName: analyticsPageName,
                        position: 'SundaySky',
                        linkKey: 'SundaySky',
                        type: 'ui',
                    },
                };
                analytics.clickInfo.name = 'complete';
                window._sxmDataLayerPush('audio-complete', analytics);
            }

            sundaysky.addEventListener('click', (event) => {
                if (event.target.matches('[data-type=URL]')) {
                    return;
                }

                const playButton = event.target.closest?.('.vjs-play-control');
                const controlBar = event.target.closest?.('.vjs-control-bar');
                const videoContainer = event.target.closest?.('#vjs_video_3');

                if (playButton) {
                    handlePlayPauseEvent();
                    return;
                }

                if (videoContainer && !controlBar) {
                    handlePlayPauseEvent();
                }
            });

            if (videoPlayer) {
                videoPlayer.addEventListener('ended', handleVideoEndedEvent);
            }
        }

        const interval = setInterval(() => {
            if (document.querySelector('#sskyplayer') && document.querySelector('#sskyplayer video')) {
                clearInterval(interval);
                sundaySkyListeners();
            }
        }, 100);
    }
})();
