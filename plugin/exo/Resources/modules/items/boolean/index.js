import editor from './editor'
import {BooleanPaper} from './paper.jsx'
import {BooleanPlayer} from './player.jsx'
import {BooleanFeedback} from './feedback.jsx'
import {CorrectedAnswer, Answerable} from '#/plugin/exo/quiz/correction/components/corrected-answer'

function expectAnswer(item) {
  return item.solutions
}

function getCorrectedAnswer(item, answer) {
  const corrected = new CorrectedAnswer()

  item.choices.forEach(choice => {
    const score = choice._score
    if (answer.data === choice.id) {
      score > 0 ?
        corrected.addExpected(new Answerable(score)) :
        corrected.addUnexpected(new Answerable(score))
    } else {
      if (score > 0) corrected.addMissing(new Answerable(score))
    }
  })

  return corrected
}

/*
foreach ($question->getChoices() as $choice) {
    if (!empty($answer) && $choice->getUuid() === $answer) {
        // Choice has been selected by the user
        if (0 < $choice->getScore()) {
            $corrected->addExpected($choice);
        } else {
            $corrected->addUnexpected($choice);
        }
    } elseif (0 < $choice->getScore()) {
        // The choice is not selected but it's part of the correct answer
        $corrected->addMissing($choice);
    }
}

return $corrected;
*/
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
