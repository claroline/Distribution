'use strict';

var loop = false;
var rate = 1;
var helpButton;
var helpIsPlaying = false;

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function() {

    helpButton = document.getElementById('help-btn');

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
        commonVars.wavesurfer.on('loading', showProgress);
        commonVars.wavesurfer.on('ready', hideProgress);
        commonVars.wavesurfer.on('destroy', hideProgress);
        commonVars.wavesurfer.on('error', hideProgress);
    }());

    commonVars.wavesurfer.init(commonVars.wavesurferOptions);

    /* Minimap plugin */
    commonVars.wavesurfer.initMinimap({
        height: 30,
        waveColor: '#ddd',
        progressColor: '#999',
        cursorColor: '#999'
    });

    commonVars.wavesurfer.enableDragSelection({
        color: 'rgba(200, 55, 99, 0.1)'
    });

    var data = {
        workspaceId: commonVars.wId,
        id: commonVars.mrId
    };

    commonVars.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: data.workspaceId,
        id: data.id
    });
    commonVars.wavesurfer.load(commonVars.audioData);


    commonVars.wavesurfer.on('ready', function() {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: commonVars.wavesurfer,
            container: '#wave-timeline'
        });
    });

    commonVars.wavesurfer.on('region-created', function(current) {
        commonVars.currentRegion = current;
        helpButton.disabled = false;
        // delete all other existing regions
        for (var index in commonVars.wavesurfer.regions.list) {
            var region = commonVars.wavesurfer.regions.list[index];
            if (region.start !== current.start && region.end !== current.start) {
                commonVars.wavesurfer.regions.list[index].remove();
            }
        }
        //
    });
    /* /WAVESURFER */
});

function play() {
    if (!commonVars.playing) {
        if (commonVars.currentRegion) {
            commonVars.currentRegion.loop = loop;
            commonVars.wavesurfer.play(commonVars.currentRegion.start);
            if (!loop) {
                commonVars.currentRegion.once('out', function() {
                    commonVars.wavesurfer.pause();
                    commonVars.playing = false;
                });
            }
        } else {
            commonVars.wavesurfer.play();
        }
        commonVars.playing = true;
    } else {
        commonVars.wavesurfer.pause();
        commonVars.playing = false;
    }
}

function deleteRegions() {
    for (var index in commonVars.wavesurfer.regions.list) {
        commonVars.wavesurfer.regions.list[index].remove();
    }
    commonVars.currentRegion = null;
    helpButton.disabled = true;
}

function toggleHelp() {
    var content = commonVars.domUtils.getSimpleHelpModalContent(commonVars.currentRegion, commonVars.audioData);
    $('#simpleHelpModal').on('show.bs.modal', function() {
        // remove any previous content (does not work on the hidden.bs.modal event)
        $(this).find('.modal-body').empty();
        $(this).find('.modal-body').append(content);
    });
    $('#simpleHelpModal').on('hidden.bs.modal', function() {
        document.getElementById('help-audio-player').pause();
    });
    $('#simpleHelpModal').modal('show');
}

function toggleRate(elem) {
    if (commonVars.playing) {
        commonVars.wavesurfer.pause();
    }

    if ($(elem).hasClass('active')) {
        $(elem).removeClass('active');
        commonVars.wavesurfer.setPlaybackRate(1);
    } else {
        $(elem).addClass('active');
        commonVars.wavesurfer.setPlaybackRate(0.8);
    }
}

function toggleLoop(elem) {

    if (commonVars.playing) {
        commonVars.wavesurfer.pause();
    }

    if ($(elem).hasClass('active')) {
        $(elem).removeClass('active');
        loop = false;
    } else {
        $(elem).addClass('active');
        loop = true;
    }
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
 * @param {float} start
 * @param {float} end
 */
function playHelp(start, end, loop, rate) {
    commonVars.htmlAudioPlayer = document.getElementsByTagName("audio")[0];
    commonVars.htmlAudioPlayer.loop = loop;
    if (rate) {
        commonVars.htmlAudioPlayer.playbackRate = 0.8;
    } else {
        commonVars.htmlAudioPlayer.playbackRate = 1;
    }
    commonVars.htmlAudioPlayer.addEventListener('timeupdate', function() {
        if (commonVars.htmlAudioPlayer.currentTime >= end) {
            commonVars.htmlAudioPlayer.pause();
            commonVars.htmlAudioPlayer.currentTime = start;
            if (commonVars.htmlAudioPlayer.loop) {
                commonVars.htmlAudioPlayer.play();
            } else {
                helpIsPlaying = false;
            }
        }

    });


    if (helpIsPlaying) {
        commonVars.htmlAudioPlayer.pause();
        helpIsPlaying = false;
    } 
    commonVars.htmlAudioPlayer.currentTime = start;
    commonVars.htmlAudioPlayer.play();
    helpIsPlaying = true;
}

// ======================================================================================================== //
// HELP MODAL FUNCTIONS END
// ======================================================================================================== //
