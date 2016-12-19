import React, { Component } from 'react'
import {connect} from 'react-redux'

import StepPlayer from './step-player.jsx'
import PlayerNav from './nav-bar.jsx'

class Player extends Component {
  render() {
    return (
      <div className="quiz-player">
        <StepPlayer items={[]} />
        <PlayerNav />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    items: state.items,
    attempt: state.attempt
  }
}

export default connect(mapStateToProps)(Player)
