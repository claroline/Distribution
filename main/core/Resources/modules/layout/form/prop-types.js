import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'

/**
 * Definition of common props of a form field.
 *
 * @type {{propTypes, defaultProps}}
 */
const FormField = {
  propTypes: {
    id: T.string.isRequired,
    value: T.any,
    placeholder: T.string, // not yet implemented
    disabled: T.bool.isRequired,
    onChange: T.func.isRequired
  },
  defaultProps: {
    disabled: false
  }
}

/**
 * Definition of common props of a form group.
 *
 * @type {{propTypes, defaultProps}}
 */
const FormGroup = {
  propTypes: {
    id: T.string.isRequired,
    className: T.string,
    label: T.string.isRequired,
    hideLabel: T.bool,
    help: T.string,
    warnOnly: T.bool,
    error: T.object
  },
  defaultProps: {
    className: '',
    hideLabel: false,
    warnOnly: false
  }
}

const FormGroupWithField = implementPropTypes({}, [FormGroup, FormField])

export {
  FormField,
  FormGroup,
  FormGroupWithField
}
