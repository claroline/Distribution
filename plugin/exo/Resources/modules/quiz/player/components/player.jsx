import React, {Component} from 'react'
import {connect} from 'react-redux'
import Panel from 'react-bootstrap/lib/Panel'

import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import {select} from './../selectors'

import {actions} from './../actions'
import {Player as ItemPlayer} from './../../../items/components/player.jsx'
import {PlayerNav} from './nav-bar.jsx'

const T = React.PropTypes

class Player extends Component {
  render() {
    return (
      <div className="quiz-player">
        <h2 className="h4 step-title">
          {tex('step')}&nbsp;{this.props.number}
          {this.props.step.title && <small>{this.props.step.title}</small>}
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
  items: T.array.isRequired
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
      dispatch(actions.changeCurrentStep(stepId))
    },
    finishAttempt() {

    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
