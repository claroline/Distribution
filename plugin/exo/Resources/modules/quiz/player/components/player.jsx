import React, {Component} from 'react'
import {connect} from 'react-redux'
import Panel from 'react-bootstrap/lib/Panel'

import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import {select} from './../selectors'

import {Player as ItemPlayer} from './../../../items/components/player.jsx'
import {PlayerNav} from './nav-bar.jsx'

const T = React.PropTypes

class Player extends Component {
  render() {
    return (
      <div className="quiz-player">
        <h2 className="step-title">
          {tex('step')}&nbsp;{this.props.current.number}
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

        <PlayerNav />
      </div>
    )
  }
}

Player.propTypes = {
  current: T.shape({
    number: T.number.isRequired
  }).isRequired,
  step: T.shape({
    title: T.string,
    description: T.string
  }),
  items: T.array.isRequired
}

function mapStateToProps(state) {
  return {
    current: state.currentStep,
    step: select.currentStep(state),
    items: select.currentStepItems(state)
  }
}

export default connect(mapStateToProps)(Player)
