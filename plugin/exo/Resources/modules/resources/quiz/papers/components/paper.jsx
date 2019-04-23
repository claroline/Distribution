import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'
import Panel from 'react-bootstrap/lib/Panel'

import {trans} from '#/main/app/intl/translation'
import {displayDate, getTimeDiff} from '#/main/app/intl/date'
import {hasPermission} from '#/main/app/security'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {UserMicro} from '#/main/core/user/components/micro'
import {ScoreBox} from '#/main/core/layout/evaluation/components/score-box'
import {ScoreGauge} from '#/main/core/layout/evaluation/components/score-gauge'
import {selectors as resourceSelect} from '#/main/core/resource/store'

import {calculateTotal} from '#/plugin/exo/scores'
import quizSelect from '#/plugin/exo/quiz/selectors'
import {constants} from '#/plugin/exo/resources/quiz/constants'
import {getDefinition, isQuestionType} from '#/plugin/exo/items/item-types'
import {utils} from '#/plugin/exo/resources/quiz/papers/utils'
import {getNumbering} from '#/plugin/exo/utils/numbering'
import {Metadata as ItemMetadata} from '#/plugin/exo/items/components/metadata'
import {Paper as PaperTypes} from '#/plugin/exo/resources/quiz/papers/prop-types'
import {selectors as paperSelect} from '#/plugin/exo/resources/quiz/papers/store/selectors'

function getAnswer(itemId, answers) {
  const answer = answers.find(answer => answer.questionId === itemId)

  return answer && answer.data ? answer.data : undefined
}

function getAnswerFeedback(itemId, answers) {
  const answer = answers.find(answer => answer.questionId === itemId)

  return answer && answer.feedback ? answer.feedback : null
}

function getAnswerScore(itemId, answers) {
  const answer = answers.find(answer => answer.questionId === itemId)

  return answer ? answer.score : undefined
}

const PaperComponent = props => {
  const showScore = props.paper ?
    utils.showScore(
      props.admin,
      props.paper.finished,
      props.paper.structure.parameters.showScoreAt,
      props.paper.structure.parameters.showCorrectionAt,
      props.paper.structure.parameters.correctionDate
    ) :
    false

  return (
    <div className="paper">
      <h2 className="paper-title">
        {trans('correction', {}, 'quiz')}&nbsp;{props.paper ? props.paper.number : ''}

        <Toolbar
          id={props.paper && props.paper.id}
          className="h-toolbar"
          buttonName="btn"
          tooltip="bottom"
          toolbar="more"
          size="sm"
          actions={[
            {
              name: 'about',
              type: MODAL_BUTTON,
              icon: 'fa fa-fw fa-info',
              label: trans('show-info', {}, 'actions'),
              modal: []
            }, {
              name: 'delete',
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-trash-o',
              label: trans('delete', {}, 'actions'),
              callback: () => {

              },
              confirm: {
                title: trans('deletion'),
                //subtitle: props.item.title || trans('', {}, 'question_types'),
                message: trans('remove_paper_confirm_message', {}, 'quiz')
              },
              dangerous: true,
              group: trans('management')
            }
          ]}
        />
      </h2>

      <div className="row">
        <div className="col-md-4">
          {props.paper &&
            <div className="content-meta">
              <UserMicro
                className="content-creator"
                {...props.paper.user}
                link={true}
              />
            </div>
          }

          {props.paper &&
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <ScoreGauge
                  userScore={showScore ? props.paper.score : '?'}
                  maxScore={paperSelect.paperScoreMax(props.paper)}
                  size="md"
                />
              </div>

              <ul className="list-group list-group-values">
                <li className="list-group-item">
                  {trans('start_date')}
                  <span className="value">{displayDate(props.paper.startDate, false, true)}</span>
                </li>

                <li className="list-group-item">
                  {trans('end_date')}
                  <span className="value">{props.paper.endDate ? displayDate(props.paper.endDate, false, true) : '-'}</span>
                </li>

                <li className="list-group-item">
                  {trans('duration')}
                  <span className="value">{props.paper.endDate ? Math.round(getTimeDiff(props.paper.startDate, props.paper.endDate)) : '-'}</span>
                </li>
              </ul>
            </div>
          }
        </div>

        <div className="col-md-8">
          {props.paper && props.paper.structure.steps
            .filter(step => step.items && 0 < step.items.length)
            .map((step, idx) =>
              <div key={idx} className="quiz-item item-paper">
                <h3 className={classes('h4', 0 === idx && 'h-first')}>
                  {step.title || trans('step', {number: idx + 1}, 'quiz')}
                </h3>

                {step.items.map((item, idxItem) => {
                  const tmp = document.createElement('div')
                  tmp.innerHTML = item.feedback
                  const displayFeedback = (/\S/.test(tmp.textContent)) && item.feedback

                  return isQuestionType(item.type) ?
                    <Panel key={item.id}>
                      {showScore && getAnswerScore(item.id, props.paper.answers) !== undefined && getAnswerScore(item.id, props.paper.answers) !== null &&
                      <ScoreBox className="pull-right" score={getAnswerScore(item.id, props.paper.answers)} scoreMax={calculateTotal(item)}/>
                      }
                      {item.title &&
                      <h4 className="item-title">{item.title}</h4>
                      }

                      <ItemMetadata item={item} numbering={props.numbering !== constants.NUMBERING_NONE ? (idx + 1) + '.' + getNumbering(props.numbering, idxItem): null} />

                      {React.createElement(getDefinition(item.type).paper, {
                        item, answer: getAnswer(item.id, props.paper.answers),
                        feedback: getAnswerFeedback(item.id, props.paper.answers),
                        showScore: showScore,
                        showExpected: props.showExpectedAnswers,
                        showStats: !!(props.showStatistics && props.stats && props.stats[item.id]),
                        showYours: true,
                        stats: props.showStatistics && props.stats && props.stats[item.id] ? props.stats[item.id] : {}
                      })}

                      {displayFeedback &&
                      <div className="item-feedback">
                        <span className="fa fa-comment" />
                        <div dangerouslySetInnerHTML={{__html: item.feedback}} />
                      </div>
                      }
                    </Panel>
                    :
                    ''
                })}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

PaperComponent.propTypes = {
  admin: T.bool.isRequired,
  paper: T.shape(
    PaperTypes.propTypes
  ),
  numbering: T.string,
  showExpectedAnswers: T.bool.isRequired,
  showStatistics: T.bool.isRequired,
  stats: T.object
}

const Paper = connect(
  (state) => ({
    admin: hasPermission('edit', resourceSelect.resourceNode(state)) || hasPermission('manage_papers', resourceSelect.resourceNode(state)),
    numbering: quizSelect.quizNumbering(state),
    paper: paperSelect.currentPaper(state),
    showExpectedAnswers: quizSelect.papersShowExpectedAnswers(state),
    showStatistics: quizSelect.papersShowStatistics(state),
    stats: quizSelect.statistics(state)
  })
)(PaperComponent)

export {
  Paper
}
