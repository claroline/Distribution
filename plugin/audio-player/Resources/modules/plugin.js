/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineAudioPlayerBundle', {
  quizItems: {
    'waveform' : () => { return import(/* webpackChunkName: "quiz-item-waveform" */    '#/plugin/audio-player/quiz/items/waveform') }
  }
})
