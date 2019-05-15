import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {File} from '#/main/core/files/prop-types'

const Audio = merge({}, File, {
  propTypes: {
    sectionCommentsAllowed: T.bool,
    rateControl: T.bool
  }
})

export {
  Audio
}
