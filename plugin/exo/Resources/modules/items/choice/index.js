import editor from './editor'
import {ChoicePaper} from './paper.jsx'
import {ChoicePlayer} from './player.jsx'
import {ChoiceFeedback} from './feedback.jsx'
import {CorrectedAnswer, Answerable} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.multiple ?
    item.solutions.filter(s => s.score > 0):
    [item.solutions.reduce((prev, current) => prev.score > current.score ? prev : current)]
}

function getCorrectedAnswer(item, answers) {

  const corrected = new CorrectedAnswer()

  item.choices.forEach(choice => {
    const score = choice._score
    if (answers.data.indexOf(choice.id) > -1) {
      score > 0 ?
        corrected.addExpected(new Answerable(score)) :
        corrected.addUnexpected(new Answerable(score))
    } else {
      if (score > 0) corrected.addMissing(new Answerable(score))
    }
  })

  return corrected
}

export default {
  type: 'application/x.choice+json',
  name: 'choice',
  paper: ChoicePaper,
  player: ChoicePlayer,
  feedback: ChoiceFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
