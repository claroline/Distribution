import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

/**
 * Definition of common props of a form field.
 *
 * @type {{propTypes, defaultProps}}
 */
const FormField = {
  propTypes: {
    id: T.string.isRequired,
    value: T.any, // depends on type
    error: T.oneOfType([T.string, T.arrayOf(T.string)]),
    className: T.string,
    placeholder: T.any, // depends on type
    autoComplete: T.string,
    disabled: T.bool,
    size: T.oneOf(['sm', 'lg']),
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
    label: T.string,
    hideLabel: T.bool,
    help: T.oneOfType([T.string, T.arrayOf(T.string)]),
    warnOnly: T.bool,
    error: T.oneOfType([T.string, T.arrayOf(T.string), T.arrayOf(T.arrayOf(T.string))]),
    optional: T.bool
  },
  defaultProps: {
    className: '',
    hideLabel: false,
    warnOnly: false,
    optional: false
  }
}

const FormGroupWithField = implementPropTypes({}, [FormGroup, FormField])

export {
  FormField,
  FormGroup,
  FormGroupWithField
}