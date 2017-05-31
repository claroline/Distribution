import editor from './editor'
import {BooleanPaper} from './paper.jsx'
import {BooleanPlayer} from './player.jsx'
import {BooleanFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.solutions
}

function getCorrectedAnswer() {
  return new CorrectedAnswer()
}

export default {
  type: 'application/x.boolean+json',
  name: 'boolean',
  paper: BooleanPaper,
  player: BooleanPlayer,
  feedback: BooleanFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
