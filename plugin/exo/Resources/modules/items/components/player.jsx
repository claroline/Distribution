import React, { Component } from 'react'

const T = React.PropTypes

const Hints = () =>
  <div>
    This is the hint section
  </div>

Hints.propTypes = {
  hints: T.array.isRequired
}

export class Player extends Component {
  render() {
    return (
      <div className="item-player">
        <p>{this.props.item.content}</p>

        <hr/>
        {this.props.children}
        <hr/>
        {this.props.item.hints && 0 !== this.props.item.hints.length && <Hints hints={this.props.item.hints} />}
      </div>
    )
  }
}

Player.propTypes = {
  item: T.shape({
    content: T.string.isRequired,
    hints: T.array
  }).isRequired,
  children: T.node.isRequired
}
