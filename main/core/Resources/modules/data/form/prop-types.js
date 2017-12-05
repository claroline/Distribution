import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'

// todo use layout/form/prop-types
const DataFormProperty = {
  propTypes: {
    validating: T.bool,

    name: T.string.isRequired,
    type: T.string,
    label: T.string.isRequired,
    help: T.string,
    hideLabel: T.bool,
    disabled: T.bool,
    options: T.object,
    required: T.bool,
    onChange: T.func,

    value: T.any,
    error: T.string
  },
  defaultProps: {
    required: false,
    hideLabel: false,
    disabled: false
  }
}

export {
  DataFormProperty
}
