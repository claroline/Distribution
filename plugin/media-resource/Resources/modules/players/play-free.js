import SharedData from '../shared/SharedData'
import 'wavesurfer.js/plugin/wavesurfer.minimap'
import 'wavesurfer.js/plugin/wavesurfer.timeline'
import 'wavesurfer.js/plugin/wavesurfer.regions'

var helpRegion;
var helpIsPlaying = false;
var showTextTranscription;
var currentHelpTextIndex = 0;
let shared;

// ======================================================================================================== //
// ACTIONS BOUND WHEN DOM READY END
// ======================================================================================================== //

$(document).ready(function() {
    // get some hidden inputs usefull values
    showTextTranscription = $('input[name="textTranscription"]').val() === '1' ? true : false;
    const sharedData = new SharedData()
    shared = sharedData.getSharedData()
    console.log(shared);
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

    shared.audioData = Routing.generate('innova_get_mediaresource_resource_file', {
        workspaceId: shared.wId,
        id: shared.mrId
    });

    shared.htmlAudioPlayer.src = shared.audioData;
    shared.wavesurfer.load(shared.audioData);

    createRegions();
    if (shared.regions.length > 0) {
        shared.currentRegion = shared.regions[0];
        if (showTextTranscription) {
            // show help text
            $('.help-text').html(shared.currentRegion.note);
        }
    }

    shared.wavesurfer.on('ready', function() {
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: shared.wavesurfer,
            container: '#wave-timeline'
        });
    });

    shared.wavesurfer.on('seek', function() {
        if (shared.playing) {
            if (shared.wavesurfer.isPlaying()) {
                shared.wavesurfer.pause();
                shared.wavesurfer.setVolume(1);
                shared.wavesurfer.setPlaybackRate(1);
            }
            // pause help
            shared.htmlAudioPlayer.pause();
            shared.htmlAudioPlayer.currentTime = 0;
        }
        var current = getRegionFromCurrentTime();
        if (current && shared.currentRegion && current.id != shared.currentRegion.id) {
            // update current region
            shared.currentRegion = current;
            if (showTextTranscription) {
                // show help text
                $('.help-text').html(shared.currentRegion.note);
            }
        }

        if (!shared.playing) {
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
            shared.wavesurfer.play();
        }
    });

    shared.wavesurfer.on('audioprocess', function() {
        // check shared.regions and display text
        var current = getRegionFromCurrentTime();
        if (current && shared.currentRegion && current.id != shared.currentRegion.id) {
            // update current region
            shared.currentRegion = current;
            if (showTextTranscription) {
                // show help text
                $('.help-text').html(shared.currentRegion.note);
            }

        }
    });

    shared.wavesurfer.on('finish', function() {
        shared.wavesurfer.seekAndCenter(0);
        shared.wavesurfer.pause();
        shared.playing = false;
    });
    /* /WAVESURFER */
});


$('body').on('click', '#btn-toggle-transcription', function(){
  toggleTextTranscription()
})

$('body').on('click', '#btn-play', function(){
  play()
})

$('body').on('click', '#btn-loop', function(){
  playInLoop()
})

$('body').on('click', '#btn-backward', function(){
  playBackward()
})

$('body').on('click', '#btn-slow', function(){
  playSlowly()
})

$('body').on('click', '#btn-text', function(){
  showHelpText()
})


