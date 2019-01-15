import {connect} from 'react-redux'

import {OpenBadgeAdminTool as OpenBadgeAdminToolComponent} from '#/plugin/open-badge/tools/badges/components/tool'

const ConnectedOpenBadgeAdminTool = connect(
  state => ({
    currentContext: state.currentContext
  }),
  null
)(OpenBadgeAdminToolComponent)

export {
  ConnectedOpenBadgeAdminTool as OpenBadgeAdminTool
}
