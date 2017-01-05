import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import Panel from 'react-bootstrap/lib/Panel'
import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import selectQuiz from './../../selectors'
import {select} from './../selectors'
import {actions as playerActions} from './../actions'
import {ItemPlayer} from './item-player.jsx'
import {PlayerNav} from './nav-bar.jsx'

export const Player = props =>
  <div className="quiz-player">
    <h2 className="h4 step-title">
      {props.step.title ?
        <span>{props.step.title}</span>
        :
        <span>{tex('step')}&nbsp; {props.number}</span>
      }
    </h2>

    {props.step.description &&
      <div className="step-description" dangerouslySetInnerHTML={{ __html: props.step.description }}>

      </div>
    }

    {props.items.map((item) => (
      <Panel
        key={item.id}
        collapsible={true}
        expanded={true}
      >
        <ItemPlayer item={item}>
          {React.createElement(getDefinition(item.type).player, {
            item: item,
            answer: props.answers[item.id] ? props.answers[item.id].data : undefined,
            onChange: (answerData) => props.updateAnswer(item.id, answerData)
          })}
        </ItemPlayer>
      </Panel>
    ))}

    <PlayerNav
      previous={props.previous}
      next={props.next}
      navigateTo={(step) => props.navigateTo(props.quizId, props.paper.id, step, props.answers)}
      submit={() => props.submit(props.quizId, props.paper.id, props.answers)}
      finish={() => props.finish(props.quizId, props.paper, props.answers)}
    />
    </div>

Player.propTypes = {
  quizId: T.string.isRequired,
  number: T.number.isRequired,
  step: T.shape({
    title: T.string,
    description: T.string
  }),
  items: T.array.isRequired,
  answers: T.object.isRequired,
  paper: T.shape({
    id: T.string.isRequired,
    number: T.number.isRequired
  }).isRequired,
  next: T.shape({
    id: T.string.isRequired,
    items: T.arrayOf.arrayOf
  }),
  previous: T.shape({
    id: T.string.isRequired,
    items: T.arrayOf.arrayOf
  }),
  updateAnswer: T.func.isRequired,
  navigateTo: T.func.isRequired,
  submit: T.func.isRequired,
  finish: T.func.isRequired
}

Player.defaultProps = {
  next: null,
  previous: null
}

function mapStateToProps(state) {
  return {
    quizId: selectQuiz.id(state),
    number: select.currentStepNumber(state),
    step: select.currentStep(state),
    items: select.currentStepItems(state),
    paper: select.paper(state),
    answers: select.currentStepAnswers(state),
    next: select.next(state),
    previous: select.previous(state)
  }
}

export default connect(mapStateToProps, playerActions)(Player)
