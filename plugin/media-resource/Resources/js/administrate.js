'use strict';

var isInRegionNoteRow = false; // for keyboard event listener, if we are editing a region note row, we don't want the enter keyboard to add a region marker

// current help options
var helpCurrentRegion; // the region where we are when asking help
var helpPreviousRegion; // the previous region relatively to helpCurrentRegion
var currentHelpRelatedRegion; // the related help region;
var helpRegion; // the region we are listening to while in help modal first pane
var hModal; // help (bootsrap) modal instance

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
    backward: function() {
        if (commonVars.regions.length > 1) {
            var to = commonVars.currentRegion ? Number(commonVars.currentRegion.start) - 0.01 > 0 ? Number(commonVars.currentRegion.start) - 0.01 : 0 : 0;
            goTo(to);
        } else {
            commonVars.wavesurfer.seekAndCenter(0);
        }
    },
    forward: function() {
        if (commonVars.regions.length > 1) {
            goTo(commonVars.currentRegion ? Number(commonVars.currentRegion.end) + 0.01 : 1);
        } else {
            commonVars.wavesurfer.seekAndCenter(1);
        }
    },
    mark: function() {
        var time = commonVars.wavesurfer.getCurrentTime();
        if (time > 0) {
            var mark = addMarker(time);
            createRegion(mark.time);
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
            // (re)set the first tab active in the modal
            $(this).find('.nav-tabs > li').each(function($index) {
                if ($index === 0) {
                    $(this).removeClass('active').addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        });
        // open modal
        $('#helpModal').modal('show');
    },
    annotate: function(elem) {
        var color = elem.data('color');
        var text = commonVars.javascriptUtils.getSelectedText();
        if (text !== '') {
            manualTextAnnotation(text, 'accent-' + color);
        }
    },
    zip: function() {
        var url = Routing.generate('mediaresource_zip_export', {
            workspaceId: commonVars.wId,
            id: commonVars.mrId,
            data: commonVars.regions
        });
        location.href = url;
    },
    toggleOptionsPanel: function() {
        $('.options-panel').find('.panel-body').toggle();
        $('.btn-options-toggle').hasClass('fa-chevron-down') ? $('.btn-options-toggle').removeClass('fa-chevron-down').addClass('fa-chevron-up') : $('.btn-options-toggle').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    },
    toggleAnnotationPanel: function() {
        $('.annotation-panel').find('.panel-body').toggle();
        $('.btn-annotation-toggle').hasClass('fa-chevron-down') ? $('.btn-annotation-toggle').removeClass('fa-chevron-down').addClass('fa-chevron-up') : $('.btn-annotation-toggle').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    },
    previewCurrentRegion: function() {
        playRegionFrom(commonVars.currentRegion.start);
    }
};

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY END
// ======================================================================================================== //

// ======================================================================================================== //
// DOCUMENT READY
// ======================================================================================================== //
$(document).ready(function() {
    // toggle color on config region buttons if needed (if there are some help available on a region the button must be colored)
    updateConfigButtonColor();

    // bind data-action events
    $("button[data-action]").click(function() {
        var action = $(this).data('action');
        if (actions.hasOwnProperty(action)) {
            actions[action]($(this));
        }
    });

    // CONTENT EDITABLE CHANGE EVENT MAPPING
    $('body').on('focus', '[contenteditable]', function() {
        var $input = $(this);
        $input.data('before', $input.html());
        // when focused skip to the start of the region on the waveform
        var start = $(this).closest(".region").find('input.hidden-start').val();
        goTo(start);
        isInRegionNoteRow = true;
        return $input;
    }).on('blur keypress keyup paste input', '[contenteditable]', function(e) {
        var $input = $(this);
        // do not allow user to add a line when pressing enter key
        if (e.type === 'keypress' && e.which === 13){
            return false;
        }

        if ($input.data('before') !== $input.html()) {
            $input.data('before', $input.html());
            $input.trigger('change');
            commonVars.domUtils.updateHiddenNoteInput($input);
            // update region object note data
            var uuid = $input.closest(".region").data('uuid');
            var note = $input.html() ? $input.html() : $input.text();
            var region = getRegionByUuid(uuid);
            region.note = note.replace('<br>', '');
        }
        return $input;
    }).on('blur', '[contenteditable]', function(e) {
        isInRegionNoteRow = false;
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

    // commonVars.wavesurfer progress bar
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

    commonVars.htmlAudioPlayer.src = commonVars.audioData;

    commonVars.wavesurfer.on('ready', function() {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: commonVars.wavesurfer,
            container: '#wave-timeline'
        });
        initRegionsAndMarkers();
        if (commonVars.regions.length > 0) {
            commonVars.currentRegion = commonVars.regions[0];
            commonVars.domUtils.highlightRegionRow(commonVars.currentRegion);
            highlightWaveform();
        }
    });

    commonVars.wavesurfer.on('seek', function() {
        var current = getRegionFromTime();
        if (current && commonVars.currentRegion && current.uuid != commonVars.currentRegion.uuid) {
            // update current region
            commonVars.currentRegion = current;
            // highlight region dom row
            commonVars.domUtils.highlightRegionRow(commonVars.currentRegion);
            // highlight region in waveform
            highlightWaveform();
        }
    });

    commonVars.wavesurfer.on('audioprocess', function() {
        // check commonVars.regions and display text
        var current = getRegionFromTime();
        if (current && commonVars.currentRegion && current.uuid != commonVars.currentRegion.uuid) {
            // update current region
            commonVars.currentRegion = current;
            // show help text
            commonVars.domUtils.highlightRegionRow(commonVars.currentRegion);
            highlightWaveform();
        }
    });
    /* /WAVESURFER */

});
// ======================================================================================================== //
// DOCUMENT READY END
// ======================================================================================================== //

// listen to resource play mode options change event
$('body').on('change', '#media_resource_options_mode', function(e) {
    var selected = e.target.options[e.target.selectedIndex];
    // if the option free view is selected show annotation option
    if (selected.value === 'free') {
        $('#transcription-row').show();
    } else {
        $('#media_resource_options_showTextTranscription').prop('checked', false);
        $('#transcription-row').hide();
    }
});

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

// create a new region "object" and create a new row in the dom
function createRegion(time) {
    // each time we create a new region we have to split an existing one
    // find the region to split / update
    var toSplit = getRegionFromTime(time);
    // region to create after the given time
    var region = {
        start: Number(time),
        end: Number(toSplit.end),
        uuid: commonVars.strUtils.createGuid(),
        note: '',
        hasHelp: false,
        helpUuid: '',
        loop: false,
        backward: false,
        rate: false,
        texts: false
    };
    // find corresponding dom row and update the end infos (in visible and hidden fields and )
    var $regionRow = commonVars.domUtils.getRegionRow(toSplit.start, toSplit.end);
    // update "left" region in array
    toSplit.end = time;
    // update "left" region in DOM
    $regionRow.find('input.hidden-end').val(time);
    var hms = commonVars.javascriptUtils.secondsToHms(toSplit.end);
    $regionRow.find('.end').text(hms);

    // add the "right" region row in the dom
    commonVars.domUtils.addRegionToDom(region, commonVars.javascriptUtils, $regionRow);
    commonVars.regions.push(region);
    updateRegionRowIndexes();
    commonVars.currentRegion = region;
    highlightWaveform();
}

// build commonVars.markers, commonVars.regions from existing ones
function initRegionsAndMarkers() {
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
            id: id, // @TODO check if still usefull
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
        // create marker for each existing region
        if (Number(start) > 0) {
            addMarker(start, uuid);
        }

        var regionRow = commonVars.domUtils.getRegionRow(start, end);
        var btn = $(regionRow).find('button.fa-trash-o');
        $(btn).attr('data-uuid', region.uuid);

    });
    if (commonVars.regions.length === 0) {
        var region = {
            uuid: commonVars.strUtils.createGuid(),
            start: 0,
            end: Number(commonVars.wavesurfer.getDuration()),
            note: '',
            hasHelp: false,
            helpUuid: '',
            loop: false,
            backward: false,
            rate: false,
            texts: false,
            links: false
        };
        commonVars.regions.push(region);
        // no region row yet so happend the new row to commonVars.regions container
        var $appendTo = $('.regions-container');
        // add region row
        var regionRow = commonVars.domUtils.addRegionToDom(region, commonVars.javascriptUtils, $appendTo);
        var btn = $(regionRow).find('button.fa-trash-o');
        $(btn).attr('data-uuid', region.uuid);
    }

    updateRegionRowIndexes();
    return true;
}

