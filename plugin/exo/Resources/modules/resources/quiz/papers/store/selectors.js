import {createSelector} from 'reselect'

import {calculateTotal} from '#/plugin/exo/scores'
import {selectors as baseSelectors} from '#/plugin/exo/resources/quiz/store/selectors'

const STORE_NAME = 'papers'
const LIST_NAME = `${baseSelectors.STORE_NAME}.${STORE_NAME}.list`

const papers = createSelector(
  [baseSelectors.resource],
  (resourceState) => resourceState[STORE_NAME]
)

const currentPaper = createSelector(
  [papers],
  (papersState) => papersState.current
)

const showScoreAt = paper => {
  return paper.structure.parameters.showScoreAt
}

const showCorrectionAt = paper => {
  return paper.structure.parameters.showCorrectionAt
}

const correctionDate = paper => {
  return paper.structure.parameters.correctionDate
}

const totalScoreOn = paper => {
  if (paper.structure.parameters.totalScoreOn && paper.structure.parameters.totalScoreOn > 0) {
    return paper.structure.parameters.totalScoreOn
  }

  return null
}

const paperTotalAnswerScore = paper => {
  let scoreMax = 0

  paper.structure.steps.map(step =>
    step.items.map(item => scoreMax += calculateTotal(item))
  )

  return scoreMax
}

const paperScoreMax = paper => {
  if (totalScoreOn(paper)) {
    return totalScoreOn(paper)
  }

  return paperTotalAnswerScore(paper)
}

const paperItemsCount = paper => {
  let count = 0
  paper.structure.steps.forEach(step => count += step.items.length)

  return count
}

export const selectors = {
  STORE_NAME,
  LIST_NAME,

  currentPaper,
  paperScoreMax,
  showScoreAt,
  showCorrectionAt,
  correctionDate,
  totalScoreOn,
  paperTotalAnswerScore,
  paperItemsCount
}
