import React from 'react'
import classes from 'classnames'
import {PropTypes as T} from 'prop-types'

export const ScoreBox = props =>
  <div className={classes('score-box', {'score-box-lg': props.large})}>
    <span className="user-score">{props.score}</span>
    <span className="sr-only">/</span>
    <span className="max-score">{props.scoreMax}</span>
  </div>

ScoreBox.propTypes = {
  score: T.number.isRequired,
  scoreMax: T.number.isRequired,
  large: T.bool.isRequired
}

ScoreBox.defaultProps = {
  large: false
}