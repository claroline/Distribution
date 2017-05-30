import editor from './editor'
import {GraphicPaper} from './paper.jsx'
import {GraphicPlayer} from './player.jsx'
import {GraphicFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/items/item-types'

function expectAnswer(item) {
  return item.solutions.filter(solution => solution.score > 0)
}

function getCorrectedAnswer() {
  return new CorrectedAnswer()
}

export default {
  type: 'application/x.graphic+json',
  name: 'graphic',
  paper: GraphicPaper,
  player: GraphicPlayer,
  feedback: GraphicFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
