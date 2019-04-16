import merge from 'lodash/merge'

import {trans} from '#/main/app/intl/translation'

import {emptyAnswer, CorrectedAnswer, Answerable} from '#/plugin/exo/items/utils'
import {ChoiceItem} from '#/plugin/exo/items/choice/prop-types'

// components
import {ChoiceEditor} from '#/plugin/exo/items/choice/components/editor'
import {ChoiceFeedback} from '#/plugin/exo/items/choice/components/feedback'
import {ChoicePaper} from '#/plugin/exo/items/choice/components/paper'
import {ChoicePlayer} from '#/plugin/exo/items/choice/components/player'

// scores
import ScoreFixed from '#/plugin/exo/scores/fixed'
import ScoreRules from '#/plugin/exo/scores/rules'
import ScoreSum from '#/plugin/exo/scores/sum'

export default {
  name: 'choice',
  type: 'application/x.choice+json',
  tags: [trans('question', {}, 'quiz')],
  answerable: true,

  paper: ChoicePaper,
  player: ChoicePlayer,
  feedback: ChoiceFeedback,

  components: {
    editor: ChoiceEditor
  },

  /**
   * List all available score modes for a choice item.
   *
   * @param {object} item
   *
   * @return {Array}
   */
  supportScores: (item) => {
    const supportedScores = [
      ScoreFixed,
      ScoreSum
    ]

    if (item.multiple) {
      supportedScores.push(ScoreRules)
    }

    return supportedScores
  },

  /**
   * Create a new choice item.
   *
   * @param {object} baseItem
   *
   * @return {object}
   */
  create: (baseItem) => {
    // create 2 empty choices
    const firstChoice = emptyAnswer()
    const secondChoice = emptyAnswer()

    return merge({}, baseItem, ChoiceItem.defaultProps, {
      choices: [firstChoice, secondChoice],
      // create solutions for choices
      solutions: [
        {
          id: firstChoice.id,
          score: 1,
          feedback: ''
        }, {
          id: secondChoice.id,
          score: 0,
          feedback: ''
        }
      ]
    })
  },

  /**
   * Correct an answer submitted to a choice item.
   *
   * @param {object} item
   * @param {object} answers
   *
   * @return {CorrectedAnswer}
   */
  correctAnswer: (item, answers = null) => {
    const corrected = new CorrectedAnswer()

    item.solutions.forEach(choice => {
      const score = choice.score

      if (answers && answers.data && answers.data.indexOf(choice.id) > -1) {
        score > 0 ?
          corrected.addExpected(new Answerable(score)) :
          corrected.addUnexpected(new Answerable(score))
      } else {
        if (score > 0) {
          corrected.addMissing(new Answerable(score))
        } else {
          corrected.addExpectedMissing(new Answerable(score))
        }
      }
    })

    return corrected
  }
}
