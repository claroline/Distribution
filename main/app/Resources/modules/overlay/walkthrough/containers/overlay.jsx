import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {WalkthroughOverlay as WalkthroughOverlayComponent} from '#/main/app/overlay/walkthrough/components/overlay'
import {actions, selectors, reducer} from '#/main/app/overlay/walkthrough/store'

const WalkthroughOverlay = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      active: selectors.active(state),
      current: selectors.currentStep(state),
      hasNext: selectors.hasNext(state),
      hasPrevious: selectors.hasPrevious(state)
    }),
    (dispatch) => ({
      restart() {
        dispatch(actions.restart())
      },
      skip() {
        dispatch(actions.skip())
      },
      next() {
        dispatch(actions.next())
      },
      previous() {
        dispatch(actions.previous())
      },
      finish() {
        dispatch(actions.finish())
      }
    })
  )(WalkthroughOverlayComponent)
)

export {
  WalkthroughOverlay
}
