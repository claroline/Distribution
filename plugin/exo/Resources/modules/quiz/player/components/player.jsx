import React, {Component} from 'react'
import {connect} from 'react-redux'
import Panel from 'react-bootstrap/lib/Panel'

import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import {select} from './../selectors'

import {actions as playerActions} from './../actions'
import {actions as quizActions} from './../../actions'
import {VIEW_OVERVIEW} from './../../enums'

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
              {React.createElement(
                getDefinition(item.type).player.component,
                {
                  item: item,
                  onChange: () => true
                }
              )}
            </ItemPlayer>
          </Panel>
        ))}

        <PlayerNav
          previous={this.props.previous}
          next={this.props.next}
          navigateTo={this.props.navigateTo}
          finishAttempt={this.props.finishAttempt}
        />
      </div>
    )
  }
}

Player.propTypes = {
  number: T.number.isRequired,
  step: T.shape({
    title: T.string,
    description: T.string
  }),
  items: T.array.isRequired,
  next: T.string,
  previous: T.string,
  navigateTo: T.func.isRequired,
  finishAttempt: T.func.isRequired
}

Player.defaultProps = {
  next: null,
  previous: null
}

function mapStateToProps(state) {
  return {
    number: select.currentStepNumber(state),
    step: select.currentStep(state),
    items: select.currentStepItems(state),
    next: select.nextStep(state),
    previous: select.previousStep(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    navigateTo(stepId) {
      dispatch(playerActions.changeCurrentStep(stepId))
    },
    finishAttempt() {
      dispatch(quizActions.updateViewMode(VIEW_OVERVIEW))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