function toggleTextTranscription() {
    showTextTranscription = !showTextTranscription;
    if (showTextTranscription) {
        $('.help-text').html(shared.currentRegion.note);
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
    var duration = shared.wavesurfer.getDuration();
    var $canvas = $('#waveform').find('wave').first().find('canvas').first();
    var cWidth = $canvas.width();

    return time * cWidth / duration;
}

// play
function play() {
    shared.htmlAudioPlayer.pause();
    shared.htmlAudioPlayer.currentTime = 0;
    shared.wavesurfer.playPause();
    shared.playing = shared.playing ? false : true;
    if (shared.playing) {
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
    for (var i = 0; i < shared.regions.length; i++) {
        if (shared.regions[i].start <= time && shared.regions[i].end > time) {
            region = shared.regions[i];
            break;
        }
    }
    return region;
}

function getNextRegion(time) {
    var next;
    // find next region relatively to given time
    for (var i = 0; i < shared.regions.length; i++) {
        if (shared.regions[i].start == time) {
            next = shared.regions[i];
        }
    }
    return next;
}

function playInLoop() {
    hideHelpText();
    shared.wavesurfer.setPlaybackRate(1);
    var options = {
        start: helpRegion.start,
        end: helpRegion.end,
        loop: true,
        drag: false,
        resize: false,
        color: 'rgba(0,0,0,0)' //invisible
    };
    var region = shared.wavesurfer.addRegion(options);
    if (shared.playing) {
        shared.playing = false;
        shared.wavesurfer.un('pause');
        shared.wavesurfer.pause();
        shared.wavesurfer.clearRegions();
    } else {
        region.play();
        shared.wavesurfer.on('pause', function(){
          if(options.loop){
            region.play();
            shared.playing = true;
          } else {
            shared.playing = false;
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
    var region = shared.wavesurfer.addRegion(options);
    // stop shared.playing if shared.playing
    if (shared.playing) {
        shared.playing = false;
        shared.wavesurfer.pause();
        shared.wavesurfer.clearRegions();
        shared.wavesurfer.setPlaybackRate(1);
        shared.htmlAudioPlayer.pause();
        shared.wavesurfer.setVolume(1);
    } else {
        shared.wavesurfer.setPlaybackRate(0.8);
        shared.wavesurfer.setVolume(0);
        shared.htmlAudioPlayer.playbackRate = 0.8;
        shared.htmlAudioPlayer.currentTime = helpRegion.start;
        region.play();
        shared.htmlAudioPlayer.play();
        shared.playing = true;
        // at the end of the region stop every audio readers
        shared.wavesurfer.once('pause', function() {
            shared.playing = false;
            shared.htmlAudioPlayer.pause();
            var progress = region.start / shared.wavesurfer.getDuration();
            shared.wavesurfer.seekTo(progress);
            shared.htmlAudioPlayer.currentTime = region.start;
            shared.wavesurfer.clearRegions();
            shared.wavesurfer.setPlaybackRate(1);
            shared.wavesurfer.setVolume(1);
            shared.htmlAudioPlayer.playbackRate = 1;
        });
    }
}

function playBackward() {
    hideHelpText();
    // is shared.playing for real audio (ie not for TTS)
    if (shared.playing) {
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
        // check if utterance is already speaking before shared.playing (multiple click on backward button)
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
        shared.playing = true;
        sayIt(toSay, function() {
            index = index - 1;
            handleUtterancePlayback(index, textArray);
        });
    } else {
        shared.playing = false;
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
    if (shared.playing) {
        shared.playing = false;
        if (shared.wavesurfer.isPlaying()) shared.wavesurfer.pause();
        shared.htmlAudioPlayer.pause();
        if (window.speechSynthesis.speaking) {
            // can not really stop shared.playing tts since the callback can not be canceled
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
    var currentTime = shared.wavesurfer.getCurrentTime();
    var region;
    for (var i = 0; i < shared.regions.length; i++) {
        if (shared.regions[i].start <= currentTime && shared.regions[i].end > currentTime) {
            region = shared.regions[i];
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
        shared.regions.push(region);
    });
    if (shared.regions.length === 0) {
        var region = {
            id: 0,
            uuid: '',
            start: 0,
            end: shared.wavesurfer.getDuration(),
            note: '',
            hasHelp: false,
            helpUuid: '',
            loop: false,
            backward: false,
            rate: false,
            texts: false
        };
        shared.regions.push(region);
    }
    return true;
}
