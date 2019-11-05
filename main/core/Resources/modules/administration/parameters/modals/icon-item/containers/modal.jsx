import {connect} from 'react-redux'

import {actions as formActions, selectors as formSelect} from '#/main/app/content/form/store'

import {selectors} from '#/main/core/administration/parameters/store'
import {actions as iconActions} from '#/main/core/administration/parameters/icon/store'
import {IconItemFormModal as IconItemFormModalComponent} from '#/main/core/administration/parameters/modals/icon-item/components/modal'

const IconItemFormModal = connect(
  (state) => ({
    new: formSelect.isNew(formSelect.form(state, selectors.STORE_NAME+'.icons.item')),
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, selectors.STORE_NAME+'.icons.item')),
    iconItem: formSelect.data(formSelect.form(state, selectors.STORE_NAME+'.icons.item'))
  }),
  (dispatch) => ({
    updateIconItem(iconSet, iconItem) {
      dispatch(iconActions.updateIconItem(iconSet, iconItem))
    },
    updateProp(prop, value) {
      dispatch(formActions.updateProp(selectors.STORE_NAME+'.icons.item', prop, value))
    }
  })
)(IconItemFormModalComponent)

export {
  IconItemFormModal
}
