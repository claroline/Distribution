import React, {PropTypes as T} from 'react'
import {utils} from './utils'
import {Feedback} from '../../components/feedback-btn.jsx'
import {SolutionScore} from '../../components/score.jsx'

export const Highlight = props => {
  return(
    <div>
      {utils.split(props.text, props.solutions).map(el =>
        <span key={el.text}>
          <span dangerouslySetInnerHTML={{__html: el.text}}></span>{'\u00a0'}
          <span className={ el.score >= 0 ? 'word-success': 'word-danger'}>
            <Feedback feedback={el.feedback} id={el.text}/>{'\u00a0'}
            {el.score && props.showScore &&
              <SolutionScore score={el.score}/>
            }
          </span>
        </span>
      )}
    </div>
  )
}

Highlight.propTypes = {
  text: T.string.isRequired,
  solutions: T.array.isRequired,
  showScore: T.bool.isRequired
}
