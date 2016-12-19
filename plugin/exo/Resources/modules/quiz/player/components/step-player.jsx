import React, { Component } from 'react'
import Panel from 'react-bootstrap/lib/Panel'

import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import {Player as ItemPlayer} from './../../../items/components/player.jsx'

const T = React.PropTypes

export default class StepPlayer extends Component {
  render() {
    return (
      <div className="step-player">
        <h2 className="step-title">
          {tex('step')}&nbsp;{this.props.number}
          {null !== this.props.title && <small>{this.props.title}</small>}
        </h2>

        {this.props.items.map((item) => (
          <Panel
            header={
            "coucou"
          }
            collapsible={true}
            expanded={true}
          >
            <ItemPlayer key={item.id}>
              {React.createElement(
                getDefinition(item.type).player.component,
                {
                  item: item
                }
              )}
            </ItemPlayer>
          </Panel>
        ))}
      </div>
    )
  }
}

StepPlayer.propTypes = {
  number: T.number,
  title: T.string,
  items: T.array.isRequired
}

StepPlayer.defaultProps = {
  number: 1,
  title: null
}