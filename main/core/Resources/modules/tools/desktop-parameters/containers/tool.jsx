import {connect} from 'react-redux'

import {Tool} from '#/main/core/tools/desktop-parameters/components/tool'
import {selectors, actions} from '#/main/core/tools/desktop-parameters/store'

const WorkspacesTool = connect(
  (state) => ({
    tools: selectors.tools(state),
    toolsConfig: selectors.toolsConfig(state)
  }),
  (dispatch) => ({
    open(workspaceId) {
      dispatch(actions.open(workspaceId))
    }
  })
)(Tool)

export {
  WorkspacesTool
}
