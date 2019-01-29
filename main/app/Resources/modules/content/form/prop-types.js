import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {DataProperty} from '#/main/app/data/types/prop-types'

// todo use layout/form/prop-types

const DataFormProperty = {
  propTypes: merge({}, DataProperty.propTypes, {
    // form configuration
    placeholder: T.any,
    help: T.oneOfType([T.string, T.arrayOf(T.string)]),
    hideLabel: T.bool,
    displayed: T.oneOfType([
      T.bool,
      T.func // a function that receives the whole form data and returns the new state
    ]),
    required: T.bool,
    disabled: T.oneOfType([
      T.bool,
      T.func // a function that receives the whole form data and returns the new state
    ]),
    readOnly: T.bool,

    // field methods
    onChange: T.func,
    validate: T.func
  }),
  defaultProps: merge({}, DataProperty.defaultProps, {
    required: false,
    hideLabel: false,
    disabled: false,
    readOnly: false,
    displayed: true
  })
}

// todo merge with DataDetailsSection
const DataFormSection = {
  propTypes: {
    icon: T.string,
    title: T.string.isRequired,
    primary: T.bool,
    displayed: T.oneOfType([T.bool, T.func]),
    defaultOpened: T.bool,
    fields: T.arrayOf(T.shape(
      merge({}, DataFormProperty.propTypes, {
        // children
        linked: T.arrayOf(T.shape(
          DataFormProperty.propTypes
        ))
      })
    )).isRequired
  },
  defaultProps: {
    primary: false,
    displayed: true,
    defaultOpened: false,
    fields: []
  }
}

export {
  DataFormSection,
  DataFormProperty
}
