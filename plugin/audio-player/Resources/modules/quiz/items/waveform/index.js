import merge from 'lodash/merge'
import times from 'lodash/times'

import {trans} from '#/main/app/intl/translation'

import {CorrectedAnswer, Answerable} from '#/plugin/exo/quiz/correction/components/corrected-answer'

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
   * @param {object} item
   * @param {object} answers
   *
   * @return {CorrectedAnswer}
   */
  getCorrectedAnswer: (item, answers = null) => {
    const corrected = new CorrectedAnswer()

    item.solutions.forEach(solution => {
      let found = false

      if (answers && answers.data) {
        answers.data.forEach(selection => {
          if (selection.start >= solution.section.start - solution.section.startTolerance &&
            selection.start <= solution.section.start &&
            selection.end >= solution.section.end &&
            selection.end <= solution.section.end + solution.section.endTolerance
          ) {
            found = true
          }
        })
      }
      if (found) {
        solution.score > 0 ?
          corrected.addExpected(new Answerable(solution.score)) :
          corrected.addUnexpected(new Answerable(solution.score))
      } else if (solution.score > 0) {
        corrected.addMissing(new Answerable(solution.score))
      }
    })

    if (answers && answers.data) {
      let nbPenalities = 0

      answers.data.forEach(selection => {
        let found = false

        item.solutions.forEach(solution => {
          if (selection.start >= solution.section.start - solution.section.startTolerance &&
            selection.start <= solution.section.start &&
            selection.end >= solution.section.end &&
            selection.end <= solution.section.end + solution.section.endTolerance
          ) {
            found = true
          }
        })

        if (!found) {
          ++nbPenalities
        }
      })
      times(nbPenalities, () => corrected.addPenalty(new Answerable(item.penalty)))
    }

    return corrected
  }
}
