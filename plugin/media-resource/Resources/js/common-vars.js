var commonVars = {
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
    strUtils: Object.create(StringUtils),
    javascriptUtils: Object.create(JavascriptUtils),
    domUtils: Object.create(DomUtils),
    markers: [],
    currentRegion: null
};
