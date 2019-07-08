import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

// the store to use
import {actions, reducer, selectors} from '#/main/app/overlays/modal/store'
// the component to connect
import {ModalOverlay as ModalOverlayComponent} from '#/main/app/overlays/modal/components/overlay'

const ModalOverlay = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      show: selectors.show(state),
      modals: selectors.modals(state)
    }),
    (dispatch) => ({
      fadeModal(modalId) {
        dispatch(actions.fadeModal(modalId))
      },
      hideModal(modalId) {
        dispatch(actions.hideModal(modalId))
      }
    }),
    undefined,
    {
      areStatesEqual: (next, prev) => selectors.modals(prev) === selectors.modals(next)
    }
  )(ModalOverlayComponent)
)

export {
  ModalOverlay
}
