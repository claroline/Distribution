import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {tex} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {hasPermission} from '#/main/core/resource/permissions'
import {select as playerSelectors} from './../selectors'
import quizSelectors from './../../selectors'
import {selectors as paperSelectors} from './../../papers/selectors'
import {utils as paperUtils} from './../../papers/utils'
import {ScoreGauge} from './../../../components/score-gauge.jsx'

const AttemptEnd = props => {
  const showScore = paperUtils.showScore(props.admin, props.paper.finished, paperSelectors.showScoreAt(props.paper), paperSelectors.showCorrectionAt(props.paper), paperSelectors.correctionDate(props.paper))
  const showCorrection = paperUtils.showCorrection(props.admin, props.paper.finished, paperSelectors.showCorrectionAt(props.paper), paperSelectors.correctionDate(props.paper))
  const answers = Object.keys(props.answers).map(key => props.answers[key])
  const hasMoreAttempts = (0 === props.maxAttempts || props.maxAttempts > props.userPaperCount) &&
    (0 === props.maxAttemptsPerDay || props.maxAttemptsPerDay > props.userPaperDayCount)

  return (
    <div className="quiz-player attempt-end">
      <div className="row">
        {showScore &&
          <div className="col-md-3 text-center">
            <ScoreGauge userScore={paperUtils.computeScore(props.paper, answers)} maxScore={paperSelectors.paperScoreMax(props.paper)} />
          </div>
        }

        <div className={showScore ? 'col-md-9':'col-md-12'}>
          {props.endMessage ?
            <HtmlText>{props.endMessage}</HtmlText> :
            <div>
              <h2 className="h4">{tex('attempt_end_title')}</h2>
              <p>{tex('attempt_end_info')}</p>
            </div>
          }

          {props.endNavigation && showCorrection &&
            <Button
              type={LINK_BUTTON}
              className="btn btn-start btn-lg btn-block btn-primary"
              icon="fa fa-fw fa-play"
              label={tex('view_paper')}
              target={`/papers/${props.paper.id}`}
            />
          }

          {props.endNavigation && hasMoreAttempts &&
            <Button
              type={LINK_BUTTON}
              className="btn btn-start btn-lg btn-block btn-primary"
              icon="fa fa-fw fa-play"
              label={tex('exercise_restart')}
              target="/play"
            />
          }
        </div>
      </div>
    </div>
  )
}

AttemptEnd.propTypes = {
  admin: T.bool.isRequired,
  answers: T.object.isRequired,
  paper: T.shape({
    id: T.string.isRequired,
    structure: T.object.isRequired,
    finished: T.bool.isRequired
  }).isRequired,
  endMessage: T.string,
  endNavigation: T.bool.isRequired,
  maxAttempts: T.number.isRequired,
  maxAttemptsPerDay: T.number.isRequired,
  userPaperCount: T.number.isRequired,
  userPaperDayCount: T.number.isRequired
}

const ConnectedAttemptEnd = connect(
  (state) => ({
    admin: hasPermission('edit', resourceSelect.resourceNode(state)) || quizSelectors.papersAdmin(state),
    paper: playerSelectors.paper(state),
    endMessage: playerSelectors.quizEndMessage(state),
    endNavigation: playerSelectors.quizEndNavigation(state),
    answers: playerSelectors.answers(state),
    maxAttempts: quizSelectors.maxAttempts(state),
    maxAttemptsPerDay: quizSelectors.maxAttemptsPerDay(state),
    userPaperCount: quizSelectors.userPaperCount(state),
    userPaperDayCount: quizSelectors.userPaperDayCount(state),
  })
)(AttemptEnd)

export {
  ConnectedAttemptEnd as AttemptEnd
}