function updateRegionRowIndexes() {
    var index = 1;
    $('.row-index').each(function() {
        $(this).text(index);
        index++;
    });
}

function highlightWaveform(){
    commonVars.wavesurfer.clearRegions();
    var wRegion = commonVars.wavesurfer.addRegion({
        start: commonVars.currentRegion.start,
        end: commonVars.currentRegion.end,
        color: 'rgba(255,0,0,0.5)',
        drag: false,
        resize: false
    });
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

    var self = this;
    self.regionEnd = end;
    self.regionStart = start;
    commonVars.htmlAudioPlayer.addEventListener('timeupdate', function() {
        if (commonVars.htmlAudioPlayer.currentTime >= self.regionEnd) {
            commonVars.htmlAudioPlayer.pause();
            commonVars.htmlAudioPlayer.currentTime = self.regionStart;
            if (commonVars.htmlAudioPlayer.loop) {
                commonVars.htmlAudioPlayer.play();
            } else {
                commonVars.playing = false;
            }
        }
    });
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


// ======================================================================================================== //
// CONFIG REGION MODAL FUNCTIONS
// ======================================================================================================== //
/**
 * Open config modal
 * @param the source of the event (button)
 */
function configRegion(elem) {

    var $row = $(elem).closest('.region');
    var content = commonVars.domUtils.setRegionConfigModalContent($row);
    var region = getRegionByUuid($row.data('uuid'));
    if (commonVars.playing) {
        commonVars.wavesurfer.pause();
        commonVars.playing = false;
    }

    var configModal;

    $('#regionConfigModal').on('show.bs.modal', function() {
        configModal = $(this);
        // clear modal previous content
        configModal.find('.modal-body').empty();
        configModal.find('.modal-body').append(content);

        var uuid = $('#select-help-related-region :selected').val();
        currentHelpRelatedRegion = getRegionByUuid(uuid);

        // check links inputs
        var expression = "https?://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?";
        var regex = new RegExp(expression);
        $('.modal-help-links').on('keyup paste input', function(){
          var val = $(this).val();
          if(val !== '' && !regex.test(val)){
            $('#close-btn').prop('disabled', true);
          } else {
            $('#close-btn').prop('disabled', false);
          }

        });
    });

    $('#regionConfigModal').on('hidden.bs.modal', function(e) {
        // unbind modal events
        $(e.currentTarget).unbind();

        currentHelpRelatedRegion = null;
        if (commonVars.playing) {
            commonVars.htmlAudioPlayer.pause();
            commonVars.playing = false;
        }
        // get region help config values in modal
        var hasLoop = configModal.find('input[name=loop]').is(':checked');
        var hasBackward = configModal.find('input[name=backward]').is(':checked');
        var hasRate = configModal.find('input[name=rate]').is(':checked');
        var helpId = configModal.find("#select-help-related-region").val();
        var helpTexts = [];
        configModal.find('.modal-help-texts').each(function() {
            var text = $(this).val() ? $(this).val() : '';
            helpTexts.push(text);
        });
        var helpLinks = [];
        $('.modal-help-links').each(function() {
            var link = $(this).val() ? $(this).val() : '';
            helpLinks.push(link);
        });
        // set proper hidden inputs values
        //help-region-uuid
        var helpRegionUuid = $row.find('.hidden-config-help-region-uuid');
        //loop elem
        var loop = $row.find('.hidden-config-loop');
        //backward
        var backward = $row.find('.hidden-config-backward');
        //rate
        var rate = $row.find('.hidden-config-rate');
        rate.val(hasRate ? '1' : '0');
        backward.val(hasBackward ? '1' : '0');
        loop.val(hasLoop ? '1' : '0');
        if (helpId != -1)
            helpRegionUuid.val(helpId);
        else {
            helpRegionUuid.val('');
        }
        $row.find('.hidden-help-links').each(function($index) {
            $(this).val(helpLinks[$index]);
        });
        $row.find('.hidden-help-texts').each(function($index) {
            $(this).val(helpTexts[$index]);
        });

        // add color to the config button if any value in config parameters
        updateConfigButtonColor();
        updateRegionObjectHelp(region, $row);
    });

    $('#regionConfigModal').modal("show");
}

function updateRegionObjectHelp(region, $row) {
    region.texts = [];
    region.links = [];
    $row.find('.hidden-help-texts').each(function() {
        if ($(this).val() !== '') {
            region.texts.push($(this).val());
        }
    });
    $row.find('.hidden-help-links').each(function() {
        if ($(this).val() !== '') {
            region.links.push($(this).val());
        }
    });

    var note = $row.find('.note').html() ? $row.find('.note').html() : $row.find('.note').text();
    region.note = note;
    region.helpUuid = $row.find('.hidden-config-help-region-uuid').val() !== '' ? true : false;
    region.loop = $row.find('.hidden-config-loop').val() === '1' ? true : false;
    region.backward = $row.find('.hidden-config-backward').val() === '1' ? true : false;
    region.rate = $row.find('.hidden-config-rate').val() === '1' ? true : false;
    region.hasHelp = region.rate || region.backward || region.texts.length > 0 || region.links.length > 0 || region.loop || region.helpUuid !== '';
}

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

/**
 * fired by ConfigRegion Modal <select> element (help related region)
 * @param {type} elem the source of the event
 **/
$('body').on('change', '#select-help-related-region', function() {
    // get region uuid
    var uuid = $(this).find(":selected").val();
    currentHelpRelatedRegion = getRegionByUuid(uuid);
    if (commonVars.playing) {
        commonVars.wavesurfer.pause();
        commonVars.playing = false;
    }
});

// color config region buttons if
function checkIfRowHasConfigValue(row) {
    var helpRelatedRegion = $(row).find('.hidden-config-help-region-uuid').val() !== '' ? true : false;
    var loop = $(row).find('.hidden-config-loop').val() === '1' ? true : false;
    var backward = $(row).find('.hidden-config-backward').val() === '1' ? true : false;
    var rate = $(row).find('.hidden-config-rate').val() === '1' ? true : false;
    var texts = [];
    $(row).find('.hidden-help-texts').each(function() {
        if ($(this).val() !== '') {
            texts.push($(this).val());
        }
    });
    var links = [];
    $(row).find('.hidden-help-links').each(function() {
        if ($(this).val() !== '') {
            links.push($(this).val());
        }
    });
    return helpRelatedRegion || loop || backward || rate || texts.length > 0 || links.length > 0;
}

// ======================================================================================================== //
// CONFIG REGION MODAL FUNCTIONS END
// ======================================================================================================== //




// ======================================================================================================== //
// MARKERS
// ======================================================================================================== //

/*
 * Add a marker to the DOM and in collection
 */
function addMarker(time, uuid) {

    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();
    var cHeight = $canvas.height();

    var left = getMarkerLeftPostionFromTime(time);
    var markerWidth = 1;
    var dragHandlerBorderSize = 1;
    var dragHandlerSize = 18;
    var dragHandlerTop = cHeight / 2 - dragHandlerSize / 2;
    var dragHandlerLeft = dragHandlerBorderSize - dragHandlerSize / 2;

    var marker = document.createElement('div');
    marker.className = 'divide-marker';
    marker.style.left = left + 'px';
    marker.style.width = markerWidth + 'px';
    marker.dataset.time = time;

    var dragHandler = document.createElement('div');
    dragHandler.className = 'marker-drag-handler';
    dragHandler.style.border = dragHandlerBorderSize + 'px solid white';
    dragHandler.style.width = dragHandlerSize + 'px';
    dragHandler.style.height = dragHandlerSize + 'px';
    dragHandler.style.top = dragHandlerTop + 'px';
    dragHandler.style.left = dragHandlerLeft + 'px';
    dragHandler.title = Translator.trans('marker_drag_title', {}, 'media_resource');
    dragHandler.dataset.position = dragHandlerLeft;
    var guid = uuid || commonVars.strUtils.createGuid();
    dragHandler.dataset.uuid = guid;

    marker.appendChild(dragHandler);
    $('#waveform').find('wave').first().append(marker);




    var dragData;
    // set the drag data when handler is clicked
    dragHandler.addEventListener('mousedown', function(event) {
        var time = getTimeFromPosition($(event.target).closest('.divide-marker').position().left);
        dragData = setDragData(time, marker);
    });

    $(marker).draggable({
        handle: ".marker-drag-handler",
        axis: "x",
        containment: "#waveform",
        drag: function() {
            var time = getTimeFromPosition($(this).position().left);
            // check obstacles
            if (dragData && dragData.minTime < time && dragData.maxTime > time) {
                updateTimeData(time, dragData);
            } else if (dragData && time > dragData.maxTime) {
                // update data and slightly move marker left
                updateTimeData(time - 0.2, dragData);
                changeMarkerPosition(time - 0.2, dragData);
                return false;
            } else if (dragData && time < dragData.minTime) {
                // update data and slightly move marker right
                updateTimeData(time + 0.2, dragData);
                changeMarkerPosition(time + 0.2, dragData);
                return false;
            }
        },
        stop: function() {
            var time = getTimeFromPosition($(this).position().left);
            updateTimeData(time, dragData);

        }
    });
    var mark = {
        time: Number(time),
        uuid: guid
    };
    commonVars.markers.push(mark);
    return mark;
}

/*
 * While dragging we need to update some fields
 * therefore we need to store some data
 * marker is the dom marker
 */
function setDragData(time, marker) {
    var data = {};
    var hiddenEndToUpdate;
    var hiddenStartToUpdate;
    var endToUpdate;
    var startToUpdate;
    $('.region').each(function() {
        var start = Number($(this).find('input.hidden-start').val());
        var end = Number($(this).find('input.hidden-end').val());
        // first row to update (should update this row end value and hidden end value)
        if (time.toFixed(2) === end.toFixed(2)) {
            hiddenEndToUpdate = $(this).find('input.hidden-end');
            endToUpdate = $(this).find('.end');
        } else if (time.toFixed(2) === start.toFixed(2)) {
            hiddenStartToUpdate = $(this).find('input.hidden-start');
            startToUpdate = $(this).find('.start');
        }
    });
    // marker should not be moved before the previous nore after the next one
    var tolerance = 1;
    // since we are on a frontier, add / remove a little time to ensure next / prev search
    var prevRegion = getPrevRegion(time + 0.01);
    var nextRegion = getNextRegion(time - 0.01);
    var min = prevRegion && prevRegion.start ? prevRegion.start : 0;
    var max = nextRegion && nextRegion.end ? nextRegion.end : commonVars.wavesurfer.getDuration();

    // search for marker object
    var markerObject;
    for (var i = 0; i < commonVars.markers.length; i++) {
        if (commonVars.markers[i].time.toFixed(2) === time.toFixed(2)) {
            markerObject = commonVars.markers[i];
        }
    }

    data = {
        hiddenEndToUpdate: hiddenEndToUpdate,
        endToUpdate: endToUpdate,
        hiddenStartToUpdate: hiddenStartToUpdate,
        startToUpdate: startToUpdate,
        minTime: min + tolerance,
        maxTime: max - tolerance,
        prevRegion: prevRegion,
        nextRegion: nextRegion,
        marker: marker,
        markerO: markerObject
    };
    return data;
}

function getMarkerLeftPostionFromTime(time) {
    var duration = commonVars.wavesurfer.getDuration();
    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();
    return time * cWidth / duration;
}

/*
 * update data while dragging
 * should also update marker data-time value
 */
function updateTimeData(time, dragData) {
    $(dragData.startToUpdate).text(commonVars.javascriptUtils.secondsToHms(time));
    $(dragData.hiddenStartToUpdate).val(time);

    // update region object data
    if (dragData.prevRegion) {
        dragData.prevRegion.end = Number(time);
    }
    if (dragData.nextRegion) {
        dragData.nextRegion.start = Number(time);
    }

    if (dragData.hiddenEndToUpdate && dragData.endToUpdate) {
        $(dragData.hiddenEndToUpdate).val(time);
        $(dragData.endToUpdate).text(commonVars.javascriptUtils.secondsToHms(time));
    }

    // udpate dom marker data-time attribute
    dragData.marker.dataset.time = time;
    // udpate marker object time value
    dragData.markerO.time = time;
    // change waveform highlight
    highlightWaveform();
}

function changeMarkerPosition(time, dragData) {
    // in case of moving the marker to some specific places, time attribute will be modified
    // so in any case reset the position of the marker
    var position = getMarkerLeftPostionFromTime(time);
    dragData.marker.style.left = position + 'px';
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

function removeRegionFromCollection(uuid) {
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].uuid === uuid) {
            commonVars.regions.splice(i, 1);
        }
    }
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
 * Delete a region from the collection remove it from DOM and update times (start or end) of contiguous commonVars.regions
 * Also handle corresponding marker deletion
 * @param elem the source of the event
 */
