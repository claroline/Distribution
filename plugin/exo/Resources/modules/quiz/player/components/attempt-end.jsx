import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {tex} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {select as playerSelectors} from './../selectors'
import quizSelectors from './../../selectors'
import {selectors as paperSelectors} from './../../papers/selectors'
import {utils as paperUtils} from './../../papers/utils'
import {ScoreGauge} from './../../../components/score-gauge.jsx'

const AttemptEnd = props => {
  const showScore = paperUtils.showScore(props.admin, props.paper.finished, paperSelectors.showScoreAt(props.paper), paperSelectors.showCorrectionAt(props.paper), paperSelectors.correctionDate(props.paper))
  const showCorrection = paperUtils.showCorrection(props.admin, props.paper.finished, paperSelectors.showCorrectionAt(props.paper), paperSelectors.correctionDate(props.paper))
  const answers = Object.keys(props.answers).map(key => props.answers[key])

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
            <div dangerouslySetInnerHTML={{__html: props.endMessage}}></div> :
            <div>
              <h2 className="step-title">{tex('attempt_end_title')}</h2>
              <p>{tex('attempt_end_info')}</p>
            </div>
          }

          {props.endNavigation && showCorrection &&
            <a href={`#papers/${props.paper.id}`} className="btn btn-start btn-lg btn-block btn-primary">
              {tex('view_paper')}
            </a>
          }

          {props.endNavigation &&
            (props.maxAttempts === 0 ||
                (
                    props.userPaperCount < props.maxAttempts &&
                    ((props.userPaperDayCount < props.maxAttemptsPerDay) || props.maxAttemptsPerDay === 0)
                )
            ) && ((props.paperCount < props.maxPapers) || props.maxPapers === 0) &&
                <a href="#play" className="btn btn-start btn-lg btn-primary btn-block">
                    {tex('exercise_restart')}
                </a>
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
  endNavigation: T.bool.isRequired
}

const ConnectedAttemptEnd = connect(
  (state) => ({
    userPaperCount: state.quiz.meta.userPaperCount,
    userPaperDayCount: state.quiz.meta.userPaperDayCount,
    paperCount: state.quiz.meta.paperCount,
    maxAttempts: state.quiz.parameters.maxAttempts,
    maxAttemptsPerDay: state.quiz.parameters.maxAttemptsPerDay,
    maxPapers: state.quiz.parameters.maxPapers,
    admin: resourceSelect.editable(state) || quizSelectors.papersAdmin(state),
    paper: playerSelectors.paper(state),
    endMessage: playerSelectors.quizEndMessage(state),
    endNavigation: playerSelectors.quizEndNavigation(state),
    answers: playerSelectors.answers(state)
  })
)(AttemptEnd)

export {
  ConnectedAttemptEnd as AttemptEnd
}
