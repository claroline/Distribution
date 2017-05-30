import editor from './editor'
import {SetPaper} from './paper.jsx'
import {SetPlayer} from './player.jsx'
import {SetFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/items/item-types'

function expectAnswer(item) {
  return item.solutions && item.solutions.associations ? item.solutions.associations : []
}

function getCorrectedAnswer() {
  return new CorrectedAnswer()
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
