import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {withReducer} from '#/main/app/store/components/withReducer'
import {actions as securityActions} from '#/main/app/security/store'
import {actions as modalActions} from '#/main/app/overlays/modal/store'
import {selectors as configSelectors} from '#/main/app/config/store'
import {actions as formActions, selectors as formSelectors} from '#/main/app/content/form/store'

import {MODAL_CONNECTION} from '#/main/app/modals/connection'
import {LoginForm as LoginFormComponent} from '#/main/app/security/login/components/form'
import {reducer, selectors} from '#/main/app/security/login/store'

const LoginForm = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      registration: configSelectors.param(state, 'selfRegistration'),
      sso: selectors.sso(state),
      primarySso: selectors.primarySso(state)
    }),
    (dispatch) => ({
      login(callback) {
        dispatch((dispatch, getState) => {
          const formData = formSelectors.data(formSelectors.form(getState(), selectors.FORM_NAME))

          dispatch(formActions.submit(selectors.FORM_NAME))

          return dispatch(securityActions.login(formData.username, formData.password, formData.remember_me)).then(
            (response) => {
              if (!isEmpty(response.messages)) {
                dispatch(modalActions.showModal(MODAL_CONNECTION, {
                  messages: response.messages
                }))
              }

              if (callback) {
                callback(response)
              }
            },
            () => dispatch(formActions.setErrors(selectors.FORM_NAME, {password: trans('Votre identifiant ou votre mot de passe est incorrect.', {}, 'validators')}))
          )
        })
      }
    })
  )(LoginFormComponent)
)

export {
  LoginForm
}
