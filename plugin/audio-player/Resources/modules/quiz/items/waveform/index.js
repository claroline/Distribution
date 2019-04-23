import merge from 'lodash/merge'

import {trans} from '#/main/app/intl/translation'

import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

import {WaveformItem} from '#/plugin/audio-player/quiz/items/waveform/prop-types'

// components
import {WaveformPaper} from '#/plugin/audio-player/quiz/items/waveform/components/paper'
import {WaveformPlayer} from '#/plugin/audio-player/quiz/items/waveform/components/player'
import {WaveformFeedback} from '#/plugin/audio-player/quiz/items/waveform/components/feedback'
import {WaveformEditor} from '#/plugin/audio-player/quiz/items/waveform/components/editor'

// scores
import ScoreSum from '#/plugin/exo/scores/sum'

export default {
  name: 'waveform',
  type: 'application/x.waveform+json',
  tags: [trans('question', {}, 'quiz')],
  answerable: true,

  paper: WaveformPaper,
  player: WaveformPlayer,
  feedback: WaveformFeedback,

  components: {
    editor: WaveformEditor
  },

  /**
   * List all available score modes for a waveform item.
   *
   * @return {Array}
   */
  supportScores: () => [
    ScoreSum
  ],

  /**
   * Create a new waveform item.
   *
   * @param {object} baseItem
   *
   * @return {object}
   */
  create: (baseItem) => merge({}, baseItem, WaveformItem.defaultProps),

  /**
   * Correct an answer submitted to a waveform item.
   *
   * @return {CorrectedAnswer}
   */
  getCorrectedAnswer: () => new CorrectedAnswer()
}
