import SharedData from '../shared/SharedData';
import 'wavesurfer.js/plugin/wavesurfer.minimap'
import 'wavesurfer.js/plugin/wavesurfer.timeline'
import 'wavesurfer.js/plugin/wavesurfer.regions'



var helpButton;
let shared;
let currentEnd;
let currentStart;

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function() {
    const sharedData = new SharedData()
    shared = sharedData.getSharedData()
    helpButton = document.getElementById('btn-help');
    // wavesurfer progress bar
    (function() {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');
        var showProgress = function(percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };
        var hideProgress = function() {
            progressDiv.style.display = 'none';
        };
        shared.wavesurfer.on('loading', showProgress);
        shared.wavesurfer.on('ready', hideProgress);
        shared.wavesurfer.on('destroy', hideProgress);
        shared.wavesurfer.on('error', hideProgress);
    }());

    shared.wavesurfer.init(shared.wavesurferOptions);

    /* Minimap plugin */
    shared.wavesurfer.initMinimap({
        height: 30,
        waveColor: '#ddd',
        progressColor: '#999',
        cursorColor: '#999'
    });

    shared.wavesurfer.enableDragSelection({
        color: 'rgba(200, 55, 99, 0.1)'
    });

    shared.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: shared.wId,
        id: shared.mrId
    });
    shared.wavesurfer.load(shared.audioData);

    shared.wavesurfer.on('ready', function() {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: shared.wavesurfer,
            container: '#wave-timeline'
        });
    });

    shared.wavesurfer.on('region-created', function(current) {
        shared.currentRegion = current;
        helpButton.disabled = false;
        // delete all other existing regions
        for (var index in shared.wavesurfer.regions.list) {
            var region = shared.wavesurfer.regions.list[index];
            if (region.start !== current.start && region.end !== current.start) {
                shared.wavesurfer.regions.list[index].remove();
            }
        }
        //
    });
    /* /WAVESURFER */


    shared.htmlAudioPlayer.src = shared.audioData;
    shared.htmlAudioPlayer.addEventListener('timeupdate', function() {
        if (shared.htmlAudioPlayer.currentTime >= currentEnd) {
            shared.htmlAudioPlayer.pause();
            shared.htmlAudioPlayer.currentTime = currentStart;
            if (shared.htmlAudioPlayer.loop) {
                shared.htmlAudioPlayer.play();
            } else {
                shared.playing = false;
            }
        }
    });
});

$('body').on('click', '#btn-play', function() {
    play()
})

$('body').on('click', '#btn-help', function() {
    toggleHelp()
})

$('body').on('click', '#btn-delete', function() {
    deleteRegions()
})

$('body').on('click', '.play-help', function() {
    console.log('play help');
    playHelp(this)
})

function play() {
    if (shared.playing) {
        shared.wavesurfer.pause();
        shared.playing = false;
    } else {
        shared.wavesurfer.play();
        shared.playing = true;
    }

}

function deleteRegions() {
    for (var index in shared.wavesurfer.regions.list) {
        shared.wavesurfer.regions.list[index].remove();
    }
    shared.currentRegion = null;
    helpButton.disabled = true;
}

function toggleHelp() {
    var content = shared.domUtils.getSimpleHelpModalContent(shared.currentRegion, shared.audioData, shared);
    $('#simpleHelpModal').on('show.bs.modal', function() {
        // remove any previous content (does not work on the hidden.bs.modal event)
        $(this).find('.modal-body').empty();
        $(this).find('.modal-body').append(content);
    });
    $('#simpleHelpModal').on('hidden.bs.modal', function() {
        shared.htmlAudioPlayer.pause();
    });
    $('#simpleHelpModal').modal('show');
}




// ======================================================================================================== //
// DOCUMENT READY END
// ======================================================================================================== //


// ======================================================================================================== //
// HELP MODAL FUNCTIONS
// ======================================================================================================== //
/**
 * play the region (<audio> element) and loop if needed
 * Uses an <audio> element because we might need playback rate modification without changing the pitch of the sound
 * Wavesurfer can't do that for now
 */
function playHelp(elem) {
    currentStart = $(elem).attr('data-start');
    currentEnd = $(elem).attr('data-end');
    const mode = Number($(elem).attr('data-mode'));
    shared.htmlAudioPlayer.loop = mode === shared.playMode.PLAY_LOOP ? true:false;
    if (mode === shared.playMode.PLAY_SLOW) {
        shared.htmlAudioPlayer.playbackRate = 0.8;
    } else {
        shared.htmlAudioPlayer.playbackRate = 1;
    }

    if (shared.playing) {
        shared.htmlAudioPlayer.pause();
        shared.playing = false;
    } else {
        shared.htmlAudioPlayer.currentTime = currentStart;
        shared.htmlAudioPlayer.play();
        shared.playing = true;
    }
}

// ======================================================================================================== //
// HELP MODAL FUNCTIONS END
// ======================================================================================================== //
