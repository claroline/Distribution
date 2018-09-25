import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {
  actions as formActions,
  selectors as formSelect
} from '#/main/app/content/form/store'

import {RoleRegistrationModal as RoleRegistrationModalComponent} from '#/main/core/administration/workspace/workspace/modals/registration/components/modal'
import {selectors} from '#/main/core/administration/workspace/workspace/modals/registration/store/selectors'
import {reducer} from '#/main/core/administration/workspace/workspace/modals/registration/store/reducer'

const RoleRegistrationModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      //saveEnabled: formSelect.saveEnabled(formSelect.form(state, selectors.STORE_NAME))
    }),
    (dispatch) => ({
      /*loadWorkspace(workspace) {
        dispatch(formActions.resetForm(selectors.STORE_NAME, workspace))
      },
      saveWorkspace(workspace) {
        dispatch(formActions.saveForm(selectors.STORE_NAME, ['apiv2_workspace_update', {id: workspace.id}]))
      }*/
    })
  )(RoleRegistrationModalComponent)
)

export {
  RoleRegistrationModal
}
