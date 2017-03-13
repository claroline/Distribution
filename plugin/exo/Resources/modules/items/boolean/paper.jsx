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
        <div className="boolean-paper">
          {props.item.solutions.map(solution =>
            <div
              key={solution.id}
              className={classes(
                'choice',
                utils.getAnswerClass(solution, props.answer)
              )}>
              {props.answer && props.answer.id && solution.id === props.answer.id &&
                <div className="header">
                    <WarningIcon valid={solution.score > 0}/>
                    <Feedback
                      id={`${solution.id}-feedback`}
                      feedback={solution.feedback}/>
                    <SolutionScore score={solution.score}/>
                </div>
              }

              <div className="body">
                <div dangerouslySetInnerHTML={{__html: props.item.choices.find(choice => choice.id === solution.id).data}} />
              </div>
            </div>
          )}
        </div>
      }
      expected={
        <div className="boolean-paper">
          {props.item.solutions.map(solution =>
            <div
              key={solution.id}
              className={classes(
                'choice',
                 solution.score > 0 ? 'text-info bg-info' : 'bg-choice'
              )}>
              <div className="header">
                <Feedback
                  id={`${solution.id}-feedback`}
                  feedback={solution.feedback}
                />
                <SolutionScore score={solution.score}/>
              </div>
              <div className="body">
                <div dangerouslySetInnerHTML={{__html: props.item.choices.find(choice => choice.id === solution.id).data}} />
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
  answer: T.object
}

BooleanPaper.defaultProps = {
  answer: {}
}
