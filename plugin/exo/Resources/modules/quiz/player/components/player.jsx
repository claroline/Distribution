import React, {Component} from 'react'
import {connect} from 'react-redux'
import Panel from 'react-bootstrap/lib/Panel'

import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import selectQuiz from './../../selectors'
import {select} from './../selectors'

import {actions as playerActions} from './../actions'

import {Player as ItemPlayer} from './../../../items/components/player.jsx'
import {PlayerNav} from './nav-bar.jsx'

const T = React.PropTypes

class Player extends Component {
  render() {
    return (
      <div className="quiz-player">
        <h2 className="h4 step-title">
          {tex('step')}&nbsp;{this.props.number}
          {this.props.step.title && <small>&nbsp;{this.props.step.title}</small>}
        </h2>

        {this.props.step.description &&
          <div className="exercise-description panel panel-default">
            <div
              className="panel-body"
              dangerouslySetInnerHTML={{ __html: this.props.step.description }}
            ></div>
          </div>
        }

        {this.props.items.map((item) => (
          <Panel
            key={item.id}
            header={item.title}
            collapsible={true}
            expanded={true}
          >
            <ItemPlayer item={item}>
              {React.createElement(getDefinition(item.type).player.component, {
                item: item,
                answer: this.props.answers[item.id] ? this.props.answers[item.id].data : undefined,
                onChange: (answerData) => this.props.updateAnswer(item.id, answerData)
              })}
            </ItemPlayer>
          </Panel>
        ))}

        <PlayerNav
          previous={this.props.previous}
          next={this.props.next}
          navigateTo={(step) => this.props.navigateTo(this.props.quizId, this.props.paper.id, step, this.props.answers)}
          submit={() => this.props.submit(this.props.quizId, this.props.paper.id, this.props.answers)}
          finish={() => this.props.finish(this.props.quizId, this.props.paper, this.props.answers)}
        />
      </div>
    )
  }
}

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
