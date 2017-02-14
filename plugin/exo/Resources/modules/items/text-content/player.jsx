import React, {Component, PropTypes as T} from 'react'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import {tex, t} from './../../utils/translate'

class TextContentPlayer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="pair-question-player">
        Text contentPlayer
      </div>
    )
  }
}

TextContentPlayer.propTypes = {
}

export {TextContentPlayer}
