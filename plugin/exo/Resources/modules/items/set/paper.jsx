import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {Feedback} from './../components/feedback-btn.jsx'
import {SolutionScore} from './../components/score.jsx'
import {PaperTabs} from './../components/paper-tabs.jsx'

export const SetPaper = props => {
  return (
    <PaperTabs
      item={props.item}
      answer={props.answer}
      yours={
        <div className="container set-paper">
          {props.item.solutions.map(solution =>
            <div>SOLUTION</div>
          )}
        </div>
      }
      expected={
        <div className="container set-paper">
          {props.item.solutions.map(solution =>
            <div
              key={`set-expected-${solution.itemId}-${solution.setId}`}
              className={classes(
                'item',
                {'bg-info text-info': solution.score > 0}
              )}
            >

              <Feedback
                id={`${solution.id}-feedback-expected`}
                feedback={solution.feedback}
              />
              <SolutionScore score={solution.score}/>
            </div>
          )}
        </div>
      }
    />
  )
}

SetPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string,
    description: T.string,
    items: T.arrayOf(T.object).isRequired,
    sets: T.arrayOf(T.object).isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.array
}

SetPaper.defaultProps = {
  answer: []
}
