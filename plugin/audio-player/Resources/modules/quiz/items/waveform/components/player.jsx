import React from 'react'
import {PropTypes as T} from 'prop-types'

const WaveformPlayer = (props) =>
  <div>
    Waveform player
  </div>

WaveformPlayer.propTypes = {
  item: T.shape({

  }).isRequired,
  answer: T.array,
  disabled: T.bool.isRequired,
  onChange: T.func.isRequired
}

WaveformPlayer.defaultProps = {
  answer: [],
  disabled: false
}

export {
  WaveformPlayer
}
