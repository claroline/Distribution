import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'

import {HtmlText} from '#/main/core/layout/components/html-text'
import {HtmlInput} from '#/main/app/data/types/html/components/input'

import {actions} from '#/plugin/exo/resources/quiz/correction/store/actions'
import {selectors as correctionSelectors} from '#/plugin/exo/resources/quiz/correction/store/selectors'

class AnswerRow extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="user-answer panel-body">
          <div className="text-fields">
            {this.props.data && 0 !== this.props.data.length ?
              <HtmlText className="answer-item">{this.props.data}</HtmlText>
              :
              <div className="no-answer">{trans('no_answer', {}, 'quiz')}</div>
            }

            {this.state.showFeedback &&
              <div className="feedback-container">
                <HtmlInput
                  id={`feedback-${this.props.id}-data`}
                  value={this.props.feedback}
                  onChange={(text) => this.props.updateFeedback(this.props.id, text)}
                />
              </div>
            }
          </div>

          <div className="right-controls">
            <span className="input-group score-input">
              <input
                type="number"
                className={classes('form-control', {
                  'has-error': this.props.score && (isNaN(this.props.score) || this.props.score > this.props.scoreMax)
                })}
                value={this.props.score !== undefined && this.props.score !== null ? this.props.score : ''}
                onChange={(e) => this.props.updateScore(this.props.id, e.target.value)}
              />
              <span className="input-group-addon">{`/ ${this.props.scoreMax}`}</span>
            </span>

            <Button
              id={`feedback-${this.props.id}-toggle`}
              className="btn-link"
              type={CALLBACK_BUTTON}
              icon="fa fa-fw fa-comments-o"
              label={trans('feedback', {}, 'quiz')}
              callback={() => this.setState({showFeedback: !this.state.showFeedback})}
            />
          </div>
        </div>
      </div>
    )
  }
}

AnswerRow.propTypes = {
  id: T.string.isRequired,
  questionId: T.string.isRequired,
  data: T.string,
  score: T.string,
  scoreMax: T.number.isRequired,
  feedback: T.string,
  updateScore: T.func.isRequired,
  updateFeedback: T.func.isRequired
}

let Answers = props => {
  if (!props.question) {
    return (
      <div>{trans('please_wait')}</div>
    )
  }

  return (
    <div className="answers-list">
      <h2 className="question-title">
        <HtmlText>
          {props.question.title || props.question.content}
        </HtmlText>

        {props.answers.length > 0 &&
          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={!props.saveEnabled}
            onClick={() => props.saveEnabled && props.saveCorrection(props.question.id)}
          >
            <span className="fa fa-fw fa-save"/>
            {trans('save')}
          </button>
        }
      </h2>
      {props.answers.length > 0 ?
        props.answers.map((answer, idx) =>
          <AnswerRow
            key={idx}
            scoreMax={props.question.score && props.question.score.max}
            updateScore={props.updateScore}
            updateFeedback={props.updateFeedback}
            {...answer}
          />
        ) :
        <div className="alert alert-warning">
          {trans('no_answer_to_correct', {}, 'quiz')}
        </div>
      }
    </div>
  )
}

Answers.propTypes = {
  question: T.shape({
    id: T.string.isRequired,
    title: T.string,
    content: T.string.isRequired,
    score: T.object.isRequired
  }).isRequired,
  answers: T.arrayOf(T.object).isRequired,
  saveEnabled: T.bool.isRequired,
  updateScore: T.func.isRequired,
  updateFeedback: T.func.isRequired,
  saveCorrection: T.func.isRequired
}

const ConnectedAnswers = connect(
  (state) => ({
    question: correctionSelectors.currentQuestion(state),
    answers: correctionSelectors.answers(state),
    saveEnabled: correctionSelectors.hasCorrection(state)
  }),
  actions
)(Answers)

export {
  ConnectedAnswers as Answers
}
