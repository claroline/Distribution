import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import has from 'lodash/has'

import {trans} from '#/main/app/intl/translation'

import {FeedbackButton as Feedback} from '#/plugin/exo/buttons/feedback/components/button'
import {SolutionScore} from '#/plugin/exo/components/score'
import {AnswerStats} from '#/plugin/exo/items/components/stats'
import {PaperTabs} from '#/plugin/exo/items/components/paper-tabs'
import {utils} from '#/plugin/exo/items/pair/utils'
import {WarningIcon} from '#/plugin/exo/components/warning-icon'

export const PairPaper = props => {
  const yourAnswers = utils.getYourAnswers(props.answer, props.item)
  const expectedAnswers = utils.getExpectedAnswers(props.item)
  return (
    <PaperTabs
      id={props.item.id}
      showExpected={props.showExpected}
      showStats={props.showStats}
      showYours={props.showYours}
      yours={
        <div className="row pair-paper">
          <div className="col-md-5 items-col">
            <ul>
              {yourAnswers.orpheans.map((item) =>
                <li key={`your-answer-orphean-${item.id}`}>
                  <div className={classes('answer-item item', {
                    'correct-answer': props.item.hasExpectedAnswers && item.score,
                    'incorrect-answer': props.item.hasExpectedAnswers && !item.score
                  })}>
                    {props.item.hasExpectedAnswers &&
                      <WarningIcon valid={item.score !== '' && item.score <= 0}/>
                    }
                    <div className="item-content" dangerouslySetInnerHTML={{__html: item.data}} />
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="col-md-7 pairs-col">
            <ul>
              {yourAnswers.answers.map((answer) =>
                <li key={`your-answer-id-${answer.leftItem.id}-${answer.rightItem.id}`}>
                  <div className={classes('item', {
                    'correct-answer': props.item.hasExpectedAnswers && answer.valid,
                    'incorrect-answer': props.item.hasExpectedAnswers && !answer.valid,
                    'answer-item': !props.item.hasExpectedAnswers
                  })}>
                    {props.item.hasExpectedAnswers &&
                      <WarningIcon valid={answer.valid}/>
                    }
                    <div className="item-content" dangerouslySetInnerHTML={{__html: answer.leftItem.data}} />
                    <div className="item-content" dangerouslySetInnerHTML={{__html: answer.rightItem.data}} />
                    <Feedback
                      id={`pair-${answer.leftItem.id}-${answer.rightItem.id}-feedback`}
                      feedback={answer.feedback}
                    />
                    {props.item.hasExpectedAnswers && props.showScore && answer.score !== '' &&
                      <SolutionScore score={answer.score}/>
                    }
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      }
      expected={
        <div className="row pair-paper">
          <div className="col-md-5 items-col">
            <ul>
              {expectedAnswers.odd.map((o) =>
                <li key={`your-answer-orphean-${o.item.id}`}>
                  <div className={classes(
                    'item',
                    {'selected-answer': o.score}
                  )}>
                    <WarningIcon valid={o.score && o.score <= 0}/>
                    <div className="item-data" dangerouslySetInnerHTML={{__html: o.item.data}} />
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div className="col-md-7 pairs-col">
            <ul>
              {expectedAnswers.answers.map((answer) =>
                <li key={`expected-answer-id-${answer.leftItem.id}-${answer.rightItem.id}`}>
                  <div className={classes(
                    'item',
                    {'selected-answer': answer.valid}
                  )}>
                    <WarningIcon valid={answer.valid}/>
                    <div className="item-data" dangerouslySetInnerHTML={{__html: answer.leftItem.data}} />
                    <div className="item-data" dangerouslySetInnerHTML={{__html: answer.rightItem.data}} />
                    <Feedback
                      id={`pair-${answer.leftItem.id}-${answer.rightItem.id}-feedback`}
                      feedback={answer.feedback}
                    />
                    {props.showScore &&
                      <SolutionScore score={answer.score}/>
                    }
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      }
      stats={
        <div className="row pair-paper">
          <div className="col-md-5 items-col">
            <ul>
              {expectedAnswers.odd.map((o) =>
                <li key={`your-answer-orphean-${o.item.id}`}>
                  <div className={classes('item', {
                    'selected-answer': props.item.hasExpectedAnswers,
                    'stats-answer': !props.item.hasExpectedAnswers
                  })}>
                    <div className="item-data" dangerouslySetInnerHTML={{__html: o.item.data}} />
                    <AnswerStats stats={{
                      value: props.stats.unpaired && props.stats.unpaired[o.item.id] ? props.stats.unpaired[o.item.id] : 0,
                      total: props.stats.total
                    }} />
                  </div>
                </li>
              )}
              {props.item.items.map((i) =>
                !utils.isPresentInOdds(i.id, expectedAnswers.odd) && has(props.stats, ['unpaired', i.id]) &&
                <li key={`your-answer-orphean-${i.id}`}>
                  <div className="item stats-answer">
                    <div className="item-data" dangerouslySetInnerHTML={{__html: i.data}} />
                    <AnswerStats stats={{
                      value: props.stats.unpaired[i.id],
                      total: props.stats.total
                    }} />
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div className="col-md-7 pairs-col">
            <ul>
              {expectedAnswers.answers.map((answer) =>
                <li key={`expected-answer-id-${answer.leftItem.id}-${answer.rightItem.id}`}>
                  <div className={classes('item', {
                    'selected-answer': props.item.hasExpectedAnswers,
                    'stats-answer': !props.item.hasExpectedAnswers
                  })}>
                    <div className="item-data" dangerouslySetInnerHTML={{__html: answer.leftItem.data}} />
                    <div className="item-data" dangerouslySetInnerHTML={{__html: answer.rightItem.data}} />

                    <AnswerStats stats={{
                      value: has(props.stats, ['paired', answer.leftItem.id, answer.rightItem.id]) ?
                        props.stats.paired[answer.leftItem.id][answer.rightItem.id] :
                        0,
                      total: props.stats.total
                    }} />
                  </div>
                </li>
              )}
              {props.item.items.map((i1) =>
                props.item.items.map((i2) =>
                  has(props.stats, ['paired', i1.id, i2.id]) &&
                  !utils.isPresentInSolutions(i1.id, i2.id, props.item.solutions) &&
                  <li key={`expected-answer-id-${i1.id}-${i2.id}`}>
                    <div className="item stats-answer">
                      <div className="item-data" dangerouslySetInnerHTML={{__html: i1.data}} />
                      <div className="item-data" dangerouslySetInnerHTML={{__html: i2.data}} />

                      <AnswerStats stats={{
                        value: has(props.stats, ['paired', i1.id, i2.id]) ?
                          props.stats.paired[i1.id][i2.id] :
                          0,
                        total: props.stats.total
                      }} />
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="col-md-12">
            <div className='answer-item unanswered-item'>
              <div>{trans('unanswered', {}, 'quiz')}</div>

              <AnswerStats stats={{
                value: props.stats.unanswered ? props.stats.unanswered : 0,
                total: props.stats.total
              }} />
            </div>
          </div>
        </div>
      }
    />
  )
}

PairPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string,
    description: T.string,
    items: T.arrayOf(T.object).isRequired,
    solutions: T.arrayOf(T.object).isRequired,
    hasExpectedAnswers: T.bool.isRequired
  }).isRequired,
  answer: T.array,
  showScore: T.bool.isRequired,
  showExpected: T.bool.isRequired,
  showYours: T.bool.isRequired,
  showStats: T.bool.isRequired,
  stats: T.shape({
    unpaired: T.oneOfType([T.object, T.array]),
    paired: T.oneOfType([T.object, T.array]),
    unanswered: T.number,
    total: T.number
  })
}

PairPaper.defaultProps = {
  answer: []
}
