import React, { Component } from 'react'

const T = React.PropTypes

export default class PlayerNav extends Component {
  render() {
    return (
      <div className="player-nav">
        <button className="btn btn-default">
          <span className="fa fa-fw fa-chevron-left"></span>
          Previous
        </button>

        <button className="btn btn-default">
          Next
          <span className="fa fa-fw fa-chevron-right"></span>
        </button>
      </div>
    )
  }
}

PlayerNav.propTypes = {
/*  handleNextStep: T.func,
  handlePreviousStep: t.func,
  handleFinish*/
}
