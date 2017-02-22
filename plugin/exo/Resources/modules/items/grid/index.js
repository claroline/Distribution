import editor from './editor'
import {GridPaper} from './paper.jsx'
import {GridPlayer} from './player.jsx'
import {GridFeedback} from './feedback.jsx'

// As a grid question can have several cells with several choices,
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

export default {
  type: 'application/x.grid+json',
  name: 'grid',
  paper: GridPaper,
  player: GridPlayer,
  feedback: GridFeedback,
  editor,
  expectAnswer
}
