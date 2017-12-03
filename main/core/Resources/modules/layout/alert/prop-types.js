import {PropTypes as T} from 'prop-types'

import {constants} from '#/main/core/layout/alert/constants'

const FlyingAlert = {
  propTypes: {
    action: T.oneOf(
      Object.keys(constants.ALERT_ACTIONS)
    ).isRequired,
    status: T.oneOf(
      Object.keys(constants.ALERT_STATUS)
    ).isRequired,
    title: T.string,
    message: T.string.isRequired
  }
}

export {
  FlyingAlert
}
