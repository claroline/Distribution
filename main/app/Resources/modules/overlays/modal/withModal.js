import {connect} from 'react-redux'

import {actions} from '#/main/app/overlays/modal/store'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * HOC to give a component access to the modals methods.
 * It works like `withRouter` from 'react-router', and injects :
 *
 * - showModal(modal)
 */
function withModal(Component) {
  const WithModal = connect(
    null,
    (dispatch) => ({
      showModal(modalType, modalProps) {
        dispatch(actions.showModal(modalType, modalProps))
      }
    }),
    undefined,
    {
      areStatesEqual: () => true
    }
  )(Component)

  WithModal.displayName = `WithModal(${getDisplayName(Component)})`

  return WithModal
}


export {
  withModal
}
