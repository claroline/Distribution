import {getDefinition} from '#/plugin/exo/items/item-types'
import {calculateScore} from '#/plugin/exo/scores'

import {constants} from '#/plugin/exo/resources/quiz/constants'
import {selectors as paperSelectors} from '#/plugin/exo/resources/quiz/papers/store/selectors'

function showCorrection(isAdmin, isFinished, showCorrectionAt, correctionDate) {
  if (isAdmin) {
    return true
  }

  if (showCorrectionAt === constants.QUIZ_RESULTS_AT_VALIDATION || showCorrectionAt === constants.QUIZ_RESULTS_AT_LAST_ATTEMPT){
    return isFinished
  }

  if (showCorrectionAt === constants.QUIZ_RESULTS_AT_DATE){
    const today = Date.parse(new Date(Date.now()))
    const parsedCorrectionDate = Date.parse(correctionDate)

    return today >= parsedCorrectionDate
  }

  return false
}

function showScore(isAdmin, isFinished, showScoreAt, showCorrectionAt, correctionDate) {
  if (isAdmin) {
    return true
  }

  if (showScoreAt === constants.QUIZ_SCORE_AT_CORRECTION){
    return utils.showCorrection(isAdmin, isFinished, showCorrectionAt, correctionDate)
  }

  if (showScoreAt === constants.QUIZ_SCORE_AT_VALIDATION){
    return isFinished
  }

  return false
}

function computeScore(paper, answers) {
  let total = 0

  paper.structure.steps.forEach(step => {
    step.items.forEach(item => {
      //because some content object will throw some errors
      try  {
        const def = getDefinition(item.type)
        const correctedAnswer = def.correctAnswer(item, answers.find(answer => answer.questionId === item.id))
        const itemScore = calculateScore(item.score, correctedAnswer)
        if (itemScore) {
          total += itemScore
        }
      } catch (e) {
        //console.error(e.message)
      }
    })
  })

  //then we need to compute it according to the total score if it exists...
  const totalScoreOn = paper.structure.parameters.totalScoreOn

  if (totalScoreOn) {
    //get the max score for the paper
    const maxScore = paperSelectors.paperTotalAnswerScore(paper)

    total *= totalScoreOn/maxScore
  }

  return total
}

export const utils = {
  showCorrection,
  showScore,
  computeScore
}