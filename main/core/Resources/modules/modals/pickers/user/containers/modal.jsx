import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {
  actions as listActions,
  select as listSelect
} from '#/main/app/content/list/store'

import {reducer, selectors} from '#/main/core/modals/pickers/user/store'
import {UsersPickerModal as UsersPickerModalComponent} from '#/main/core/modals/pickers/user/components/modal'

const UsersPickerModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      selectedFull: listSelect.selectedFull(listSelect.list(state, selectors.STORE_NAME))
    }),
    (dispatch) => ({
      resetSelect() {
        dispatch(listActions.resetSelect(selectors.STORE_NAME))
      }
    })
  )(UsersPickerModalComponent)
)

export {
  UsersPickerModal
}