function deleteRegion(elem) {
    // can not delete region if just one ( = the default one) -> or not...
    if (commonVars.regions.length === 1) {
        $('#alertModal').modal('show');
    } else {
        // get region to delete uuid
        var uuid = $(elem).data('uuid');
        if (uuid) {
            var toRemove = getRegionByUuid(uuid);
            var regionDomRow = $(elem).closest(".region");
            var regionUuid = $(regionDomRow).attr("data-uuid");
            var usedInHelp = commonVars.domUtils.getRegionsUsedInHelp(regionUuid);
            // if confirm
            $('#confirmModal').modal('show').one('click', '#confirm', function() {
                // remove help reference(s) if needed
                if (usedInHelp.length > 0) {
                    for (var index = 0; index < usedInHelp.length; index++) {
                        var elem = usedInHelp[index];
                        // reset element value
                        $(elem).val('');
                    }
                }

                var start = Number(toRemove.start);
                var end = Number(toRemove.end);
                // if we are deleting the first region
                if (start === 0) {
                    var next = getNextRegion(end - 0.1);
                    if (next) {
                        next.start = 0;
                        // update time (DOM)
                        var hiddenInputToUpdate = regionDomRow.next().find("input.hidden-start");
                        hiddenInputToUpdate.val(start);
                        var divToUpdate = regionDomRow.next().find(".time-text.start");
                        divToUpdate.text(commonVars.javascriptUtils.secondsToHms(start));
                        commonVars.currentRegion = next;

                    } else {
                        console.log('not found');
                    }
                } else { // all other cases
                    // get previous region and update it's end
                    var previous = getPrevRegion(start + 0.1);
                    if (previous) {
                        previous.end = end;
                        // update time (DOM)
                        var hiddenInputToUpdate = regionDomRow.prev().find("input.hidden-end");
                        hiddenInputToUpdate.val(end);
                        var divToUpdate = regionDomRow.prev().find(".time-text.end");
                        divToUpdate.text(commonVars.javascriptUtils.secondsToHms(end));
                        commonVars.currentRegion = previous;
                    } else {
                        console.log('not found');
                    }
                }
                // update region array
                removeRegionFromCollection(uuid);
                // remove region DOM row
                $(regionDomRow).remove();
                // remove marker from DOM
                $('.marker-drag-handler').each(function() {
                    var $marker = $(this).closest('.divide-marker');
                    var time = Number($marker.attr('data-time'));
                    if (time === start) {
                        $marker.remove();
                    }
                });
                // remove marker from array
                for (var i = 0; i < commonVars.markers.length; i++) {
                    if (commonVars.markers[i].time === start) {
                        commonVars.markers.splice(i, 1);
                    }
                }
                updateRegionRowIndexes();
                // highlight region on waveform
                highlightWaveform();
            });
        }
    }
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
    if (commonVars.playing || commonVars.wavesurfer.isPlaying()) {
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


/**
 * Add a color to region config button if any config parameter found for the row
 */
function updateConfigButtonColor() {
    $('.region').each(function() {
        if (checkIfRowHasConfigValue($(this))) {
            $(this).find('.fa.fa-cog').closest('.btn').addClass('btn-warning').removeClass('btn-default');
        } else {
            $(this).find('.fa.fa-cog').closest('.btn').removeClass('btn-warning').addClass('btn-default');
        }
    });
}

function manualTextAnnotation(text, css) {
    if (!css) {
        document.execCommand('insertHTML', false, css);
    } else {
        document.execCommand('insertHTML', false, '<span class="' + css + '">' + text + '</span>');
    }
}

// ======================================================================================================== //
//  OTHER MIXED FUNCTIONS END
// ======================================================================================================== //
