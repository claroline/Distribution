import editor from './editor'
import {PairPaper} from './paper.jsx'
import {PairPlayer} from './player.jsx'
import {PairFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.solutions
}

function getCorrectedAnswer() {
  return new CorrectedAnswer()
}

export default {
  type: 'application/x.pair+json',
  name: 'pair',
  paper: PairPaper,
  player: PairPlayer,
  feedback: PairFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
