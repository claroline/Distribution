import {connect} from 'react-redux'

import {actions as listActions} from '#/main/app/content/list/store'

import {selectors as toolSelectors} from  '#/main/core/tool/store'
import {actions, selectors} from '#/main/core/tools/dashboard/path/store'
import {Paths as PathsComponent} from '#/main/core/tools/dashboard/path/components/paths'

const Paths = connect(
  (state) => ({
    workspaceId: toolSelectors.contextData(state).uuid,
    trackings: selectors.trackings(state)
  }),
  (dispatch) => ({
    fetchPathsData(workspaceId) {
      dispatch(actions.fetchPathsData(workspaceId))
    },
    invalidateEvaluations() {
      dispatch(listActions.invalidateData(selectors.STORE_NAME + '.evaluations'))
    }
  })
)(PathsComponent)

export {
  Paths
}
