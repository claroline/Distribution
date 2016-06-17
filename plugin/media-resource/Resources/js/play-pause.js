var baseAudioUrl = '';
var pauseTime = 2000;
var ended = false;
var playButton;

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function () {
    //commonVars.htmlAudioPlayer = document.getElementById('html-audio-player');
    var progress = document.getElementById('seekbar');
    playButton = document.getElementById('play');
    commonVars.htmlAudioPlayer.loop = false;

    // create commonVars.regions JS objects
    createRegions();

    var data = {
        workspaceId: commonVars.wId,
        id: commonVars.mrId
    };

    commonVars.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: data.workspaceId,
        id: data.id
    });

    commonVars.htmlAudioPlayer.src = commonVars.audioData;
    baseAudioUrl = commonVars.audioData;

    // draw progress bar while playing
    commonVars.htmlAudioPlayer.addEventListener('timeupdate', function (e) {
        var percent = commonVars.htmlAudioPlayer.currentTime * 100 / commonVars.htmlAudioPlayer.duration;
        progress.style.width = percent + '%';
    });

    commonVars.htmlAudioPlayer.addEventListener('pause', function (e) {
        nextRegion = getNextRegion(commonVars.htmlAudioPlayer.currentTime);
        if (!ended && nextRegion) {

            offset = nextRegion.start;
            paramString = '#t=' + offset + ',' + nextRegion.end;
            commonVars.htmlAudioPlayer.src = baseAudioUrl + paramString;

            window.setTimeout(function () {
                commonVars.htmlAudioPlayer.play();
                if (nextRegion.last) {
                    ended = true;
                }
            }, pauseTime);
        }
        else { // pause event is sent when ended
            commonVars.htmlAudioPlayer.currentTime = 0;
            playButton.disabled = false;
            ended = false;
        }
    });
});


function play() {
    playButton.disabled = true;
    ended = false;
    commonVars.htmlAudioPlayer.currentTime = 0;
    var paramString = '';
    var nextRegion = getNextRegion(commonVars.htmlAudioPlayer.currentTime);
    if (nextRegion) {
        var offset = nextRegion.end;
        paramString = '#t=0,' + offset;
    }
    commonVars.htmlAudioPlayer.src = baseAudioUrl + paramString;
    commonVars.htmlAudioPlayer.play();
}


// ======================================================================================================== //
// DOCUMENT READY END
// ======================================================================================================== //

function createRegions() {
    $(".region").each(function () {
        var start = $(this).find('input.hidden-start').val();
        var end = $(this).find('input.hidden-end').val();
        if (start && end) {
            var region = {
                start: start,
                end: end
            };
            commonVars.regions.push(region);
        }
    });
}

function getNextRegion(time) {
    var length = Object.keys(commonVars.regions).length;
    length = length - 2;
    for (var index in commonVars.regions) {
        if (commonVars.regions[index].start <= time && commonVars.regions[index].end > time) {
            var isLast = index > length ? true : false;
            return {
                start: commonVars.regions[index].start,
                end: commonVars.regions[index].end,
                last: isLast
            };
        }
    }
}
