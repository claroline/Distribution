import editor from './editor'
import {ClozePaper} from './paper.jsx'
import {ClozePlayer} from './player.jsx'
import {ClozeFeedback} from './feedback.jsx'
import {CorrectedAnswer, Answerable} from '#/plugin/exo/quiz/correction/components/corrected-answer'

// As a cloze question can have several holes with several choices,
// this function will return an array with the answers that have the biggest score
function expectAnswer(item) {
  let data = []

  if (item.solutions) {
    item.solutions.forEach(s => {
      if (s.answers) {
        let currentAnswer
        let currentScoreMax = 0
        s.answers.forEach(a => {
          if (a.score >= currentScoreMax) {
            currentScoreMax = a.score
            currentAnswer = a
          }
        })
        if (currentAnswer) {
          data.push(currentAnswer)
        }
      }
    })
  }

  return data
}

function getCorrectedAnswer(item, answers) {
  const corrected = new CorrectedAnswer()

  item.solutions.forEach(solution => {
    const hole = item.holes.find(hole => hole.id === solution.holeId)
    const answer = answers.data.find(answer => answer.holeId === hole.id)
    const expected = findSolutionExpectedAnswer(solution)

    if (answer) {
      if (answer.answerText === expected.text) {
        corrected.addExpected(new Answerable(expected.score))
      } else {
        const userAnswer = solution.answers.find(solutionAnswer => solutionAnswer.text === answer.answerText)
        corrected.addUnexpected(new Answerable(userAnswer ? userAnswer.score: 0))
      }
    } else {
      corrected.addMissing(new Answerable(expected.score))
    }
  })

  return corrected
}

function findSolutionExpectedAnswer(solution) {
  let expected = null

  solution.answers.forEach(answer => {
    if (!expected || expected.score < answer.score) {
      expected = answer
    }
  })

  return expected
}

export default {
  type: 'application/x.cloze+json',
  name: 'cloze',
  paper: ClozePaper,
  player: ClozePlayer,
  feedback: ClozeFeedback,
  editor,
  expectAnswer,
  getCorrectedAnswer
}
