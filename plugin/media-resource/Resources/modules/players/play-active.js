import SharedData from '../shared/SharedData';
import 'wavesurfer.js/plugin/wavesurfer.minimap'
import 'wavesurfer.js/plugin/wavesurfer.timeline'
import 'wavesurfer.js/plugin/wavesurfer.regions'

var helpCurrentRegion; // the region where we are when asking help
var helpPreviousRegion; // the previous region relatively to helpCurrentRegion
var currentHelpRelatedRegion; // the related help region;
var helpRegion; // the region we are listening to while in help modal first pane
var hModal;
var currentEnd;
var currentStart;
let shared;

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY (PLAY / PAUSE, MOVE BACKWARD / FORWARD, ADD MARKER, CALL HELP, ANNOTATE)
// ======================================================================================================== //

$('body').on('click', '.btn-show-help', function(){

    helpCurrentRegion = shared.currentRegion;
    console.log('shared');
    // search for prev region only if we are not in the first one
    if (shared.currentRegion.start > 0) {
        for (var i = 0; i < shared.regions.length; i++) {
            if (shared.regions[i].end === shared.currentRegion.start) {
                helpPreviousRegion = shared.regions[i];
            }
        }
    }
    var modalHtml = shared.domUtils.getHelpModalContent(helpCurrentRegion, helpPreviousRegion, shared);

    // catch show modal event
    $('#helpModal').on('show.bs.modal', function() {

      hModal = $(this);
      // clear previous content
      hModal.find('.tab-content').empty();
      // append basic modal content
      hModal.find('.tab-content').append(modalHtml);

      // by default the current region is selected so we append to modal help tab the current region help options
      var currentDomRow = shared.domUtils.getRegionRow(shared.currentRegion.start + 0.1, shared.currentRegion.end - 0.1);

      //  append to tab pane #region-help-available
      shared.domUtils.appendHelpModal(hModal, helpCurrentRegion, shared);

      helpRegion = {
          start: shared.currentRegion.start + 0.1,
          end: shared.currentRegion.end - 0.1
      };

      // listen to tab click event
      hModal.find('#help-tab-panel a[role=tab]').click(function(e) {
          e.preventDefault();
          if (shared.playing) {
              shared.htmlAudioPlayer.pause();
              shared.playing = false;
          }
          $(this).tab('show');
      });
    });

    // catch hidden modal event
    $('#helpModal').on('hidden.bs.modal', function() {
        if (shared.playing) {
            shared.htmlAudioPlayer.pause();
            shared.playing = false;
        }
        // (re)set the first tab active
        $(this).find('.nav-tabs > li').each(function($index) {
            if ($index === 0) {
                $(this).removeClass('active').addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    });
    // open modal
    $('#helpModal').modal("show");
})


$('body').on('click', '.play-help', function() {
    playHelp(this)
})

$('body').on('click', '.play-backward', function() {
    playBackward()
})

$('body').on('click', '.play-help-related-region', function() {
    playHelpRelatedRegion(this)
})

var actions = {
    play: function() {
        if (!shared.playing) {
            shared.wavesurfer.play();
            shared.playing = true;
        } else {
            shared.wavesurfer.pause();
            shared.playing = false;
        }
    }
};

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY END
// ======================================================================================================== //

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function() {
    let sharedData = new SharedData()
    shared = sharedData.getSharedData()

    // bind data-action events
    $("button[data-action]").click(function() {
        var action = $(this).data('action');
        if (actions.hasOwnProperty(action)) {
            actions[action]($(this));
        }
    });

    // HELP MODAL SELECT REGION (CURRENT / PREVIOUS) EVENT
    $('body').on('change', 'input[name=segment]:radio', function(e) {

        if (shared.playing) {
            shared.htmlAudioPlayer.pause();
            shared.playing = false;
        }

        var selectedValue = e.target.value;
        if (selectedValue === 'previous') {
            shared.domUtils.appendHelpModal(hModal, helpPreviousRegion, shared);
            helpRegion = {
                start: helpPreviousRegion.start + 0.1,
                end: helpPreviousRegion.end - 0.1
            };
        } else if (selectedValue === 'current') {
            shared.domUtils.appendHelpModal(hModal, shared.currentRegion, shared);
            helpRegion = {
                start: shared.currentRegion.start + 0.1,
                end: shared.currentRegion.end - 0.1
            };
        }

        // enable selected region preview button only
        $('#help-region-choice .input-group').each(function() {
            $(this).find('button').prop('disabled', $(this).find('input[name=segment]').val() !== selectedValue);
        });
    });

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

    var data = {
        workspaceId: shared.wId,
        id: shared.mrId
    };
    loadAudio(data);


    shared.htmlAudioPlayer.src = shared.audioData;

    shared.wavesurfer.on('ready', function() {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: shared.wavesurfer,
            container: '#wave-timeline'
        });
        initRegions();
        if (shared.regions.length > 0) {
            shared.currentRegion = shared.regions[0];
        }
    });

    shared.wavesurfer.on('seek', function() {
        var current = getRegionFromTime();
        if (current && shared.currentRegion && current.uuid != shared.currentRegion.uuid) {
            // update current region
            shared.currentRegion = current;
        }
    });

    shared.wavesurfer.on('audioprocess', function() {
        // check shared.regions and display text
        var current = getRegionFromTime();
        if (current && shared.currentRegion && current.uuid != shared.currentRegion.uuid) {
            // update current region
            shared.currentRegion = current;
        }
    });
    /* /WAVESURFER */

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
// ======================================================================================================== //
// DOCUMENT READY END
// ======================================================================================================== //


function getRegionFromTime(time) {
    var currentTime = time ? time : shared.wavesurfer.getCurrentTime();
    var region;
    for (var i = 0; i < shared.regions.length; i++) {
        if (shared.regions[i].start <= currentTime && shared.regions[i].end > currentTime) {
            region = shared.regions[i];
            break;
        }
    }
    return region;
}

// build shared.markers, shared.regions from existing ones
function initRegions() {
    $(".region").each(function() {
        var start = $(this).find('input.hidden-start').val();
        var end = $(this).find('input.hidden-end').val();
        var note = $(this).find('input.hidden-note').val();
        var id = $(this).find('input.hidden-region-id').val();
        var uuid = $(this).find('input.hidden-region-uuid').val();
        var helpUuid = $(this).find('input.hidden-config-help-region-uuid').val();
        var loop = $(this).find('input.hidden-config-loop').val() === '1';
        var backward = $(this).find('input.hidden-config-backward').val() === '1';
        var rate = $(this).find('input.hidden-config-rate').val() === '1';
        var texts = [];
        var links = [];
        $(this).find('.hidden-help-texts').each(function() {
            if ($(this).val() !== '') {
                texts.push($(this).val());
            }
        });
        $(this).find('.hidden-help-links').each(function() {
            if ($(this).val() !== '') {
                links.push($(this).val());
            }
        });
        //  var texts = $(this).find('input.hidden-config-text').val() !== '' ? $(this).find('input.hidden-config-text').val().split(';') : false;
        var hasHelp = rate || backward || texts.length > 0 || links.length > 0 || loop || helpUuid !== '';
        var region = {
            id: id,
            uuid: uuid,
            start: Number(start),
            end: Number(end),
            note: note,
            hasHelp: hasHelp,
            helpUuid: helpUuid,
            loop: loop,
            backward: backward,
            rate: rate,
            texts: texts,
            links: links
        };
        shared.regions.push(region);
    });

    return true;
}

function loadAudio(data) {
    shared.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: data.workspaceId,
        id: data.id
    });
    shared.wavesurfer.load(shared.audioData);
    return true;
}
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
    const mode = $(elem).attr('data-mode'); // loop / rate

    shared.htmlAudioPlayer.loop = mode === shared.playMode.PLAY_LOOP;
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



