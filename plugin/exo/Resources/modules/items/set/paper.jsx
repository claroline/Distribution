import React, {PropTypes as T} from 'react'
import classes from 'classnames'
import {Feedback} from './../components/feedback-btn.jsx'
import {SolutionScore} from './../components/score.jsx'
import {PaperTabs} from './../components/paper-tabs.jsx'


const OddList = props =>
  <div className="odd-list">
    <ul>
      { props.odd.map((item) =>
        <li key={item.id}>
          <div className="item">
            <div className="item-content" dangerouslySetInnerHTML={{__html: item.data}} />
            <Feedback
                id={`odd-${item.id}-feedback`}
                feedback={item.feedback}
            />
            <SolutionScore score={item.score}/>
          </div>
        </li>
      )}
    </ul>
  </div>

OddList.propTypes = {
  odd: T.arrayOf(T.object).isRequired
}

export const SetPaper = props => {
  return (
    <PaperTabs
      item={props.item}
      answer={props.answer}
      yours={
        <div className="set-paper">
          <div className="items-col">

          </div>
          <div className="sets-col">
          </div>
        </div>
      }
      expected={
        <div className="set-paper">
          <div className="items-col">
            <OddList odd={props.item.solutions.odds || []} />
          </div>
          <div className="sets-col">
            <ul>
              {props.item.sets.map((set) =>
                <li key={`set-id-${set.id}`}>
                  <div className="set">
                    <div className="set-heading">
                      <div className="set-heading-content" dangerouslySetInnerHTML={{__html: set.data}} />
                    </div>
                    <div className="set-body">
                      <ul>
                      { props.item.solutions.associations.filter(ass => ass.setId === set.id).map(ass =>
                        <li key={`${ass.itemId}-${ass.setId}`}>
                          <div className={classes(
                              'association',
                              {'bg-info text-info': ass.score > 0}
                            )}>
                            <div className="association-data" dangerouslySetInnerHTML={{__html: props.item.items.find(el => el.id === ass.itemId ).data}} />
                            <Feedback
                                  id={`ass-${ass.itemId}-${ass.setId}-feedback`}
                                  feedback={ass.feedback}
                              />
                            <SolutionScore score={ass.score}/>
                          </div>
                        </li>
                      )}
                      </ul>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
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
    solutions: T.object
  }).isRequired,
  answer: T.array
}

SetPaper.defaultProps = {
  answer: []
}
