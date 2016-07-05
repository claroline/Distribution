import SharedData from '../shared/SharedData';

var baseAudioUrl = '';
var pauseTime = 2000;
var ended = false;
var playButton;
let shared;

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function () {
    //shared.htmlAudioPlayer = document.getElementById('html-audio-player');
    var progress = document.getElementById('seekbar');
    playButton = document.getElementById('play');
    let sharedData = new SharedData();
    shared = sharedData.getSharedData();

    shared.htmlAudioPlayer.loop = false;

    // create shared.regions JS objects
    createRegions();

    shared.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: shared.wId,
        id: shared.mrId
    });

    shared.htmlAudioPlayer.src = shared.audioData;
    baseAudioUrl = shared.audioData;

    // draw progress bar while playing
    shared.htmlAudioPlayer.addEventListener('timeupdate', function (e) {
        var percent = shared.htmlAudioPlayer.currentTime * 100 / shared.htmlAudioPlayer.duration;
        progress.style.width = percent + '%';
    });

    shared.htmlAudioPlayer.addEventListener('pause', function (e) {
        let nextRegion = getNextRegion(shared.htmlAudioPlayer.currentTime);
        if (!ended && nextRegion) {

            let offset = nextRegion.start;
            let paramString = '#t=' + offset + ',' + nextRegion.end;
            shared.htmlAudioPlayer.src = baseAudioUrl + paramString;

            window.setTimeout(function () {
                shared.htmlAudioPlayer.play();
                if (nextRegion.last) {
                    ended = true;
                }
            }, pauseTime);
        }
        else { // pause event is sent when ended
            shared.htmlAudioPlayer.currentTime = 0;
            playButton.disabled = false;
            ended = false;
        }
    });
});

$('body').on('click', '#play', function(){
  play()
})


function play() {
    playButton.disabled = true;
    ended = false;
    shared.htmlAudioPlayer.currentTime = 0;
    var paramString = '';
    var nextRegion = getNextRegion(shared.htmlAudioPlayer.currentTime);
    if (nextRegion) {
        var offset = nextRegion.end;
        paramString = '#t=0,' + offset;
    }
    shared.htmlAudioPlayer.src = baseAudioUrl + paramString;
    shared.htmlAudioPlayer.play();
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
            shared.regions.push(region);
        }
    });
}

function getNextRegion(time) {
    const length = shared.regions.length - 2;
    let index = 0
    for (let region of shared.regions) {
        if (region.start <= time && region.end > time) {
            var isLast = index > length ? true : false;
            return {
                start: region.start,
                end: region.end,
                last: isLast
            };
        }
        index++;
    }
}
