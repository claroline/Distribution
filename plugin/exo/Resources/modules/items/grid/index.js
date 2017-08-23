import editor, {SUM_CELL, SUM_COL, SUM_ROW} from './editor'
import {GridPaper} from './paper.jsx'
import {GridPlayer} from './player.jsx'
import {GridFeedback} from './feedback.jsx'
import {CorrectedAnswer, Answerable} from '#/plugin/exo/quiz/correction/components/corrected-answer'
import {utils} from './utils/utils'

function getCorrectedAnswer(item, answer = {data: []}) {
  if (item.score.type === 'fixed') {
    return getCorrectAnswerForFixMode(item, answer)
  }

  switch(item.sumMode) {
    case SUM_CELL: {
      return getCorrectAnswerForSumCellsMode(item, answer)
    }
    case SUM_ROW: {
      return getCorrectAnswerForRowSumMode(item, answer)
    }
    case SUM_COL: {
      return getCorrectAnswerForColSumMode(item, answer)
    }
  }
}

function getCorrectAnswerForSumCellsMode(item, answer = {data: []}) {
  const corrected = new CorrectedAnswer()

  item.solutions.forEach(solution => {
    let userDataAnswer = answer.data.find(userSolution => userSolution.cellId === solution.cellId)
    let bestAnswer = findSolutionExpectedAnswer(solution)
    let userAnswer = userDataAnswer ?
        solution.answers.find(answer => (answer.text === userDataAnswer.text) && answer.caseSensitive || (answer.text.toLowerCase() === userDataAnswer.text.toLowerCase()) && ! answer.caseSensitive):
        null

    if (userAnswer) {
      userAnswer.score > 0 ?
            corrected.addExpected(new Answerable(userAnswer.score)):
            corrected.addUnexpected(new Answerable(userAnswer.score))
    } else {
      corrected.addMissing(new Answerable(bestAnswer.score))
      corrected.addPenalty(new Answerable(item.penalty))
    }
  })

  return corrected
}

function getCorrectAnswerForColSumMode(item, answer = {data: []}) {
  const corrected = new CorrectedAnswer()

  for (var i = 0; i < item.cols; i++) {
    const cellIds = item.cells.filter(cell =>
      cell.coordinates[0] === i && item.solutions.findIndex(solution => solution.cellId === cell.id) > -1
    ).map(cell => cell.id)

    validateCellsAnswer(corrected, item, answer, cellIds, 'column')
  }

  return corrected
}

function getCorrectAnswerForRowSumMode(item, answer = {data: []}) {
  const corrected = new CorrectedAnswer()

  for (var i = 0; i < item.cols; i++) {
    const cellIds = item.cells.filter(cell =>
      cell.coordinates[1] === i && item.solutions.findIndex(solution => solution.cellId === cell.id) > -1
    ).map(cell => cell.id)

    validateCellsAnswer(corrected, item, answer, cellIds, 'row')
  }

  return corrected
}

function getCorrectAnswerForFixMode(item, answer = {data: []}) {
  const corrected = new CorrectedAnswer()

  validateCellsAnswer(corrected, item, answer, item.cells.map(cell => cell.id), 'fix')

  return corrected
}

//check if the answers give by the users are all correct for an array of cellIds
function validateCellsAnswer(corrected, item, answer, cellIds, mode) {
  const answers = answer.data.filter(answer => cellIds.indexOf(answer.cellId) >= 0)
  const solutions = item.solutions.find(solution => cellIds.indexOf(solution.cellId) >= 0)
  const score = solutions.answers[0].score
  let valid = true

  switch (mode) {
    case 'row':
      valid = answers.length === item.rows
      break
    case 'column':
      valid = answers.length === item.columns
      break
  }

  answers.forEach(answer => {
    const expected = item.solutions.find(solution => solution.cellId === answer.cellId).answers.find(answer => answer.expected)
    if ((answer.text !== expected.text) && expected.caseSensitive || (answer.text.toLowerCase() !== expected.text.toLowerCase()) && !expected.caseSensitive) {
      valid = false
    }
  })

  if (valid) {
    corrected.addExpected(new Answerable(score))
  } else {
    corrected.addPenalty(new Answerable(item.penalty))
    corrected.addMissing(new Answerable(score))
  }

  return corrected
}

function findSolutionExpectedAnswer(solution) {
  let best = false

  solution.answers.forEach(answer => {
    if (!best || best.score < answer.score) best = answer
  })

  return best
}

function generateStats(item, papers, withAllParpers) {
  const stats = {
    cells: {},
    unanswered: 0,
    total: 0
  }
  Object.values(papers).forEach(p => {
    if (withAllParpers || p.finished) {
      let total = 0
      let nbAnswered = 0
      const answered = {}
      // compute the number of times the item is present in the structure of the paper and initialize acceptable pairs
      p.structure.steps.forEach(structure => {
        structure.items.forEach(i => {
          if (i.id === item.id) {
            ++total
            ++stats.total

            if (i.solutions) {
              i.solutions.forEach(s => {
                answered[s.cellId] = answered[s.cellId] ? answered[s.cellId] + 1 : 1
              })
            }
          }
        })
      })
      // compute the number of times the item has been answered
      p.answers.forEach(a => {
        if (a.questionId === item.id && a.data) {
          ++nbAnswered
          a.data.forEach(d => {
            const key = utils.getKey(d.cellId, d.text, item.solutions)

            if (!stats.cells[d.cellId]) {
              stats.cells[d.cellId] = {}
            }
            stats.cells[d.cellId][key] = stats.cells[d.cellId][key] ? stats.cells[d.cellId][key] + 1 : 1

            if (answered[d.cellId]) {
              --answered[d.cellId]
            }
          })
        }
      })
      const nbUnanswered = total - nbAnswered

      for (let cellId in answered) {
        if (answered[cellId] - nbUnanswered > 0) {
          if (!stats.cells[cellId]) {
            stats.cells[cellId] = {}
          }
          stats.cells[cellId]['_unanswered'] = stats.cells[cellId]['_unanswered'] ?
            stats.cells[cellId]['_unanswered'] + (answered[cellId] - nbUnanswered) :
            answered[cellId] - nbUnanswered
        }
      }
      stats.unanswered += nbUnanswered
    }
  })

  return stats
}

export default {
  type: 'application/x.grid+json',
  name: 'grid',
  paper: GridPaper,
  player: GridPlayer,
  feedback: GridFeedback,
  editor,
  getCorrectedAnswer,
  generateStats
}
