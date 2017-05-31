import editor from './editor'
import {MatchPaper} from './paper.jsx'
import {MatchPlayer} from './player.jsx'
import {MatchFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.solutions
}

function getCorrectedAnswer() {
  return new CorrectedAnswer()
}

export default {
  type: 'application/x.match+json',
  name: 'match',
  paper: MatchPaper,
  player: MatchPlayer,
  feedback: MatchFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
