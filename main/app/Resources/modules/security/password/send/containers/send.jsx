import {connect} from 'react-redux'
import {withReducer} from '#/main/app/store/components/withReducer'

import {SendPasswordForm as SendFormComponent} from '#/main/app/security/password/send/components/send'
import {reducer, selectors, actions} from '#/main/app/security/password/send/store'
import {selectors as formSelectors} from '#/main/app/content/form/store'

const SendPasswordForm = withReducer(selectors.FORM_NAME, reducer)(
  connect(
    (state) => ({
      form: formSelectors.form(state, selectors.FORM_NAME)
    }),
    (dispatch) => ({
      reset(email) {
        dispatch(actions.reset(email))
      }
    })
  )(SendFormComponent)
)

export {
  SendPasswordForm
}
