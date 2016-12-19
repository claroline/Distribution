import React, { Component } from 'react'

const T = React.PropTypes

export default class Player extends Component {
  render() {
    return (
      <div className="item-player panel panel-default">
        this is an item player
      </div>
    )
  }
}

Player.propTypes = {
  item: T.shape({
    title: T.string,
    content: T.string.isRequired,
    hints: T.array
  }).isRequired
}
