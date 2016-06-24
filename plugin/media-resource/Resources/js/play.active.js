'use strict';

var helpCurrentRegion; // the region where we are when asking help
var helpPreviousRegion; // the previous region relatively to helpCurrentRegion
var currentHelpRelatedRegion; // the related help region;
var helpRegion; // the region we are listening to while in help modal first pane
var hModal;
var helpRegionEnd;
var helpRegionStart;

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY (PLAY / PAUSE, MOVE BACKWARD / FORWARD, ADD MARKER, CALL HELP, ANNOTATE)
// ======================================================================================================== //
var actions = {
    play: function() {
        if (!commonVars.playing) {
            commonVars.wavesurfer.play();
            commonVars.playing = true;
        } else {
            commonVars.wavesurfer.pause();
            commonVars.playing = false;
        }
    },
    help: function() {
        helpCurrentRegion = commonVars.currentRegion;
        // search for prev region only if we are not in the first one
        if (commonVars.currentRegion.start > 0) {
            for (var i = 0; i < commonVars.regions.length; i++) {
                if (commonVars.regions[i].end === commonVars.currentRegion.start) {
                    helpPreviousRegion = commonVars.regions[i];
                }
            }
        }
        var modalHtml = commonVars.domUtils.getHelpModalContent(helpCurrentRegion, helpPreviousRegion);

        // catch show modal event
        $('#helpModal').on('show.bs.modal', function() {
          hModal = $(this);
          // clear previous content
          hModal.find('.tab-content').empty();
          // append basic modal content
          hModal.find('.tab-content').append(modalHtml);
          // by default the current region is selected so we append to modal help tab the current region help options
          var currentDomRow = commonVars.domUtils.getRegionRow(commonVars.currentRegion.start + 0.1, commonVars.currentRegion.end - 0.1);

          //  append to tab pane #region-help-available
          commonVars.domUtils.appendHelpModal(hModal, helpCurrentRegion);

          helpRegion = {
              start: commonVars.currentRegion.start + 0.1,
              end: commonVars.currentRegion.end - 0.1
          };

          // listen to tab click event
          hModal.find('#help-tab-panel a[role=tab]').click(function(e) {
              e.preventDefault();
              if (commonVars.playing) {
                  commonVars.htmlAudioPlayer.pause();
                  commonVars.playing = false;
              }
              $(this).tab('show');
          });
        });

        // catch hidden modal event
        $('#helpModal').on('hidden.bs.modal', function() {
            if (commonVars.playing) {
                commonVars.htmlAudioPlayer.pause();
                commonVars.playing = false;
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
    }
};

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY END
// ======================================================================================================== //

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function() {

    // bind data-action events
    $("button[data-action]").click(function() {
        var action = $(this).data('action');
        if (actions.hasOwnProperty(action)) {
            actions[action]($(this));
        }
    });

    // HELP MODAL SELECT REGION (CURRENT / PREVIOUS) EVENT
    $('body').on('change', 'input[name=segment]:radio', function(e) {

        if (commonVars.playing) {
            commonVars.htmlAudioPlayer.pause();
            commonVars.playing = false;
        }

        var selectedValue = e.target.value;
        if (selectedValue === 'previous') {
            commonVars.domUtils.appendHelpModal(hModal, helpPreviousRegion);
            helpRegion = {
                start: helpPreviousRegion.start + 0.1,
                end: helpPreviousRegion.end - 0.1
            };
        } else if (selectedValue === 'current') {
            commonVars.domUtils.appendHelpModal(hModal, commonVars.currentRegion);
            helpRegion = {
                start: commonVars.currentRegion.start + 0.1,
                end: commonVars.currentRegion.end - 0.1
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

    var data = {
        workspaceId: commonVars.wId,
        id: commonVars.mrId
    };
    loadAudio(data);

    commonVars.htmlAudioPlayer = document.getElementById('html-audio-player');
    commonVars.htmlAudioPlayer.src = commonVars.audioData;

    commonVars.wavesurfer.on('ready', function() {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: commonVars.wavesurfer,
            container: '#wave-timeline'
        });
        initRegions();
        if (commonVars.regions.length > 0) {
            commonVars.currentRegion = commonVars.regions[0];
        }
    });

    commonVars.wavesurfer.on('seek', function() {
        var current = getRegionFromTime();
        if (current && commonVars.currentRegion && current.uuid != commonVars.currentRegion.uuid) {
            // update current region
            commonVars.currentRegion = current;
        }
    });

    commonVars.wavesurfer.on('audioprocess', function() {
        // check commonVars.regions and display text
        var current = getRegionFromTime();
        if (current && commonVars.currentRegion && current.uuid != commonVars.currentRegion.uuid) {
            // update current region
            commonVars.currentRegion = current;
        }
    });
    /* /WAVESURFER */

    commonVars.htmlAudioPlayer.addEventListener('timeupdate', function() {
        if (commonVars.htmlAudioPlayer.currentTime >= helpRegionEnd) {
            commonVars.htmlAudioPlayer.pause();
            commonVars.htmlAudioPlayer.currentTime = helpRegionStart;
            if (commonVars.htmlAudioPlayer.loop) {
                commonVars.htmlAudioPlayer.play();
            } else {
                commonVars.playing = false;
            }
        }
    });
});
// ======================================================================================================== //
// DOCUMENT READY END
// ======================================================================================================== //


function getRegionFromTime(time) {
    var currentTime = time ? time : commonVars.wavesurfer.getCurrentTime();
    var region;
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].start <= currentTime && commonVars.regions[i].end > currentTime) {
            region = commonVars.regions[i];
            break;
        }
    }
    return region;
}

// build commonVars.markers, commonVars.regions from existing ones
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
        commonVars.regions.push(region);
    });

    return true;
}

