import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {actions as formActions, selectors as formSelectors} from '#/main/app/content/form/store'

import {CopyModal as CopyModalComponent} from '#/plugin/exo/resources/quiz/editor/modals/item-copy/components/modal'
import {reducer, selectors} from '#/plugin/exo/resources/quiz/editor/modals/item-copy/store'

const CopyModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      positionData: formSelectors.data(formSelectors.form(state, selectors.STORE_NAME)),
      selectEnabled: formSelectors.saveEnabled(formSelectors.form(state, selectors.STORE_NAME))
    }),
    (dispatch) => ({
      reset(currentPosition = {}) {
        dispatch(formActions.reset(selectors.STORE_NAME, currentPosition))
      },
      update(prop, value) {
        dispatch(formActions.updateProp(selectors.STORE_NAME, prop, value))
      }
    })
  )(CopyModalComponent)
)

export {
  CopyModal
}
