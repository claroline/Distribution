import React, {PropTypes as T} from 'react'
import {PaperTabs} from '../components/paper-tabs.jsx'
import {Feedback} from '../components/feedback-btn.jsx'

export const OpenPaper = props => {
  return (
    <PaperTabs
      item={props.item}
      answer={props.answer}
      hideExpected={true}
      score={props.answerObject.score ? props.answerObject.score : ''}
      yours={
        <div>
          {props.answerObject.feedback &&
            <div className="row">
              <span className="pull-right">
                <Feedback
                  id={props.answerObject.id}
                  feedback={props.answerObject.feedback}
                />
              </span>
            </div>
          }
          <div className="row" dangerouslySetInnerHTML={{__html: props.answer}}>
          </div>
        </div>
      }
    />
  )
}
