import {connect} from 'react-redux'

import {actions} from '#/main/core/layout/modal/actions'
import {select} from '#/main/app/overlay/modal/selectors'

import {ModalOverlay as ModalOverlayComponent} from '#/main/app/overlay/modal/components/overlay'

const ModalOverlay = connect(
  (state) => ({
    modal: select.modal(state)
  }),
  (dispatch) => ({
    fadeModal() {
      dispatch(actions.fadeModal())
    },
    hideModal() {
      dispatch(actions.hideModal())
    }
  })
)(ModalOverlayComponent)

export {
  ModalOverlay
}
