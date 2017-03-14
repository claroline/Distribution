import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {Feedback} from '../components/feedback-btn.jsx'
import {SolutionScore} from '../components/score.jsx'
import {WarningIcon} from './utils/warning-icon.jsx'
import {utils} from './utils/utils'
import {PaperTabs} from '../components/paper-tabs.jsx'

export const BooleanPaper = props => {

  return (
    <PaperTabs
      id={props.item.id}
      yours={
        <div className="boolean-paper row">
          {props.item.solutions.map(solution =>
            <div key={solution.id} className="col-md-6">
              <div className={classes(
                  'choice',
                  utils.getAnswerClass(solution, props.answer)
                )}>
                {props.answer !== '' && solution.id === props.answer &&
                  <WarningIcon valid={solution.score > 0}/>
                }
                {props.item.choices.find(choice => choice.id === solution.id).data}

                {props.answer !== '' && solution.id === props.answer &&
                  <span>
                    <Feedback
                      id={`${solution.id}-feedback`}
                      feedback={solution.feedback}/>
                    <SolutionScore score={solution.score}/>
                  </span>
                }
              </div>
            </div>
          )}
        </div>
      }
      expected={
        <div className="boolean-paper row">
          {props.item.solutions.map(solution =>
            <div key={solution.id} className="col-md-6">
              <div className={classes(
                  'choice',
                   solution.score > 0 ? 'text-info bg-info' : 'bg-choice'
                )}>
                {props.item.choices.find(choice => choice.id === solution.id).data}
                <span>
                  <Feedback
                    id={`${solution.id}-feedback`}
                    feedback={solution.feedback}/>
                  <SolutionScore score={solution.score}/>
                </span>
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}


BooleanPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired
    })).isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.string.isRequired
}

BooleanPaper.defaultProps = {
  answer: ''
}
