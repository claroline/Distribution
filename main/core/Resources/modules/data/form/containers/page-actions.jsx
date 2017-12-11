import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {FormPageActions as FormPageActionsComponent} from '#/main/core/layout/form/components/page-actions.jsx'

import {actions} from '#/main/core/data/form/actions'
import {select} from '#/main/core/data/form/selectors'

const FormPageActions = props =>
  <FormPageActionsComponent
    {...props}
  />

FormPageActions.propTypes = {
  formName: T.string.isRequired
}

const FormPageActionsContainer = connect(
  (state, ownProps) => ({
    saveEnabled: select.saveEnabled(select.form(state, ownProps.formName))
  }),
  (dispatch, ownProps) => ({
    save(targetUrl) {
      dispatch(actions.saveForm(ownProps.formName, targetUrl))
    },
    cancel() {
      dispatch(actions.cancelChanges(ownProps.formName))
    }
  }),
  (stateProps, dispatchProps, ownProps) => Object.assign({}, ownProps, {
    save: Object.assign({}, ownProps.save || {}, {
      disabled: !stateProps.saveEnabled || (ownProps.save && ownProps.save.disabled),
      action: dispatchProps.save
    }),
    cancel: Object.assign({}, ownProps.cancel || {}, {
      action: dispatchProps.cancel
    })
  })
)(FormPageActions)

export {
  FormPageActionsContainer
}
