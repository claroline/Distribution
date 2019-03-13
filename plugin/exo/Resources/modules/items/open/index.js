import {trans} from '#/main/app/intl/translation'

import editor from './editor'
import {OpenPaper} from './paper.jsx'
import {OpenPlayer} from './player.jsx'
import {OpenFeedback} from './feedback.jsx'
import {OpenEditor} from '#/plugin/exo/items/open/components/editor'
import {SCORE_MANUAL} from './../../quiz/enums'
import {OpenItem} from '#/plugin/exo/items/open/prop-types'

import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function getCorrectedAnswer() {
  return new CorrectedAnswer()
}

function generateStats() {
  return {}
}

export default {
  type: 'application/x.open+json',
  name: 'open',
  tags: [trans('question', {}, 'quiz')],
  answerable: true,

  paper: OpenPaper,
  player: OpenPlayer,
  feedback: OpenFeedback,
  components: {
    editor: OpenEditor
  },

  create: item => {
    item.score = OpenItem.propTypes.score

    return item
  },

  editor,
  getCorrectedAnswer,
  generateStats
}
