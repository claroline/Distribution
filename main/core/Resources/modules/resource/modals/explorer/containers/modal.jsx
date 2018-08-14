import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {ResourceExplorer} from '#/main/core/resource/explorer/containers/explorer'
import {
  actions,
  selectors as explorerSelectors
} from '#/main/core/resource/explorer/store'

import {ExplorerModal as ExplorerModalComponent} from '#/main/core/resource/modals/explorer/components/modal'
import {reducer, selectors} from '#/main/core/resource/modals/explorer/store'

const ExplorerModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      currentDirectory: explorerSelectors.current(explorerSelectors.explorer(state, selectors.STORE_NAME)),
      selected: explorerSelectors.selectedFull(explorerSelectors.explorer(state, selectors.STORE_NAME))
    }),
    (dispatch) => ({
      initialize(root, current, filters) {
        dispatch(actions.initialize(selectors.STORE_NAME, root, current, filters))
      }
    })
  )(ExplorerModalComponent)
)

export {
  ExplorerModal
}
