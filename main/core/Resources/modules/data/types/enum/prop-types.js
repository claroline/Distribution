import {PropTypes as T} from 'prop-types'

const EnumOptions = {
  propTypes: {
    choices: T.object.isRequired,
    filterChoices: T.function,
    multiple: T.bool,
    noEmpty: T.bool
  },
  defaultProps: {
    multiple: false,
    noEmpty: false,
    filterChoices: () => true
  }
}

export {
  EnumOptions
}
