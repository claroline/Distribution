import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import {actions} from './../actions'
import {selectors as correctionSelectors} from './../selectors'
import {tex} from './../../../utils/translate'
import Panel from 'react-bootstrap/lib/Panel'
import InputGroup from 'react-bootstrap/lib/InputGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import {Textarea} from './../../../components/form/textarea.jsx'
import {TooltipButton} from './../../../components/form/tooltip-button.jsx'

export const AnswerRow = props =>
  <div>
    <div className="row answer-row">
      <div>
        <Panel key={props.id}>
          <div dangerouslySetInnerHTML={{__html: props.data}}></div>
        </Panel>
      </div>
      <div className="right-controls">
        <InputGroup className="score-input">
          <FormControl key={props.id}
                       type="text"
                       value={props.score !== undefined && props.score !== null && !isNaN(props.score) ? props.score : ''}
                       onChange={(e) => props.updateScore(props.id, e.target.value)}
          />
          <InputGroup.Addon>/{props.scoreMax}</InputGroup.Addon>
        </InputGroup>
        <TooltipButton id={`feedback-${props.id}-toggle`}
                       className="fa fa-comments-o"
                       title={tex('feedback')}
        />
      </div>
    </div>
    <div className="row feedback-row">
      <Textarea
        id={`feedback-${props.id}-data`}
        title={tex('response')}
        content={props.feedback ? `${props.feedback}` : ''}
        onChange={(text) => props.updateFeedback(props.id, text)}
      />
    </div>
    <div className="row">
      <hr/>
    </div>
  </div>

AnswerRow.propTypes = {
  id: T.string.isRequired,
  questionId: T.string.isRequired,
  type: T.string.isRequired,
  data: T.string.isRequired,
  score: T.number,
  scoreMax: T.number,
  feedback: T.string,
  updateScore: T.func.isRequired,
  updateFeedback: T.func.isRequired
}

let Answers = props =>
  <div className="answers-list">
    <h4 dangerouslySetInnerHTML={{__html: props.question.content}}></h4>
    {props.answers.map((answer, idx) =>
      <AnswerRow key={idx}
                 scoreMax={props.question.score && props.question.score.max}
                 updateScore={props.updateScore}
                 updateFeedback={props.updateFeedback}
                 {...answer}
      />
    )}
  </div>

Answers.propTypes = {
  question: T.object.isRequired,
  answers: T.arrayOf(T.object).isRequired,
  updateScore: T.func.isRequired,
  updateFeedback: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    question: correctionSelectors.currentQuestion(state),
    answers: correctionSelectors.answers(state)
  }
}

const ConnectedAnswers = connect(mapStateToProps, actions)(Answers)

export {ConnectedAnswers as Answers}