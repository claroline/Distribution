import React, { Component } from 'react'

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
          <ItemPlayer key={item.id}>
            {React.createElement(
              getDefinition(item.type).player.component,
              {
                item: item
              }
            )}
          </ItemPlayer>
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
