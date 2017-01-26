import React, {PropTypes as T} from 'react'
import {utils} from './utils'

export const WarningIcon = props => {
  const solution = utils.getSolutionForAnswer(props.solution, props.answer)

  return solution && solution.score > 0 ?
     <span className="fa fa-check answer-warning-span" aria-hidden="true"></span> :
     <span className="fa fa-times answer-warning-span" aria-hidden="true"></span>
}

WarningIcon.propTypes = {
  answer: T.any,
  solution: T.shape({
    score: T.number,
    id: T.string
  })
}