/**
 * Allow the user to play the help related region
 * @param {float} start
 */
function playHelpRelatedRegion(elem) {
  const start = Number($(elem).attr('data-region-uuid')) + 0.1;
  playRegionFrom(start);
}

/**
 * Will only work with chrome browser !!
 * Called by HelpModal play backward button
 */
function playBackward() {
    // is shared.playing for real audio (ie not for TTS)
    if (shared.playing && shared.htmlAudioPlayer) {
        // stop audio playback before shared.playing TTS
        shared.htmlAudioPlayer.pause();
        shared.playing = false;
    }
    if (window.SpeechSynthesisUtterance === undefined) {
        console.log('not supported!');
    } else {
        var text = shared.strUtils.removeHtml(shared.currentRegion.note);
        var array = text.split(' ');
        var start = array.length - 1;
        // check if utterance is already speaking before shared.playing (pultiple click on backward button)
        if (!window.speechSynthesis.speaking) {
            handleUtterancePlayback(start, array);
        }
    }
}

function sayIt(text, callback) {
    var utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    var lang = $('input[name=tts]').val();
    var voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        // chrome hack...
        window.setTimeout(function() {
            voices = window.speechSynthesis.getVoices();
            continueToSay(utterance, voices, lang, callback);
        }.bind(this), 200);
    } else {
        continueToSay(utterance, voices, lang, callback);
    }
}

function continueToSay(utterance, voices, lang, callback) {
    for (var i = 0; i < voices.length; i++) {
        // voices names are not the same chrome is always code1-code2 while fx is sometimes code1-code2 and sometimes code1
        var lang2 = lang.split('-')[0];
        if (voices[i].lang == lang || voices[i].lang == lang2) {
            utterance.voice = voices[i];
            break;
        }
    }
    window.speechSynthesis.speak(utterance);
    utterance.onend = function(event) {
        return callback();
    };
}