function loadAudio(data) {
    commonVars.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: data.workspaceId,
        id: data.id
    });
    commonVars.wavesurfer.load(commonVars.audioData);
    return true;
}
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
    commonVars.htmlAudioPlayer.loop = loop;
    if (rate) {
        commonVars.htmlAudioPlayer.playbackRate = 0.8;
    } else {
        commonVars.htmlAudioPlayer.playbackRate = 1;
    }

    if (commonVars.playing) {
        commonVars.htmlAudioPlayer.pause();
        commonVars.playing = false;
    } else {
        commonVars.htmlAudioPlayer.currentTime = start;
        commonVars.htmlAudioPlayer.play();
        commonVars.playing = true;
    }
    helpRegionEnd = end;
    helpRegionStart = start;
}
/**
 * Allow the user to play the help related region
 * @param {float} start
 */
function playHelpRelatedRegion(start) {
    playRegionFrom(start + 0.1);
}

/**
 * Will only work with chrome browser !!
 * Called by HelpModal play backward button
 */
function playBackward() {
    // is commonVars.playing for real audio (ie not for TTS)
    if (commonVars.playing && commonVars.htmlAudioPlayer) {
        // stop audio playback before commonVars.playing TTS
        commonVars.htmlAudioPlayer.pause();
        commonVars.playing = false;
    }
    if (window.SpeechSynthesisUtterance === undefined) {
        console.log('not supported!');
    } else {
        var text = commonVars.strUtils.removeHtml(commonVars.currentRegion.note);
        var array = text.split(' ');
        var start = array.length - 1;
        // check if utterance is already speaking before commonVars.playing (pultiple click on backward button)
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
 * Uses html audio player to avoid commonVars.wavesurfer animations behind the modal while commonVars.playing
 **/
$('body').on('click', '#btn-help-related-region-play', function() {
    if (currentHelpRelatedRegion) {
        playHelp(currentHelpRelatedRegion.start, currentHelpRelatedRegion.end, false, false);
    }
});

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
    var duration = commonVars.wavesurfer.getDuration();
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
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].id === id) {
            searched = commonVars.regions[i];
        }
    }
    return searched;
}


function getRegionByUuid(uuid) {
    var searched;
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].uuid === uuid) {
            searched = commonVars.regions[i];
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
        region = commonVars.currentRegion;
    }
    // find next region relatively to current
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].start == region.end) {
            next = commonVars.regions[i];
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
        region = commonVars.currentRegion;
    }
    if (region) {
        // find next region relatively to current
        for (var i = 0; i < commonVars.regions.length; i++) {
            if (commonVars.regions[i].end == region.start) {
                prev = commonVars.regions[i];
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
    var wRegion = commonVars.wavesurfer.addRegion({
        start: region.start,
        end: region.end,
        color: 'rgba(0,0,0,0)',
        drag: false,
        resize: false
    });
    if (!commonVars.playing) {
        wRegion.play();
        commonVars.playing = true;
        commonVars.wavesurfer.once('pause', function() {
            commonVars.playing = false;
            // remove all commonVars.wavesurfer commonVars.regions as we do not use them elsewhere
            commonVars.wavesurfer.clearRegions();
        });
    } else {
        commonVars.wavesurfer.pause();
        commonVars.playing = false;
    }
}

// ======================================================================================================== //
// END REGIONS
// ======================================================================================================== //

// ======================================================================================================== //
// OTHER MIXED FUNCTIONS
// ======================================================================================================== //

/**
 * put the commonVars.wavesurfer play cursor at the given time and pause playback
 * @param time in seconds
 */
function goTo(time) {
    var percent = (time) / commonVars.wavesurfer.getDuration();
    commonVars.wavesurfer.seekAndCenter(percent);
    if (commonVars.playing) {
        commonVars.wavesurfer.pause();
        commonVars.playing = false;
    }
}

function getTimeFromPosition(position) {
    var duration = commonVars.wavesurfer.getDuration();
    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();
    return position * duration / cWidth;
}



// ======================================================================================================== //
//  OTHER MIXED FUNCTIONS END
// ======================================================================================================== //
