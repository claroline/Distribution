'use strict';

var helpRegion;
var helpIsPlaying = false;
var showTextTranscription;
var currentHelpTextIndex = 0;

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY END
// ======================================================================================================== //

$(document).ready(function() {
    // get some hidden inputs usefull values
    showTextTranscription = $('input[name="textTranscription"]').val() === '1' ? true : false;

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

    commonVars.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: commonVars.wId,
        id: commonVars.mrId
    });

    commonVars.htmlAudioPlayer.src = commonVars.audioData;
    commonVars.wavesurfer.load(commonVars.audioData);

    createRegions();
    if (commonVars.regions.length > 0) {
        commonVars.currentRegion = commonVars.regions[0];
        if (showTextTranscription) {
            // show help text
            $('.help-text').html(commonVars.currentRegion.note);
        }
    }

    commonVars.wavesurfer.on('ready', function() {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: commonVars.wavesurfer,
            container: '#wave-timeline'
        });
    });

    commonVars.wavesurfer.on('seek', function() {
        if (commonVars.playing) {
            if (commonVars.wavesurfer.isPlaying()) {
                commonVars.wavesurfer.pause();
                commonVars.wavesurfer.setVolume(1);
                commonVars.wavesurfer.setPlaybackRate(1);
            }
            // pause help
            commonVars.htmlAudioPlayer.pause();
            commonVars.htmlAudioPlayer.currentTime = 0;
        }
        var current = getRegionFromCurrentTime();
        if (current && commonVars.currentRegion && current.id != commonVars.currentRegion.id) {
            // update current region
            commonVars.currentRegion = current;
            if (showTextTranscription) {
                // show help text
                $('.help-text').html(commonVars.currentRegion.note);
            }
        }

        if (!commonVars.playing) {
            helpRegion = current;
            // hide any previous help info
            $('.region-highlight').remove();
            hideHelp();
            // show current help infos
            currentHelpTextIndex = 0;
            showHelp();
            highlight();
        } else {
            if (helpRegion && current && current.id != helpRegion.id) {
                $('.region-highlight').remove();
                hideHelp();
                currentHelpTextIndex = 0;
            }
            commonVars.wavesurfer.play();
        }
    });

    commonVars.wavesurfer.on('audioprocess', function() {
        // check commonVars.regions and display text
        var current = getRegionFromCurrentTime();
        if (current && commonVars.currentRegion && current.id != commonVars.currentRegion.id) {
            // update current region
            commonVars.currentRegion = current;
            if (showTextTranscription) {
                // show help text
                $('.help-text').html(commonVars.currentRegion.note);
            }

        }
    });

    commonVars.wavesurfer.on('finish', function() {
        commonVars.wavesurfer.seekAndCenter(0);
        commonVars.wavesurfer.pause();
        commonVars.playing = false;
    });
    /* /WAVESURFER */
});

function toggleTextTranscription() {
    showTextTranscription = !showTextTranscription;
    if (showTextTranscription) {
        $('.help-text').html(commonVars.currentRegion.note);
    } else {
        $('.help-text').html('');
    }
}

function highlight() {
    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();
    var cHeight = $canvas.height();
    var current = getRegionFromCurrentTime();
    var left = getPositionFromTime(parseFloat(current.start));
    var width = getPositionFromTime(parseFloat(current.end)) - left;

    var elem = document.createElement('div');
    elem.className = 'region-highlight';
    elem.style.left = left + 'px';
    elem.style.width = width + 'px';
    elem.style.height = cHeight + 'px';
    elem.style.top = '0px';
    $('#waveform').find('wave').first().append(elem);
    helpRegion = current;
}

function getPositionFromTime(time) {
    var duration = commonVars.wavesurfer.getDuration();
    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();

    return time * cWidth / duration;
}

// play
function play() {
    commonVars.htmlAudioPlayer.pause();
    commonVars.htmlAudioPlayer.currentTime = 0;
    commonVars.wavesurfer.playPause();
    commonVars.playing = commonVars.playing ? false : true;
    if (commonVars.playing) {
        $('#btn-play').removeClass('fa-play').addClass('fa-pause');
        $('.region-highlight').remove();
        hideHelp();
    } else {
        // show available help if any
        $('#btn-play').removeClass('fa-pause').addClass('fa-play');
        highlight();
        showHelp();
    }
}

function getRegionFromTime(time) {
    var region;
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].start <= time && commonVars.regions[i].end > time) {
            region = commonVars.regions[i];
            break;
        }
    }
    return region;
}

function getNextRegion(time) {
    var next;
    // find next region relatively to given time
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].start == time) {
            next = commonVars.regions[i];
        }
    }
    return next;
}

function playInLoop() {
    hideHelpText();
    commonVars.wavesurfer.setPlaybackRate(1);
    var options = {
        start: helpRegion.start,
        end: helpRegion.end,
        loop: true,
        drag: false,
        resize: false,
        color: 'rgba(0,0,0,0)' //invisible
    };
    var region = commonVars.wavesurfer.addRegion(options);
    if (commonVars.playing) {
        commonVars.playing = false;
        commonVars.wavesurfer.un('pause');
        commonVars.wavesurfer.pause();
        commonVars.wavesurfer.clearRegions();
    } else {
        region.play();
        commonVars.wavesurfer.on('pause', function(){
          if(options.loop){
            region.play();
            commonVars.playing = true;
          } else {
            commonVars.playing = false;
          }
        });
    }
}

