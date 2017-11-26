import {PropTypes as T} from 'prop-types'

const FlyingAlert = {
  propTypes: {
    type: T.oneOf(
      ['success', 'warning', 'error', 'info', 'loading']
    ).isRequired,
    message: T.string.isRequired,
    details: T.string
  },
  defaultProps: {

  }
}

export {
  FlyingAlert
}