function handleUtterancePlayback(index, textArray) {
    var toSay = '';
    var length = textArray.length;
    for (var j = index; j < length; j++) {
        toSay += textArray[j] + ' ';
    }
    if (index >= 0) {
        sayIt(toSay, function() {
            index = index - 1;
            handleUtterancePlayback(index, textArray);
        });
    }
}
// ======================================================================================================== //
// HELP MODAL FUNCTIONS END
// ======================================================================================================== //



/**
 * Region options Modal
 * Allow the user to listen to the selected help related region while configuring help
 * Uses html audio player to avoid shared.wavesurfer animations behind the modal while shared.playing
 **/
/*$('body').on('click', '#btn-help-related-region-play', function() {
    if (currentHelpRelatedRegion) {
        playHelp(currentHelpRelatedRegion.start, currentHelpRelatedRegion.end, false, false);
    }
});*/

// color config region buttons if
function checkIfRowHasConfigValue(row) {
    var helpRegion = $(row).find('.hidden-config-help-region-uuid').val() !== '' ? true : false;
    var loop = $(row).find('.hidden-config-loop').val() === '1' ? true : false;
    var backward = $(row).find('.hidden-config-backward').val() === '1' ? true : false;
    var rate = $(row).find('.hidden-config-rate').val() === '1' ? true : false;
    var text = $(row).find('.hidden-config-text').val() !== '' ? true : false;
    return helpRegion || loop || backward || rate || text;
}

// ======================================================================================================== //
// CONFIG REGION MODAL FUNCTIONS END
// ======================================================================================================== //





function getMarkerLeftPostionFromTime(time) {
    var duration = shared.wavesurfer.getDuration();
    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();
    return time * cWidth / duration;
}




// ======================================================================================================== //
// MARKERS END
// ======================================================================================================== //


// ======================================================================================================== //
// REGIONS (Objects)
// ======================================================================================================== //

function getRegionById(id) {
    var searched;
    for (var i = 0; i < shared.regions.length; i++) {
        if (shared.regions[i].id === id) {
            searched = shared.regions[i];
        }
    }
    return searched;
}


function getRegionByUuid(uuid) {
    var searched;
    for (var i = 0; i < shared.regions.length; i++) {
        if (shared.regions[i].uuid === uuid) {
            searched = shared.regions[i];
        }
    }
    return searched;
}



function getNextRegion(time) {
    var next;
    var region;
    if (time) {
        region = getRegionFromTime(time);
    } else {
        region = shared.currentRegion;
    }
    // find next region relatively to current
    for (var i = 0; i < shared.regions.length; i++) {
        if (shared.regions[i].start == region.end) {
            next = shared.regions[i];
        }
    }
    return next;
}

function getPrevRegion(time) {
    var prev;
    var region;
    if (time) {
        region = getRegionFromTime(time);
    } else {
        region = shared.currentRegion;
    }
    if (region) {
        // find next region relatively to current
        for (var i = 0; i < shared.regions.length; i++) {
            if (shared.regions[i].end == region.start) {
                prev = shared.regions[i];
            }
        }
    }
    return prev;
}

/**
 * Called from play button on a region row
 * @param {type} elem
 * @returns {undefined}
 */
function playRegion(elem) {
    var start = Number($(elem).closest('.region').find('.hidden-start').val());
    playRegionFrom(start + 0.1);
}

function playRegionFrom(start) {
    var region = getRegionFromTime(start);
    var wRegion = shared.wavesurfer.addRegion({
        start: region.start,
        end: region.end,
        color: 'rgba(0,0,0,0)',
        drag: false,
        resize: false
    });
    if (!shared.playing) {
        wRegion.play();
        shared.playing = true;
        shared.wavesurfer.once('pause', function() {
            shared.playing = false;
            // remove all shared.wavesurfer shared.regions as we do not use them elsewhere
            shared.wavesurfer.clearRegions();
        });
    } else {
        shared.wavesurfer.pause();
        shared.playing = false;
    }
}

// ======================================================================================================== //
// END REGIONS
// ======================================================================================================== //

// ======================================================================================================== //
// OTHER MIXED FUNCTIONS
// ======================================================================================================== //

/**
 * put the shared.wavesurfer play cursor at the given time and pause playback
 * @param time in seconds
 */
function goTo(time) {
    var percent = (time) / shared.wavesurfer.getDuration();
    shared.wavesurfer.seekAndCenter(percent);
    if (shared.playing) {
        shared.wavesurfer.pause();
        shared.playing = false;
    }
}

function getTimeFromPosition(position) {
    var duration = shared.wavesurfer.getDuration();
    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();
    return position * duration / cWidth;
}



// ======================================================================================================== //
//  OTHER MIXED FUNCTIONS END
// ======================================================================================================== //
