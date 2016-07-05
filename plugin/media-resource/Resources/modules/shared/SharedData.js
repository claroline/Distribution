import DomUtils from '../helpers/dom-utils';
import JsUtils from '../helpers/js-utils';
import StringUtils from '../helpers/string-utils';
import WaveSurfer from 'wavesurfer.js/dist/wavesurfer';
// no other way to make plugins work...
window.WaveSurfer = WaveSurfer;

export default class SharedData {

    getSharedData() {
        return {
            wavesurfer: Object.create(WaveSurfer),
            wavesurferOptions: {
                container: '#waveform',
                waveColor: '#172B32',
                progressColor: '#00A1E5',
                height: 256,
                interact: true,
                scrollParent: false,
                normalize: true,
                minimap: true
            },
            wId: $('input[name="wId"]').val(),
            mrId: $('input[name="mrId"]').val(),
            htmlAudioPlayer: document.getElementById('html-audio-player'),
            regions: [],
            audioData: null,
            playing: false,
            strUtils: new StringUtils(),
            javascriptUtils: new JsUtils(),
            domUtils: new DomUtils(),
            markers: [],
            currentRegion: null,
            playMode: {
                PLAY_NORMAL: 1,
                PLAY_LOOP: 2,
                PLAY_SLOW: 3,
                PLAY_TTS: 4
            }
        }
    }
}
