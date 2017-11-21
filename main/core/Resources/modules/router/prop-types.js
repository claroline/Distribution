import {PropTypes as T} from 'prop-types'

const Route = {
  propTypes: {
    path: T.string.isRequired,
    component: T.element.isRequired,
    exact: T.bool,
    canEnter: T.func,
    onEnter: T.func,
    onLeave: T.func
  },
  defaultProps: {
    exact: false
  }
}

export {
  Route
}
