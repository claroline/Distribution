import editor from './editor'
import {SelectionPaper} from './paper.jsx'
import {SelectionPlayer} from './player.jsx'
import {SelectionFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

//compute max score
function expectAnswer(item) {
  switch (item.mode) {
    case 'select':
      return item.solutions.filter(s => s.score > 0)
    case 'find':
      return item.solutions.filter(s => s.score > 0)
    case 'highlight':
      return item.solutions.map(solution => solution.answers.reduce((prev, current) => prev.score > current.score ? prev : current))
  }
}

function getCorrectedAnswer() {
  return new CorrectedAnswer()
}

export default {
  type: 'application/x.selection+json',
  name: 'selection',
  paper: SelectionPaper,
  player: SelectionPlayer,
  feedback: SelectionFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
