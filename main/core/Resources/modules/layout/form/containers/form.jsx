import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {Form as FormComponent} from '#/main/core/layout/form/components/form.jsx'
import {actions} from '#/main/core/layout/form/actions'
import {select} from '#/main/core/layout/form/selectors'

const Form = props =>
  <FormComponent
    {...props}

    data={props.data}
    errors={props.errors}
    pendingChanges={props.pendingChanges}
    validating={props.validating}
    updateProp={props.updateProp}
    setErrors={props.setErrors}
  >
    {props.children}
  </FormComponent>

Form.propTypes = {
  name: T.string.isRequired,
  children: T.element,

  // retrieved from store
  data: T.object,
  errors: T.object,
  pendingChanges: T.bool,
  validating: T.bool,
  setErrors: T.func.isRequired,
  updateProp: T.func.isRequired
}

Form.defaultProps = {
  data: {},
  errors: {},
  pendingChanges: false,
  validating: false
}

const FormContainer = connect(
  (state, ownProps) => {
    // get the root of the form in the store
    const formState = get(state, ownProps.name)

    return {
      data: select.data(formState),
      errors: select.errors(formState),
      pendingChanges: select.pendingChanges(formState),
      validating: select.validating(formState)
    }
  },
  (dispatch, ownProps) => ({
    setErrors(errors) {
      dispatch(actions.setErrors(ownProps.name, errors))
    },
    updateProp(propName, propValue) {
      dispatch(actions.updateProp(ownProps.name, propName, propValue))
    }
  })
)(Form)

export {
  FormContainer
}