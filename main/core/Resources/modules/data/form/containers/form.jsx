import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import invariant from 'invariant'
import get from 'lodash/get'
import set from 'lodash/set'

import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {Form} from '#/main/core/data/form/components/form'
import {actions} from '#/main/core/data/form/actions'
import {select} from '#/main/core/data/form/selectors'

const FormContainer = connect(
  (state, ownProps) => {
    // get the root of the form in the store
    const formState = select.form(state, ownProps.name)

    invariant(undefined !== formState, `Try to connect form on undefined store '${ownProps.name}'.`)

    let data = select.data(formState)
    let errors = select.errors(formState)
    if (ownProps.dataPart) {
      // just select what is related to the managed data part
      data = get(data, ownProps.dataPart)
      errors = get(errors, ownProps.dataPart)
    }

    return {
      new: select.isNew(formState),
      data: data,
      errors: errors,
      pendingChanges: select.pendingChanges(formState),
      validating: select.validating(formState)
    }
  },
  (dispatch, ownProps) => ({
    setErrors(errors) {
      if (ownProps.dataPart) {
        errors = set({}, ownProps.dataPart, errors)
      }

      dispatch(actions.setErrors(ownProps.name, errors))
    },

    updateProp(propName, propValue) {
      if (ownProps.dataPart) {
        propName = ownProps.dataPart+'.'+propName
      }

      dispatch(actions.updateProp(ownProps.name, propName, propValue))
    },

    saveForm(targetUrl) {
      dispatch(actions.saveForm(ownProps.name, targetUrl))
    },
    cancelForm() {
      dispatch(actions.cancelChanges(ownProps.name))
    }
  }),
  (stateProps, dispatchProps, ownProps) => {
    let finalProps = Object.assign({}, ownProps, stateProps, dispatchProps)

    if (ownProps.buttons) {
      // we need to build the form buttons
      finalProps = Object.assign(finalProps, {
        save: ownProps.save ? Object.assign({}, ownProps.save, {
            // append the api call to the defined action if the target is provided
            onClick: () => {
              if (ownProps.target) {
                dispatchProps.saveForm(url(
                  typeof ownProps.target === 'function' ? ownProps.target(stateProps.data, stateProps.new) : ownProps.target
                ))
              }
            }
          }) : {
            type: 'callback',
            callback: () => {
              if (ownProps.target) {
                dispatchProps.saveForm(url(
                  typeof ownProps.target === 'function' ? ownProps.target(stateProps.data, stateProps.new) : ownProps.target
                ))
              }
            }
          },
        cancel: ownProps.cancel ? Object.assign({}, ownProps.cancel, {
            // append the reset form callback to the defined action
            onClick: () => dispatchProps.cancelForm()
          }) : {
            type: 'callback',
            disabled: !stateProps.pendingChanges,
            callback: () => dispatchProps.cancelForm()
          }
      })
    } else {
      // make sure save & cancel actions are not passed to the component
      finalProps = Object.assign(finalProps, {
        save: undefined,
        cancel: undefined
      })
    }

    return finalProps
  }
)(Form)

FormContainer.propTypes = {
  /**
   * The name of the data in the form.
   *
   * It should be the key in the store where the list has been mounted
   * (aka where `makeFormReducer()` has been called).
   */
  name: T.string.isRequired,

  /**
   * Permits to connect the form on a sub-part of the data.
   * This is useful when the form is broken in multiple steps/pages
   *
   * It MUST be a valid lodash/get selector.
   */
  dataPart: T.string,

  /**
   * Do we need to show the form buttons ?
   */
  buttons: T.bool,

  /**
   * The API target of the Form (only used if props.buttons === true).
   *
   * NB. It can be a route definition or a function to calculate the final route.
   * If a function is provided it's called with the current data & new flag as param.
   */
  target: T.oneOfType([T.string, T.array, T.func]),

  /**
   * A custom save action for the form (only used if props.buttons === true).
   *
   * NB. If a target is provided, the api call will be made before executing the custom action.
   */
  save: T.shape({
    type: T.string.isRequired,
    disabled: T.bool
    // todo find a way to document custom action type props
  }),

  /**
   * A custom cancel action for the form (only used if props.buttons === true).
   */
  cancel: T.shape({
    type: T.string.isRequired,
    disabled: T.bool
    // todo find a way to document custom action type props
  })
}

FormContainer.defaultProps = {
  buttons: false
}

export {
  FormContainer
}
