import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'

const WaveformFeedback = props =>
  <div className="waveform-feedback">
    Waveform feedback
  </div>

WaveformFeedback.propTypes = {
  answer: T.array
}

WaveformFeedback.defaultProps = {
  answer: []
}

export {
  WaveformFeedback
}
