import {connect} from 'react-redux'
import {withReducer} from '#/main/app/store/components/withReducer'

import {ResetPasswordForm as ResetPasswordFormComponent} from '#/main/app/security/password/components/form'
import {reducer, selectors, actions} from '#/main/app/security/password/store'
import {selectors as formSelectors} from '#/main/app/content/form/store'

const ResetPasswordForm = withReducer(selectors.FORM_NAME, reducer)(
  connect(
    (state) => ({
      form: formSelectors.form(state, selectors.FORM_NAME)
    }),
    (dispatch) => ({
      reset(email) {
        dispatch(actions.reset(email))
      }
    })
  )(ResetPasswordFormComponent)
)

export {
  ResetPasswordForm
}
