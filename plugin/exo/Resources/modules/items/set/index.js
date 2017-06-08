import editor from './editor'
import {SetPaper} from './paper.jsx'
import {SetPlayer} from './player.jsx'
import {SetFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.solutions && item.solutions.associations ? item.solutions.associations : []
}

function getCorrectedAnswer() {
  const corrected = new CorrectedAnswer()

  return corrected
}

export default {
  type: 'application/x.set+json',
  name: 'set',
  paper: SetPaper,
  player: SetPlayer,
  feedback: SetFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
