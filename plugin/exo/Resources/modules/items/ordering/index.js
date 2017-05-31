import editor from './editor'
import {OrderingPaper} from './paper.jsx'
import {OrderingPlayer} from './player.jsx'
import {OrderingFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.solutions
}

function getCorrectedAnswer() {
  return new CorrectedAnswer()
}

export default {
  type: 'application/x.ordering+json',
  name: 'ordering',
  paper: OrderingPaper,
  player: OrderingPlayer,
  feedback: OrderingFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
