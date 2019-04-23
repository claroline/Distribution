import {PropTypes as T} from 'prop-types'

import {SCORE_MANUAL} from '#/plugin/exo/quiz/enums'

const WaveformItem = {
  propTypes: {
    url: T.string,
    solutions: T.array
  },
  defaultProps: {
    url: null,
    solutions: []
  }
}

export {
  WaveformItem
}
