class ConfigService {
  constructor($filter) {
    this.filter = $filter
  }

  getHelPlayModes() {
    return {
      NORMAL: 1,
      LOOP: 2,
      SLOW: 3,
      TTS: 4,
      RELATED: 5
    }
  }

  getAvailableTTSLanguage() {
    return [{
      name: this.filter('trans')('options_form_tts_choices_en_US', {}, 'media_resource'),
      value: 'en-US'
    }, {
      name: this.filter('trans')('options_form_tts_choices_en_GB', {}, 'media_resource'),
      value: 'en-GB'
    }, {
      name: this.filter('trans')('options_form_tts_choices_de_DE', {}, 'media_resource'),
      value: 'de-DE'
    }, {
      name: this.filter('trans')('options_form_tts_choices_es_ES', {}, 'media_resource'),
      value: 'es-ES'
    }, {
      name: this.filter('trans')('options_form_tts_choices_fr_FR', {}, 'media_resource'),
      value: 'fr-FR'
    }, {
      name: this.filter('trans')('options_form_tts_choices_it_IT', {}, 'media_resource'),
      value: 'it-IT'
    } ]
  }

  getAvailablePlayModes() {
    return [{
      name: this.filter('trans')('options_form_view_mode_choices_live', {}, 'media_resource'),
      value: 'live'
    }, {
      name: this.filter('trans')('options_form_view_mode_choices_pause', {}, 'media_resource'),
      value: 'pause'
    }, {
      name: this.filter('trans')('options_form_view_mode_choices_free', {}, 'media_resource'),
      value: 'free'
    }, {
      name: this.filter('trans')('options_form_view_mode_choices_active', {}, 'media_resource'),
      value: 'active'
    }, {
      name: this.filter('trans')('options_form_view_mode_choices_scripted_active', {}, 'media_resource'),
      value: 'scripted_active'
    } ]
  }

  getWavesurferOptions() {
    return {
      container: '#waveform',
      waveColor: '#172B32',
      progressColor: '#00A1E5',
      height: 256,
      interact: true,
      scrollParent: false,
      normalize: true,
      minimap: true
    }
  }

  getAutoPauseTime() {
    return 2000
  }
}

export default ConfigService
