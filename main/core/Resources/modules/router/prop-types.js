import {PropTypes as T} from 'prop-types'

const Route = {
  propTypes: {
    path: T.string.isRequired,
    component: T.any.isRequired, // todo find better typing
    exact: T.bool,
    onEnter: T.func,
    onLeave: T.func
  },
  defaultProps: {
    path: '',
    exact: false
  }
}

export {
  Route
}
