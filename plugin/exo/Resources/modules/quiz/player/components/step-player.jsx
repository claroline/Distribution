import React, { Component } from 'react'

const T = React.PropTypes

export default class StepPlayer extends Component {
  render() {
    return (
      <div className="step-player">
        <h2 className="step-title"></h2>
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
