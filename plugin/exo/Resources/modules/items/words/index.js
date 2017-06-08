import editor from './editor'
import {WordsPaper} from './paper.jsx'
import {WordsPlayer} from './player.jsx'
import {WordsFeedback} from './feedback.jsx'
import {CorrectedAnswer} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.solutions
}

function getCorrectedAnswer() {
  const corrected = new CorrectedAnswer()

  return corrected
}

export default {
  type: 'application/x.words+json',
  name: 'words',
  paper: WordsPaper,
  player: WordsPlayer,
  feedback: WordsFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