function playSlowly() {
    hideHelpText();
    var options = {
        start: helpRegion.start,
        end: helpRegion.end,
        loop: false,
        drag: false,
        resize: false,
        color: 'rgba(0,0,0,0)' //invisible
    }
    var region = commonVars.wavesurfer.addRegion(options);
    // stop commonVars.playing if commonVars.playing
    if (commonVars.playing) {
        commonVars.playing = false;
        commonVars.wavesurfer.pause();
        commonVars.wavesurfer.clearRegions();
        commonVars.wavesurfer.setPlaybackRate(1);
        commonVars.htmlAudioPlayer.pause();
        commonVars.wavesurfer.setVolume(1);
    } else {
        commonVars.wavesurfer.setPlaybackRate(0.8);
        commonVars.wavesurfer.setVolume(0);
        commonVars.htmlAudioPlayer.playbackRate = 0.8;
        commonVars.htmlAudioPlayer.currentTime = helpRegion.start;
        region.play();
        commonVars.htmlAudioPlayer.play();
        commonVars.playing = true;
        // at the end of the region stop every audio readers
        commonVars.wavesurfer.once('pause', function() {
            commonVars.playing = false;
            commonVars.htmlAudioPlayer.pause();
            var progress = region.start / commonVars.wavesurfer.getDuration();
            commonVars.wavesurfer.seekTo(progress);
            commonVars.htmlAudioPlayer.currentTime = region.start;
            commonVars.wavesurfer.clearRegions();
            commonVars.wavesurfer.setPlaybackRate(1);
            commonVars.wavesurfer.setVolume(1);
            commonVars.htmlAudioPlayer.playbackRate = 1;
        });
    }
}

function playBackward() {
    hideHelpText();
    // is commonVars.playing for real audio (ie not for TTS)
    if (commonVars.playing) {
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
        // check if utterance is already speaking before commonVars.playing (multiple click on backward button)
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
        }, 200);
    } else {
        continueToSay(utterance, voices, lang, callback);
    }
}

function continueToSay(utterance, voices, lang, callback) {
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang == lang) {
            utterance.voice = voices[i];
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
        commonVars.playing = true;
        sayIt(toSay, function() {
            index = index - 1;
            handleUtterancePlayback(index, textArray);
        });
    } else {
        commonVars.playing = false;
    }
}


function showHelp() {
    var current = getRegionFromCurrentTime();
    var $root = $('.help-container');
    var html = '';
    if (current.loop) {
        $('#btn-loop').prop('disabled', false);
    } else {
        $('#btn-loop').prop('disabled', true);
    }
    if (current.backward) {
        $('#btn-backward').prop('disabled', false);
    } else {
        $('#btn-backward').prop('disabled', true);
    }
    if (current.rate) {
        $('#btn-slow').prop('disabled', false);
    } else {
        $('#btn-slow').prop('disabled', true);
    }
    if (current.texts.length > 0) {
        $('#btn-text').prop('disabled', false);
        $('.my-label').show();
    } else {
        $('#btn-text').prop('disabled', true);
        $('.my-label').hide();
    }
    $root.show();
}

function hideHelp() {
    $('.help-container').hide();
    currentHelpTextIndex = 0;
    // hide the help text container
    hideHelpText();
}

function showHelpText() {
    if (commonVars.playing) {
        commonVars.playing = false;
        if (commonVars.wavesurfer.isPlaying()) commonVars.wavesurfer.pause();
        commonVars.htmlAudioPlayer.pause();
        if (window.speechSynthesis.speaking) {
            // can not really stop commonVars.playing tts since the callback can not be canceled
            window.speechSynthesis.cancel();
        }
    }
    var current = getRegionFromCurrentTime();


    $('.help-text-item').text(current.texts[currentHelpTextIndex]);
    if (currentHelpTextIndex < current.texts.length - 1) {
        currentHelpTextIndex++;
    } else {
        currentHelpTextIndex = 0;
    }
    // say to user there is another text available (so if we currently display the text number 1 the label should display 2)
    var displayIndex = currentHelpTextIndex + 1;
    $('.my-label').text(displayIndex);
    $('.help-text-container').show();
}

function hideHelpText() {
    currentHelpTextIndex = 0;
    $('.my-label').text('1');
    $('.help-text-container').hide();
}

function getRegionFromCurrentTime() {
    var currentTime = commonVars.wavesurfer.getCurrentTime();
    var region;
    for (var i = 0; i < commonVars.regions.length; i++) {
        if (commonVars.regions[i].start <= currentTime && commonVars.regions[i].end > currentTime) {
            region = commonVars.regions[i];
            break;
        }
    }
    return region;
}

function createRegions() {
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
        $(this).find('.hidden-help-texts').each(function() {
            if ($(this).val() !== '') {
                texts.push($(this).val());
            }
        });
        var hasHelp = rate || backward || texts.length > 0 || loop || helpUuid !== '';
        var region = {
            id: id,
            uuid: uuid,
            start: start,
            end: end,
            note: note,
            hasHelp: hasHelp,
            helpUuid: helpUuid,
            loop: loop,
            backward: backward,
            rate: rate,
            texts: texts
        };
        commonVars.regions.push(region);
    });
    if (commonVars.regions.length === 0) {
        var region = {
            id: 0,
            uuid: '',
            start: 0,
            end: commonVars.wavesurfer.getDuration(),
            note: '',
            hasHelp: false,
            helpUuid: '',
            loop: false,
            backward: false,
            rate: false,
            texts: false
        };
        commonVars.regions.push(region);
    }
    return true;
}
