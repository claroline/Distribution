import {connect} from 'react-redux'

import {WalkthroughsModal as WalkthroughsModalComponent} from '#/main/app/overlay/walkthrough/modals/walkthroughs/components/modal'
import {actions} from '#/main/app/overlay/walkthrough/store'

const WalkthroughsModal = connect(
  null,
  (dispatch) => ({
    start(scenario) {
      dispatch(actions.start(scenario))
    }
  })
)(WalkthroughsModalComponent)

export {
  WalkthroughsModal
}
