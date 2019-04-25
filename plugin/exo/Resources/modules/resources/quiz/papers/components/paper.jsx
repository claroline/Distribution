import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import classes from 'classnames'

import Panel from 'react-bootstrap/lib/Panel'

import {trans} from '#/main/app/intl/translation'
import {displayDate, displayDuration, getTimeDiff} from '#/main/app/intl/date'
import {hasPermission} from '#/main/app/security'
import {ContentLoader} from '#/main/app/content/components/loader'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {UserMicro} from '#/main/core/user/components/micro'
import {displayUsername} from '#/main/core/user/utils'
import {ScoreBox} from '#/main/core/layout/evaluation/components/score-box'
import {ScoreGauge} from '#/main/core/layout/gauge/components/score'
import {selectors as resourceSelect} from '#/main/core/resource/store'

import {calculateTotal} from '#/plugin/exo/scores'
import quizSelect from '#/plugin/exo/quiz/selectors'
import {constants} from '#/plugin/exo/resources/quiz/constants'
import {getDefinition, isQuestionType} from '#/plugin/exo/items/item-types'
import {utils} from '#/plugin/exo/resources/quiz/papers/utils'
import {getNumbering} from '#/plugin/exo/resources/quiz/utils'
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

const PaperStep = props => {
  const numbering = getNumbering(props.numberingType, props.index)

  return (
    <Fragment>
      <h4 className={classes('h3 step-title', 0 === props.index && 'h-first')}>
        {numbering &&
          <span className="h-numbering">{numbering}</span>
        }

        {props.title || trans('step', {number: props.index + 1}, 'quiz')}
      </h4>

      {props.items
        .filter((item) => isQuestionType(item.type))
        .map((item, idxItem) => {
          const tmp = document.createElement('div')
          tmp.innerHTML = item.feedback
          const displayFeedback = (/\S/.test(tmp.textContent)) && item.feedback

          return (
            <Panel key={item.id} className="quiz-item item-paper">
              {props.showScore && getAnswerScore(item.id, props.answers) !== undefined && getAnswerScore(item.id, props.answers) !== null &&
                <ScoreBox className="pull-right" score={getAnswerScore(item.id, props.answers)} scoreMax={calculateTotal(item)}/>
              }
              {item.title &&
                <h4 className="item-title">{item.title}</h4>
              }

              <ItemMetadata item={item} numbering={getNumbering(props.numberingType, props.index, idxItem)} />

              {React.createElement(getDefinition(item.type).paper, {
                item: item,
                answer: getAnswer(item.id, props.answers),
                feedback: getAnswerFeedback(item.id, props.answers),
                showScore: props.showScore,
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
          )
        })
      }
    </Fragment>
  )
}

PaperStep.propTypes = {
  numberingType: T.string.isRequired,

  index: T.number.isRequired,
  id: T.string.isRequired,
  title: T.string,
  items: T.arrayOf(T.shape({
    // TODO : prop types
  })),

  showScore: T.bool.isRequired,
  showExpectedAnswers: T.bool.isRequired,
  showStatistics: T.bool.isRequired,
  answers: T.array,
  stats: T.object
}

const PaperComponent = props =>
  <div className="paper">
    <h3 className="h2 paper-title">
      <div>
        {trans('results', {}, 'quiz')}
        <small style={{display: 'block', marginTop: '5px'}}>
          {props.paper ?
            trans('attempt', {number: get(props.paper, 'number', '?')}, 'quiz')
            :
            trans('attempt_loading', {}, 'quiz')
          }
        </small>
      </div>

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
            displayed: props.admin,
            callback: () => {

            },
            confirm: {
              title: trans('deletion'),
              subtitle: trans('user_attempt', {
                number: get(props.paper, 'number', '?'),
                userName: displayUsername(get(props.paper, 'user'))
              }, 'quiz'),
              message: trans('remove_paper_confirm_message', {}, 'quiz')
            },
            dangerous: true,
            group: trans('management')
          }
        ]}
      />
    </h3>

    <div className="row">
      <div className="col-md-4">
        <div className="panel panel-default">
          <div className="panel-heading">
            <UserMicro
              className="content-creator"
              {...get(props.paper, 'user', {})}
              link={true}
            />
          </div>

          <div className="panel-body text-center">
            <ScoreGauge
              type="user"
              value={get(props.paper, 'score')}
              total={get(props.paper, 'total')}
              width={140}
              height={140}
              displayValue={value => undefined === value || null === value ? '?' : value+''}
            />
          </div>

          <ul className="list-group list-group-values">
            <li className="list-group-item">
              {trans('start_date')}
              <span className="value">{get(props.paper, 'startDate') ? displayDate(props.paper.startDate, false, true) : '-'}</span>
            </li>

            <li className="list-group-item">
              {trans('end_date')}
              <span className="value">{get(props.paper, 'endDate') ? displayDate(props.paper.endDate, false, true) : '-'}</span>
            </li>

            <li className="list-group-item">
              {trans('duration')}
              <span className="value">{get(props.paper, 'endDate') ? displayDuration(getTimeDiff(props.paper.startDate, props.paper.endDate)) : '-'}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="col-md-8">
        {!props.paper &&
          <ContentLoader />
        }

        {props.paper && props.paper.structure.steps
          .filter(step => step.items && 0 < step.items.length)
          .map((step, index) =>
            <PaperStep
              key={step.id}
              numberingType={props.numberingType}
              index={index}
              id={step.id}
              title={step.title}
              items={step.items}
              answers={props.paper.answers}
              stats={props.stats}
              showScore={props.showScore}
              showExpectedAnswers={props.showExpectedAnswers}
              showStatistics={props.showStatistics}
            />
          )
        }
      </div>
    </div>
  </div>

PaperComponent.propTypes = {
  admin: T.bool.isRequired,
  paper: T.shape(
    PaperTypes.propTypes
  ),
  numberingType: T.string,
  showScore: T.bool.isRequired,
  showExpectedAnswers: T.bool.isRequired,
  showStatistics: T.bool.isRequired,
  stats: T.object
}

const Paper = connect(
  (state) => {
    const admin = hasPermission('edit', resourceSelect.resourceNode(state)) || hasPermission('manage_papers', resourceSelect.resourceNode(state))
    const paper = paperSelect.currentPaper(state)
    const showScore = paper ?
      utils.showScore(
        admin,
        paper.finished,
        get(paper, 'structure.parameters.showScoreAt'),
        get(paper, 'structure.parameters.showCorrectionAt'),
        get(paper, 'structure.parameters.correctionDate')
      ) :
      false

    return ({
      admin: admin,
      numberingType: quizSelect.quizNumbering(state),
      paper: paper,
      showScore: showScore,
      showExpectedAnswers: quizSelect.papersShowExpectedAnswers(state),
      showStatistics: quizSelect.papersShowStatistics(state),
      stats: quizSelect.statistics(state)
    })
  }
)(PaperComponent)

export {
  Paper
}
