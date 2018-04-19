import {PropTypes as T} from 'prop-types'

const Button = {
  propTypes: {
    className: T.string,
    size: T.oneOf(['sm', 'lg']),
    children: T.node.isRequired,
    disabled: T.bool,
    primary: T.bool,
    active: T.bool,
    dangerous: T.bool,
    tabIndex: T.number
  },
  defaultProps: {
    disabled: false,
    primary: false,
    dangerous: false
  }
}

export {
  Button
}
