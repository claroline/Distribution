import React, {PropTypes as T} from 'react'
import {QuizBar} from './quiz-bar.jsx'

export const Quiz = props =>
  <div className="exercise-container">
    <div className="panel-heading">
      <h3 className="panel-title">{props.title}</h3>
    </div>
    {props.editable &&
      <QuizBar {...props}/>
    }
  </div>

Quiz.propTypes = {
  title: T.string.isRequired,
  editable: T.bool.isRequired
}
